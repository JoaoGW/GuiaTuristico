# VoiceService

Serviço de voz completo: gravação com `expo-av`, transcrição+resposta via endpoint do backend e síntese de fala com `expo-speech`.

- Arquivo: `src/services/voiceService.ts`
- Exporta: `voiceService` (singleton) e a classe `VoiceService`
- Depende de: `VoiceConfig` e `API_URL`

## Capacidades

- Gravação de áudio com configuração otimizada (m4a, 16kHz, mono, 64kbps) e timeout automático.
- Envio do áudio via `FormData` para `${API_URL}/voiceChat` (uma chamada que transcreve e responde).
- Reprodução de respostas com a melhor voz masculina disponível (fallback para `VoiceConfig`).
- Utilitários: verificar estado, parar/cancelar, limpar recursos.

## API principal

- `requestPermissions(): Promise<boolean>` — pede permissão de microfone.
- `setupAudioMode(): Promise<void>` — configura modo de áudio para gravação.
- `setupPlaybackMode(): Promise<void>` — configura modo de reprodução (volume alto).
- `startRecording(): Promise<boolean>` — inicia gravação (máx `VoiceConfig.recording.maxDuration`).
- `stopRecording(): Promise<{ uri: string; duration: number } | null>` — finaliza e retorna arquivo.
- `cancelRecording(): Promise<void>` — cancela a gravação atual.
- `processVoiceMessage(audioUri: string)` — envia o áudio e retorna `{ transcription, response, success, error? }`.
- `speakText(text: string, options?)` — faz TTS com `expo-speech`.
- `stopSpeaking()` — interrompe o TTS.
- `getIsRecording(): boolean` — indica estado da gravação.
- `isSpeaking(): Promise<boolean>` — consulta estado do TTS.
- `cleanup()` — encerra qualquer recurso pendente.

## Fluxo recomendado

```ts
import { voiceService } from "@services/voiceService";

if (await voiceService.startRecording()) {
  // UI: indicar que está gravando
}

const result = await voiceService.stopRecording();
if (result) {
  const { transcription, response, success, error } = await voiceService.processVoiceMessage(result.uri);
  if (success && response) {
    await voiceService.speakText(response);
  }
}
```

## Dicas

- iOS/Android/Web têm diferenças de permissões e formatos; o serviço abstrai a maioria.
- Não defina manualmente `Content-Type` ao enviar `FormData`.
- Ajuste `VoiceConfig` para tom/idioma e duração.
