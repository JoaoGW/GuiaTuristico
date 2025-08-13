# VoiceConfig

- Arquivo: `src/config/voiceConfig.ts`
- Tipo exportado: `VoiceConfigType`
- Define parâmetros de gravação, transcrição, síntese de voz, UI, API e debug para o módulo de voz.

## Principais campos

- `recording`
  - `maxDuration` (ms) — ex.: 15000
  - `maxFileSize` (bytes) — ex.: 2MB
  - `sampleRate` — ex.: 16000 (ótimo para Whisper)
  - `numberOfChannels` — 1 (mono)
  - `bitRate` — ex.: 64000
  - `format` — `'m4a' | 'wav' | ...`
- `transcription`
  - `model`, `language`, `responseFormat`, `temperature`
- `speech`
  - `language`, `rate`, `pitch`, `volume`, `voice`
- `ui`
  - flags de exibição e histórico
- `api`
  - `openaiBaseUrl`, `timeout`, `retries`
- `debug`
  - flags de log

## Exemplo de uso

```ts
import { VoiceConfig } from "@config/voiceConfig";

const maxSecs = VoiceConfig.recording.maxDuration / 1000;
```

## Observações

- Ajuste `voice` para a voz preferida no dispositivo/ambiente.
- `pitch` mais baixo tende a soar mais masculino.
