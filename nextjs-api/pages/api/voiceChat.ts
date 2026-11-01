import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import formidable from 'formidable';
import { readFile, unlink } from 'node:fs/promises';
import { creditWalletFor } from '@/contexts/billing/application/creditWallet';
import { answerVoiceMessage } from '@/contexts/concierge/application/answerVoiceMessage';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { AppError } from '@/shared/errors';
import { ensureMethod, sendError } from '@/shared/http';
import { responseCache } from '../../utils/responseCache';

const MAX_AUDIO_BYTES = 2 * 1024 * 1024;

// Configuração para permitir upload de arquivos. Token (5 s) + reserva (2×3 s) + transcrição (15 s)
// + resposta (25 s) + devolução (2×3 s) cabem em 60 s.
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

function parseUpload(req: NextApiRequest): Promise<formidable.Files> {
  // Só o campo "audio" com mimetype de áudio é gravado; o resto é descartado pelo filtro.
  const form = formidable({
    maxFileSize: MAX_AUDIO_BYTES,
    filter: ({ name, mimetype }) => name === 'audio' && (mimetype?.startsWith('audio/') ?? false),
    allowEmptyFiles: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

function toUploadError(error: unknown): unknown {
  // O formidable sinaliza arquivo acima de maxFileSize com httpCode 413.
  if (error instanceof Error && 'httpCode' in error) {
    if (error.httpCode === 413) {
      return new AppError(413, 'Arquivo muito grande. O áudio deve ter no máximo 2 MB (cerca de 15 segundos).', 'AUDIO_TOO_LARGE');
    }
    return new AppError(400, 'Não foi possível ler o arquivo de áudio enviado.', 'INVALID_UPLOAD', { cause: error });
  }
  return error;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  let uploadedFiles: formidable.File[] = [];

  try {
    const user = await guardAiRoute(req, res);
    const wallet = creditWalletFor(user?.uid ?? null, 'chat');

    const files = await parseUpload(req).catch((error) => { throw toUploadError(error); });
    // Todos os arquivos gravados pelo formidable são apagados no finally, não só o campo "audio".
    uploadedFiles = Object.values(files).flat().filter((file): file is formidable.File => !!file);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      throw new AppError(400, 'Envie um arquivo de áudio no campo "audio".', 'AUDIO_REQUIRED');
    }

    const audio = await readFile(audioFile.filepath);
    if (audio.length === 0) {
      throw new AppError(400, 'O arquivo de áudio está vazio.', 'AUDIO_REQUIRED');
    }

    const result = await answerVoiceMessage(audio, wallet, user?.uid ?? null);

    return res.status(200).json({
      success: true,
      transcription: result.transcription,
      response: result.response,
      audioInfo: {
        originalName: audioFile.originalFilename,
        size: audioFile.size,
        duration: 'Estimado: ~15 segundos máximo'
      },
      usage: {
        transcriptionModel: 'whisper-1',
        chatModel: 'gpt-6-luna',
        totalTokens: result.totalTokens,
        usedCache: result.usedCache,
        cacheStats: responseCache.getStats()
      }
    });
  } catch (error) {
    return sendError(res, error, 'Erro no processamento de voz');
  } finally {
    await Promise.all(uploadedFiles.map((file) => unlink(file.filepath).catch((cleanupError) => {
      console.warn('Erro ao limpar arquivo temporário:', cleanupError);
    })));
  }
}
