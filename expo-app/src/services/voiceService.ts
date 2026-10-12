import { setAudioModeAsync } from 'expo-audio';
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
  private async getBestMaleVoice(): Promise<string | undefined> {
    try {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const preferredIdentifiers = [
        'pt-br-x-ptd-network',
        'pt-BR-language',
        'com.apple.ttsbundle.Luciana-compact',
        'pt-br-x-ptd-local',
      ];

      return availableVoices.find((voice) =>
        preferredIdentifiers.some((identifier) =>
          voice.identifier.toLowerCase().includes(identifier.toLowerCase())
        ) || (voice.name?.toLowerCase().includes('male') ?? false)
      )?.identifier;
    } catch (error) {
      console.error('Erro ao obter vozes disponíveis:', error);
      return undefined;
    }
  }

  async setupPlaybackMode(): Promise<void> {
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        interruptionMode: 'duckOthers',
        shouldRouteThroughEarpiece: false,
        shouldPlayInBackground: false,
      });
    } catch (error) {
      console.error('Erro ao configurar modo de reprodução:', error);
    }
  }

  async processVoiceMessage(audioUri: string): Promise<{
    transcription: string;
    response: string;
    success: boolean;
    error?: string;
  }> {
    try {
      const mimeType = VoiceConfig.recording.format === 'm4a'
        ? 'audio/m4a'
        : VoiceConfig.recording.format === 'wav'
          ? 'audio/wav'
          : `audio/${VoiceConfig.recording.format}`;

      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        name: `recording.${VoiceConfig.recording.format}`,
        type: mimeType,
      } as any);

      const response = await fetch(`${API_URL}/voiceChat`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Erro na API: ${response.status}`);
        } catch (error) {
          if (error instanceof Error && error.message !== responseText) throw error;
          throw new Error(`Erro na API (${response.status}): ${responseText.substring(0, 100)}...`);
        }
      }

      const data = JSON.parse(responseText);
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

  async speakText(text: string, options?: {
    language?: string;
    rate?: number;
    pitch?: number;
    voice?: string;
    volume?: number;
  }): Promise<void> {
    try {
      await this.setupPlaybackMode();
      const voice = options?.voice || await this.getBestMaleVoice() || VoiceConfig.speech.voice;
      await Speech.speak(text, {
        language: options?.language || VoiceConfig.speech.language,
        rate: options?.rate || VoiceConfig.speech.rate,
        pitch: options?.pitch || VoiceConfig.speech.pitch,
        voice,
        volume: options?.volume || VoiceConfig.speech.volume,
      });
    } catch (error) {
      console.error('Erro ao falar texto:', error);
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Erro ao parar síntese de voz:', error);
    }
  }

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error('Erro ao verificar se está falando:', error);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    await this.stopSpeaking();
  }
}

export const voiceService = new VoiceService();
