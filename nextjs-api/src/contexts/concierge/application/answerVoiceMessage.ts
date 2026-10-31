import { AppError } from '@/shared/errors';
import { responseCache } from '../../../../utils/responseCache';
import { FELIPE_VOICE_PROMPT } from '../domain/felipePersona';
import { createOpenAIClient, toAiError } from '../infrastructure/openaiClient';
import { transcribeAudio } from '../infrastructure/whisperTranscriber';

/** Transcreve o áudio e responde como Felipe, reaproveitando o cache de respostas similares. */
export async function answerVoiceMessage(audio: Buffer) {
  const openai = createOpenAIClient();
  const transcription = await transcribeAudio(openai, audio);

  if (!transcription.trim()) {
    throw new AppError(422, 'Não foi possível entender o áudio. Tente gravar novamente.', 'EMPTY_TRANSCRIPTION');
  }

  let felipeResponse = responseCache.getCachedResponse(transcription);
  const usedCache = !!felipeResponse;
  let totalTokens = 0;

  if (!felipeResponse) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-6-luna',
        messages: [
          { role: 'system', content: FELIPE_VOICE_PROMPT },
          { role: 'user', content: transcription }
        ],
        // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
        max_completion_tokens: 600,
      });

      felipeResponse = completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';
      totalTokens = completion.usage?.total_tokens || 0;
    } catch (error) {
      throw toAiError(error);
    }

    // Armazenar no cache para futuras consultas similares
    responseCache.storeResponse(transcription, felipeResponse);
  }

  return { transcription: transcription.trim(), response: felipeResponse, usedCache, totalTokens };
}
