import OpenAI, { toFile } from 'openai';
import { AppError } from '@/shared/errors';
import { toAiError } from './openaiClient';

const UNSUPPORTED_AUDIO_MESSAGE = 'Formato de áudio não reconhecido. Use flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav ou webm.';

// O app grava m4a; os demais formatos cobrem gravações em que a extensão não bate com o conteúdo.
const FORMATS = [
  { ext: 'm4a', mime: 'audio/m4a' },
  { ext: 'mp3', mime: 'audio/mp3' },
  { ext: 'wav', mime: 'audio/wav' },
  { ext: 'mp4', mime: 'audio/mp4' }
];

function isWav(audio: Buffer): boolean {
  return audio.length > 12 && audio.toString('ascii', 0, 4) === 'RIFF' && audio.toString('ascii', 8, 12) === 'WAVE';
}

function isFormatError(error: unknown): boolean {
  return error instanceof OpenAI.APIError
    && error.status === 400
    && /unrecognized file format|unsupported file format|invalid file format/i.test(error.message);
}

/**
 * Transcreve com o whisper-1 (o GPT-6 Luna não aceita áudio). Só tenta outro formato
 * quando a OpenAI recusa o formato; erro de rede, 5xx ou cota encerra na primeira chamada.
 */
export async function transcribeAudio(openai: OpenAI, audio: Buffer): Promise<string> {
  for (const format of FORMATS) {
    if (format.ext === 'wav' && !isWav(audio)) continue;

    try {
      return await openai.audio.transcriptions.create({
        file: await toFile(audio, `audio.${format.ext}`, { type: format.mime }),
        model: 'whisper-1',
        language: 'pt',
        response_format: 'text',
        temperature: 0,
      });
    } catch (error) {
      if (!isFormatError(error)) {
        // Outros 400 da transcrição vêm do conteúdo enviado (áudio corrompido ou vazio), não do servidor.
        if (error instanceof OpenAI.APIError && error.status === 400) {
          throw new AppError(400, UNSUPPORTED_AUDIO_MESSAGE, 'UNSUPPORTED_AUDIO', { cause: error });
        }
        throw toAiError(error);
      }
      console.log(`Formato ${format.ext.toUpperCase()} recusado pela transcrição, tentando o próximo.`);
    }
  }

  throw new AppError(400, UNSUPPORTED_AUDIO_MESSAGE, 'UNSUPPORTED_AUDIO');
}
