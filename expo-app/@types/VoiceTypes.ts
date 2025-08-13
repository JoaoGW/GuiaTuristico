export interface VoiceState {
  isRecording: boolean;
  isTranscribing: boolean;
  isSpeaking: boolean;
  recordingUri: string | null;
  transcribedText: string;
  error: string | null;
  recordingDuration: number;
}

export interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  audioUri?: string;
  duration?: number;
}

export interface VoiceConfig {
  language: string;
  speechRate: number;
  speechPitch: number;
  autoPlayResponses: boolean;
  maxRecordingDuration: number; // em milissegundos
}
