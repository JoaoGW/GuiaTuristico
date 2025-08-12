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
   * Retrieves the identifier of the best available male voice in Portuguese (Brazilian).
   * 
   * This method searches through a predefined list of male voice identifiers in order of preference.
   * It attempts to match the identifiers with the available voices provided by the `Speech.getAvailableVoicesAsync` method.
   * If a match is found, the corresponding voice identifier is returned.
   * 
   * @returns A promise that resolves to the identifier of the best matching male voice, or `undefined` if no suitable voice is found.
   * 
   * @throws Will log an error to the console if there is an issue retrieving the available voices.
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
   * Requests audio permissions from the user.
   *
   * @returns A promise that resolves to a boolean indicating whether the permissions were granted.
   *          - `true`: Permissions were granted.
   *          - `false`: Permissions were denied or an error occurred.
   *
   * @throws Logs an error to the console if the permission request fails.
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
   * Configures the audio mode for the application.
   *
   * This method sets up the audio mode with specific configurations for both iOS and Android platforms.
   * It ensures that the app can record audio, play audio in silent mode on iOS, and handle audio focus
   * appropriately on Android. Additionally, it prevents audio playback through the earpiece on Android
   * and disables background audio activity.
   *
   * @returns {Promise<void>} A promise that resolves when the audio mode is successfully configured.
   * @throws Will log an error to the console if the audio mode configuration fails.
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
   * Configures the audio playback mode for the application.
   * 
   * This method sets the audio mode using `Audio.setAudioModeAsync` with the following configurations:
   * - Disables recording on iOS (`allowsRecordingIOS: false`).
   * - Allows playback in silent mode on iOS (`playsInSilentModeIOS: true`).
   * - Disables audio ducking on Android (`shouldDuckAndroid: false`).
   * - Prevents playback through the earpiece on Android (`playThroughEarpieceAndroid: false`).
   * - Ensures the audio does not stay active in the background (`staysActiveInBackground: false`).
   * 
   * If an error occurs during the configuration, it logs the error to the console.
   * 
   * @returns A promise that resolves when the audio mode is successfully configured.
   * @throws Logs an error to the console if the configuration fails.
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
   * Starts an audio recording session.
   * 
   * @returns A promise that resolves to `true` if the recording starts successfully, 
   *          or `false` if the recording could not be started.
   * 
   * @throws Will throw an error if recording permissions are not granted.
   * 
   * @remarks
   * - Ensures that only one recording session is active at a time.
   * - Requests necessary permissions before starting the recording.
   * - Configures audio settings for Android, iOS, and web platforms.
   * - Automatically stops the recording after a maximum duration defined in `VoiceConfig.recording.maxDuration`.
   * 
   * @example
   * ```typescript
   * const success = await voiceService.startRecording();
   * if (success) {
   *   console.log('Recording started successfully');
   * } else {
   *   console.log('Failed to start recording');
   * }
   * ```
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
   * Stops the current audio recording and unloads the recording instance.
   * 
   * @returns A promise that resolves to a `VoiceRecordingResult` object containing the URI of the audio file
   *          and its duration in milliseconds, or `null` if no active recording exists or an error occurs.
   * 
   * @throws An error if the URI of the audio file is not available after stopping the recording.
   * 
   * @example
   * ```typescript
   * const result = await voiceService.stopRecording();
   * if (result) {
   *   console.log(`Recording saved at: ${result.uri}, Duration: ${result.duration}ms`);
   * } else {
   *   console.warn('No recording was active or an error occurred.');
   * }
   * ```
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
   * Cancels an ongoing audio recording if one is active.
   * 
   * This method stops and unloads the current recording, clears any active timers,
   * and resets the recording state. If an error occurs during the process, it logs
   * the error to the console.
   * 
   * @returns {Promise<void>} A promise that resolves when the recording is successfully canceled.
   * 
   * @throws Logs an error to the console if the cancellation process fails.
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
   * Processes a voice message by sending the audio file to a remote API for transcription and response generation.
   *
   * @param audioUri - The URI of the audio file to be processed.
   * @returns A promise that resolves to an object containing:
   * - `transcription`: The transcribed text from the audio.
   * - `response`: The response generated by the API based on the transcription.
   * - `success`: A boolean indicating whether the operation was successful.
   * - `error` (optional): An error message if the operation failed.
   *
   * @throws Will throw an error if the API response is invalid or if there is an issue with the request.
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
   * Speaks the provided text using text-to-speech functionality with customizable options.
   *
   * @param text - The text to be spoken.
   * @param options - Optional configuration for speech synthesis.
   * @param options.language - The language to use for speech synthesis (e.g., "en-US").
   * @param options.rate - The speed at which the text is spoken (default is 1.0).
   * @param options.pitch - The pitch of the spoken voice (default is 1.0).
   * @param options.voice - The specific voice to use for speech synthesis. If not provided, the best male voice is selected.
   * @param options.volume - The volume level for speech synthesis (default is configured in `VoiceConfig`).
   * @returns A promise that resolves when the text has been spoken.
   * @throws Will log an error to the console if speech synthesis fails.
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
   * Stops the ongoing speech synthesis process.
   * 
   * This method attempts to stop any currently active speech synthesis
   * using the `Speech.stop()` function. If an error occurs during the
   * process, it logs the error to the console with a descriptive message.
   * 
   * @returns {Promise<void>} A promise that resolves when the speech synthesis is stopped.
   * @throws Logs an error to the console if stopping the speech synthesis fails.
   */
  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Erro ao parar síntese de voz:', error);
    }
  }

  /**
   * Retrieves the current recording state.
   *
   * @returns {boolean} - A boolean indicating whether recording is in progress.
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Checks if the speech synthesis engine is currently speaking.
   *
   * @returns A promise that resolves to a boolean indicating whether the speech synthesis engine is speaking.
   * @throws Logs an error to the console if there is an issue checking the speaking status and returns `false`.
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
   * Cleans up resources used by the voice service.
   * This method ensures that any ongoing recording is canceled
   * and any active speech synthesis is stopped.
   * 
   * @returns A promise that resolves when the cleanup process is complete.
   * @throws Logs an error to the console if an issue occurs during cleanup.
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

// Singleton instance of the voice service
export const voiceService = new VoiceService();