export const VoiceConfig = {
  // Configurações de gravação
  recording: {
    maxDuration: 15000, // 15 segundos máximo para menor custo
    maxFileSize: 2 * 1024 * 1024, // 2MB máximo
    sampleRate: 16000, // Taxa otimizada para Whisper
    numberOfChannels: 1, // Mono para menor tamanho
    bitRate: 64000, // Bit rate reduzido para menor arquivo
    format: 'm4a' as const, // Mudando para M4A que é mais compatível
  },

  // Configurações de transcrição
  transcription: {
    model: 'whisper-1',
    language: 'pt', // Português
    responseFormat: 'text' as const,
    temperature: 0, // Mais determinístico
  },

  // Configurações de síntese de voz
  speech: {
    language: 'pt-BR',
    rate: 1.0, // Velocidade normal
    pitch: 0.9, // Tom ligeiramente mais grave (era 1.0) - voz mais masculina
    volume: 80.0, // Volume
    voice: 'pt-br-x-ptd-network', // Voz masculina brasileira (Google TTS)
  },

  // Configurações da interface
  ui: {
    showTranscription: true,
    showConversationHistory: true,
    autoPlayResponses: true,
    animateWhileRecording: true,
    maxMessagesHistory: 50,
  },

  // Configurações da API
  api: {
    openaiBaseUrl: 'https://api.openai.com/v1',
    timeout: 30000, // 30 segundos
    retries: 3,
  },

  // Configurações de debug
  debug: {
    logRecording: true,
    logTranscription: true,
    logSpeech: true,
    logErrors: true,
  },
} as const;

export type VoiceConfigType = typeof VoiceConfig;
