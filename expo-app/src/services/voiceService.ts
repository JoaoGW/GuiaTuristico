import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { VoiceConfig } from '../config/voiceConfig';
import { API_URL } from '../config';

export interface VoiceRecordingResult {
  uri: string;
  duration: number;
}

export interface TranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export class VoiceService {
  private recording: Audio.Recording | null = null;
  private isRecording: boolean = false;
  private recordingTimer: NodeJS.Timeout | null = null;

  /**
   * Obtém a melhor voz masculina disponível na plataforma
   */
  private async getBestMaleVoice(): Promise<string | undefined> {
    try {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      
      // Lista de identificadores de vozes masculinas em português (ordem de preferência)
      const maleVoiceIdentifiers = [
        'pt-br-x-ptd-network', // Google TTS masculina brasileira
        'pt-BR-language', // iOS masculina brasileira
        'com.apple.ttsbundle.Luciana-compact', // iOS alternativa
        'pt-br-x-ptd-local', // Google TTS local
        'Portuguese (Brazil)', // Identificador genérico
        'male', // Fallback genérico
      ];

      // Procurar por vozes masculinas em português
      for (const identifier of maleVoiceIdentifiers) {
        const voice = availableVoices.find(v => 
          v.identifier.toLowerCase().includes(identifier.toLowerCase()) ||
          (v.name && v.name.toLowerCase().includes('male')) ||
          (v.language && v.language.toLowerCase().includes('pt'))
        );
        
        if (voice) {
          return voice.identifier;
        }
      }

      return undefined;
    } catch (error) {
      console.error('Erro ao obter vozes disponíveis:', error);
      return undefined;
    }
  }

  /**
   * Solicita permissões necessárias para gravação de áudio
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  /**
   * Configura o modo de áudio para gravação
   */
  async setupAudioMode(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Erro ao configurar modo de áudio:', error);
    }
  }

  /**
   * Configura o modo de áudio para reprodução (volume alto)
   */
  async setupPlaybackMode(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Erro ao configurar modo de reprodução:', error);
    }
  }

  /**
   * Inicia a gravação de áudio
   */
  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        console.warn('Gravação já está em andamento');
        return false;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permissão de gravação não concedida');
      }

      await this.setupAudioMode();

      const { recording } = await Audio.Recording.createAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: VoiceConfig.recording.sampleRate,
          numberOfChannels: VoiceConfig.recording.numberOfChannels,
          bitRate: VoiceConfig.recording.bitRate,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: VoiceConfig.recording.sampleRate,
          numberOfChannels: VoiceConfig.recording.numberOfChannels,
          bitRate: VoiceConfig.recording.bitRate,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/mp4',
          bitsPerSecond: VoiceConfig.recording.bitRate,
        },
      });

      this.recording = recording;
      this.isRecording = true;
      
      // Timer para parar automaticamente após 15 segundos
      this.recordingTimer = setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, VoiceConfig.recording.maxDuration);
      
      return true;
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      this.isRecording = false;
      return false;
    }
  }

  /**
   * Para a gravação e retorna o arquivo de áudio
   */
  async stopRecording(): Promise<VoiceRecordingResult | null> {
    try {
      if (!this.recording || !this.isRecording) {
        console.warn('Nenhuma gravação ativa');
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();
      
      // Limpar timer se existir
      if (this.recordingTimer) {
        clearTimeout(this.recordingTimer);
        this.recordingTimer = null;
      }
      
      this.recording = null;
      this.isRecording = false;

      if (!uri) {
        throw new Error('URI do arquivo de áudio não disponível');
      }

      return {
        uri,
        duration: status.durationMillis || 0,
      };
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      this.recording = null;
      this.isRecording = false;
      return null;
    }
  }

  /**
   * Cancela a gravação atual
   */
  async cancelRecording(): Promise<void> {
    try {
      if (this.recording && this.isRecording) {
        await this.recording.stopAndUnloadAsync();
        
        // Limpar timer se existir
        if (this.recordingTimer) {
          clearTimeout(this.recordingTimer);
          this.recordingTimer = null;
        }
        
        this.recording = null;
        this.isRecording = false;
      }
    } catch (error) {
      console.error('Erro ao cancelar gravação:', error);
    }
  }

  /**
   * Processa áudio completo: transcreve e gera resposta do Felipe em uma única chamada
   */
  async processVoiceMessage(audioUri: string): Promise<{ transcription: string; response: string; success: boolean; error?: string }> {
    try {
      // Prepara o FormData para envio
      const formData = new FormData();
      
      // Para React Native, precisamos usar um objeto com uri, name e type
      // Garantir que o MIME type está correto
      const mimeType = VoiceConfig.recording.format === 'm4a' ? 'audio/m4a' : 
                       VoiceConfig.recording.format === 'wav' ? 'audio/wav' : 
                       `audio/${VoiceConfig.recording.format}`;
      
      formData.append('audio', {
        uri: audioUri,
        name: `recording.${VoiceConfig.recording.format}`,
        type: mimeType,
      } as any);

      const response = await fetch(`${API_URL}/voiceChat`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
        // Não definir Content-Type para permitir que o FormData defina automaticamente com boundary
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Erro na resposta da API:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Erro na API: ${response.status}`);
        } catch (parseError) {
          // Se não conseguir fazer parse do JSON, retorna o texto bruto
          throw new Error(`Erro na API (${response.status}): ${responseText.substring(0, 100)}...`);
        }
      }

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.error('Response recebida:', responseText);
        throw new Error('Resposta da API não é um JSON válido');
      }
      
      return {
        transcription: data.transcription?.trim() || '',
        response: data.response?.trim() || '',
        success: true,
      };
    } catch (error) {
      console.error('Erro no processamento de voz:', error);
      return {
        transcription: '',
        response: '',
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento de voz',
      };
    }
  }

  /**
   * Fala o texto usando síntese de voz
   */
  async speakText(text: string, options?: {
    language?: string;
    rate?: number;
    pitch?: number;
    voice?: string;
    volume?: number;
  }): Promise<void> {
    try {
      // Configurar modo de reprodução para garantir volume alto
      await this.setupPlaybackMode();
      
      // Obter a melhor voz masculina disponível se não foi especificada
      const bestMaleVoice = options?.voice || await this.getBestMaleVoice() || VoiceConfig.speech.voice;
      
      const speechOptions = {
        language: options?.language || VoiceConfig.speech.language,
        rate: options?.rate || VoiceConfig.speech.rate,
        pitch: options?.pitch || VoiceConfig.speech.pitch,
        voice: bestMaleVoice,
        volume: VoiceConfig.speech.volume,
      };

      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error('Erro ao falar texto:', error);
    }
  }

  /**
   * Para a síntese de voz
   */
  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Erro ao parar síntese de voz:', error);
    }
  }

  /**
   * Verifica se está gravando
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Verifica se a síntese de voz está falando
   */
  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error('Erro ao verificar se está falando:', error);
      return false;
    }
  }

  /**
   * Cleanup - limpa recursos
   */
  async cleanup(): Promise<void> {
    try {
      await this.cancelRecording();
      await this.stopSpeaking();
    } catch (error) {
      console.error('Erro durante cleanup:', error);
    }
  }
}

// Instância singleton do serviço
export const voiceService = new VoiceService();
