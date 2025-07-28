import { useState, useEffect, useCallback } from 'react';
import { voiceService } from '../services/voiceService';
import type { VoiceState, VoiceMessage } from '../../@types/VoiceTypes';

export const useVoiceChat = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isTranscribing: false,
    isSpeaking: false,
    recordingUri: null,
    transcribedText: '',
    error: null,
    recordingDuration: 0,
  });

  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0);

  // Cleanup quando o hook é desmontado
  useEffect(() => {
    return () => {
      voiceService.cleanup();
    };
  }, []);

  // Função para atualizar o estado de voz
  const updateVoiceState = useCallback((updates: Partial<VoiceState>) => {
    setVoiceState(prev => ({ ...prev, ...updates }));
  }, []);

  // Função para adicionar mensagem
  const addMessage = useCallback((message: VoiceMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Função para limpar mensagens
  const clearMessages = useCallback(() => {
    setMessages([]);
    updateVoiceState({ 
      transcribedText: '', 
      error: null, 
      recordingUri: null,
      recordingDuration: 0 
    });
  }, [updateVoiceState]);

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      updateVoiceState({ error: null });
      
      const success = await voiceService.startRecording();
      if (success) {
        setRecordingStartTime(Date.now());
        updateVoiceState({ 
          isRecording: true, 
          transcribedText: '',
          recordingDuration: 0 
        });
        return true;
      } else {
        updateVoiceState({ 
          error: 'Não foi possível iniciar a gravação. Verifique as permissões.' 
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      updateVoiceState({ 
        error: 'Erro ao iniciar a gravação' 
      });
      return false;
    }
  }, [updateVoiceState]);

  // Parar gravação e transcrever
  const stopRecording = useCallback(async () => {
    try {
      updateVoiceState({ isRecording: false, isTranscribing: true });
      
      const result = await voiceService.stopRecording();
      if (result) {
        updateVoiceState({ 
          recordingUri: result.uri,
          recordingDuration: result.duration 
        });

        // Usar nova função unificada: transcrever + gerar resposta em uma única chamada
        const voiceResult = await voiceService.processVoiceMessage(result.uri);
        
        if (voiceResult.success && voiceResult.transcription) {
          // Adicionar mensagem do usuário
          const userMessage: VoiceMessage = {
            id: Date.now().toString(),
            type: 'user',
            text: voiceResult.transcription,
            timestamp: new Date(),
            audioUri: result.uri,
            duration: result.duration,
          };

          addMessage(userMessage);
          updateVoiceState({ 
            transcribedText: voiceResult.transcription,
            isTranscribing: false 
          });

          // Adicionar resposta do Felipe automaticamente
          if (voiceResult.response) {
            const assistantMessage: VoiceMessage = {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              text: voiceResult.response,
              timestamp: new Date(),
            };

            addMessage(assistantMessage);

            // Falar a resposta
            updateVoiceState({ isSpeaking: true });
            await voiceService.speakText(voiceResult.response);
            updateVoiceState({ isSpeaking: false });
          }

          return voiceResult.transcription;
        } else {
          updateVoiceState({ 
            error: voiceResult.error || 'Erro no processamento de voz',
            isTranscribing: false 
          });
          return null;
        }
      } else {
        updateVoiceState({ 
          error: 'Erro ao finalizar a gravação',
          isTranscribing: false 
        });
        return null;
      }
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      updateVoiceState({ 
        error: 'Erro ao processar a gravação',
        isRecording: false,
        isTranscribing: false 
      });
      return null;
    }
  }, [updateVoiceState, addMessage]);

  // Responder com IA
  const respondWithAI = useCallback(async (responseText: string) => {
    try {
      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);

      // Falar a resposta
      updateVoiceState({ isSpeaking: true });
      await voiceService.speakText(responseText);
      updateVoiceState({ isSpeaking: false });
    } catch (error) {
      console.error('Erro ao responder:', error);
      updateVoiceState({ isSpeaking: false });
    }
  }, [updateVoiceState, addMessage]);

  // Toggle de gravação
  const toggleRecording = useCallback(async () => {
    if (voiceState.isRecording) {
      return await stopRecording();
    } else {
      return await startRecording();
    }
  }, [voiceState.isRecording, startRecording, stopRecording]);

  // Parar síntese de voz
  const stopSpeaking = useCallback(async () => {
    await voiceService.stopSpeaking();
    updateVoiceState({ isSpeaking: false });
  }, [updateVoiceState]);

  // Repetir uma mensagem
  const repeatMessage = useCallback(async (text: string) => {
    try {
      updateVoiceState({ isSpeaking: true });
      await voiceService.speakText(text);
      updateVoiceState({ isSpeaking: false });
    } catch (error) {
      console.error('Erro ao repetir mensagem:', error);
      updateVoiceState({ isSpeaking: false });
    }
  }, [updateVoiceState]);

  return {
    // Estados
    voiceState,
    messages,
    
    // Ações
    startRecording,
    stopRecording,
    toggleRecording,
    stopSpeaking,
    repeatMessage,
    respondWithAI,
    clearMessages,
    
    // Utilitários
    isRecording: voiceState.isRecording,
    isTranscribing: voiceState.isTranscribing,
    isSpeaking: voiceState.isSpeaking,
    hasError: !!voiceState.error,
    canRecord: !voiceState.isTranscribing && !voiceState.isSpeaking,
  };
};
