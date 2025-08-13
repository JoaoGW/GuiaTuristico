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

  /**
   * Updates the current voice state with the provided partial updates.
   * 
   * @param updates - A partial object containing the properties of the `VoiceState` to update.
   *                  Only the specified properties will be updated, while the rest will remain unchanged.
   * 
   * @example
   * updateVoiceState({ isMuted: true });
   * // Updates the `isMuted` property of the voice state to `true`.
   */
  const updateVoiceState = useCallback((updates: Partial<VoiceState>) => {
    setVoiceState(prev => ({ ...prev, ...updates }));
  }, []);


  /**
   * Adds a new voice message to the current list of messages.
   *
   * @param message - The voice message to be added. It should conform to the `VoiceMessage` type.
   *
   * @remarks
   * This function uses the `useCallback` hook to ensure that the function reference remains stable
   * across renders, preventing unnecessary re-renders in components that depend on it.
   */
  const addMessage = useCallback((message: VoiceMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  
  /**
   * Clears the current messages and resets the voice chat state.
   *
   * This function empties the list of messages and updates the voice chat state
   * by resetting the transcribed text, clearing any errors, and setting the
   * recording URI and duration to their initial values.
   *
   * Dependencies:
   * - `updateVoiceState`: A function to update the state of the voice chat.
   *
   * @returns {void} This function does not return a value.
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    updateVoiceState({ 
      transcribedText: '', 
      error: null, 
      recordingUri: null,
      recordingDuration: 0 
    });
  }, [updateVoiceState]);

  
  /**
   * Starts the voice recording process.
   *
   * This function attempts to initiate a voice recording session using the `voiceService`.
   * If successful, it updates the voice state to indicate that recording has started,
   * resets the transcribed text, and initializes the recording duration.
   * If unsuccessful, it updates the voice state with an appropriate error message.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the recording starts successfully,
   *                             or `false` if an error occurs or permissions are not granted.
   *
   * @throws {Error} Logs an error to the console if an unexpected issue occurs during the recording process.
   *
   * @example
   * const success = await startRecording();
   * if (success) {
   *   console.log('Recording started successfully');
   * } else {
   *   console.error('Failed to start recording');
   * }
   */
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

  
  /**
   * Stops the ongoing voice recording, processes the recorded audio, and updates the application state accordingly.
   * 
   * This function performs the following steps:
   * 1. Stops the recording and retrieves the audio file's URI and duration.
   * 2. Processes the recorded audio to transcribe the user's message and generate an assistant's response.
   * 3. Updates the application state with the transcription, audio details, and any errors encountered.
   * 4. Adds the user's transcribed message and the assistant's response to the message list.
   * 5. Uses text-to-speech to speak the assistant's response, if available.
   * 
   * @async
   * @function
   * @returns {Promise<string | null>} The transcription of the user's message if successful, or `null` if an error occurs.
   * 
   * @throws {Error} Logs an error and updates the state if an exception occurs during the process.
   * 
   * @dependencies
   * - `updateVoiceState`: Updates the state of the voice chat (e.g., recording, transcribing, speaking).
   * - `voiceService.stopRecording`: Stops the recording and retrieves the audio file's details.
   * - `voiceService.processVoiceMessage`: Processes the audio file to transcribe and generate a response.
   * - `voiceService.speakText`: Converts the assistant's response text to speech.
   * - `addMessage`: Adds a new message (user or assistant) to the message list.
   */
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

  
  /**
   * Handles the process of responding with an AI-generated message.
   * 
   * This function creates an assistant message, adds it to the message list,
   * and uses a voice service to speak the response text. It also updates the
   * voice state to indicate whether the assistant is currently speaking.
   * 
   * @param responseText - The text of the response to be spoken and added as a message.
   * 
   * @throws Will log an error to the console if an issue occurs during the response process.
   * 
   * Dependencies:
   * - `addMessage`: Function to add the assistant message to the message list.
   * - `updateVoiceState`: Function to update the state of the voice system.
   * - `voiceService.speakText`: Service to convert the response text into speech.
   */
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

  
  /**
   * Toggles the recording state by either starting or stopping the recording process.
   * 
   * - If recording is currently active (`voiceState.isRecording` is `true`), it stops the recording.
   * - If recording is not active (`voiceState.isRecording` is `false`), it starts the recording.
   * 
   * @returns A promise that resolves when the recording action (start or stop) is completed.
   * 
   * @remarks
   * This function uses `useCallback` to memoize the toggle logic, ensuring it only changes
   * when `voiceState.isRecording`, `startRecording`, or `stopRecording` dependencies change.
   */
  const toggleRecording = useCallback(async () => {
    if (voiceState.isRecording) {
      return await stopRecording();
    } else {
      return await startRecording();
    }
  }, [voiceState.isRecording, startRecording, stopRecording]);

  
  /**
   * Stops the voice service from speaking and updates the voice state to indicate
   * that speaking has stopped.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the voice service has stopped speaking.
   */
  const stopSpeaking = useCallback(async () => {
    await voiceService.stopSpeaking();
    updateVoiceState({ isSpeaking: false });
  }, [updateVoiceState]);

  
  /**
   * Repeats a given text message using a voice service.
   *
   * This function utilizes a callback to handle the process of speaking
   * a given text message. It updates the voice state to indicate when
   * the system is speaking and ensures the state is reset even if an
   * error occurs during the process.
   *
   * @param text - The text message to be spoken.
   * @throws Will log an error to the console if the voice service fails to speak the text.
   *
   * @remarks
   * This function depends on `updateVoiceState` to manage the speaking state
   * and `voiceService.speakText` to perform the text-to-speech operation.
   *
   * @example
   * ```typescript
   * repeatMessage("Hello, world!");
   * ```
   */
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
