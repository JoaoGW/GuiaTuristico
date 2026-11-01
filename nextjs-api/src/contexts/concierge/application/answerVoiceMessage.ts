import { withReservation, type CreditWallet } from '@/contexts/billing/application/creditWallet';
import { AppError } from '@/shared/errors';
import { responseCache } from '../../../../utils/responseCache';
import { FELIPE_VOICE_PROMPT } from '../domain/felipePersona';
import { VOICE_MESSAGE_COST } from '../domain/messagePricing';
import { createOpenAIClient, logAiUsage, toAiError } from '../infrastructure/openaiClient';
import { transcribeAudio } from '../infrastructure/whisperTranscriber';

// O app grava até ~15 s; transcrições maiores indicam áudio fora do uso esperado e encareceriam a resposta e o cache.
const MAX_TRANSCRIPTION_LENGTH = 2000;

/**
 * Transcreve o áudio e responde como Felipe, reaproveitando o cache de respostas similares.
 * Com `wallet`, consome VOICE_MESSAGE_COST mensagens; áudio inválido ou vazio não é devolvido,
 * pois a transcrição já foi paga. Falhas de infraestrutura são devolvidas.
 */
export async function answerVoiceMessage(audio: Buffer, wallet: CreditWallet | null) {
  const openai = createOpenAIClient();

  return withReservation(wallet, VOICE_MESSAGE_COST, 'chat de voz', async () => {
    const transcription = await transcribeAudio(openai, audio);

    if (!transcription.trim()) {
      throw new AppError(422, 'Não foi possível entender o áudio. Tente gravar novamente.', 'EMPTY_TRANSCRIPTION');
    }
    if (transcription.length > MAX_TRANSCRIPTION_LENGTH) {
      throw new AppError(400, 'O áudio ficou longo demais. Grave uma pergunta de até 15 segundos.', 'AUDIO_TOO_LONG');
    }

    let felipeResponse = responseCache.getCachedResponse(transcription);
    const usedCache = !!felipeResponse;
    let totalTokens = 0;

    if (!felipeResponse) {
      try {
        const startedAt = Date.now();
        const completion = await openai.chat.completions.create({
          model: 'gpt-6-luna',
          messages: [
            { role: 'system', content: FELIPE_VOICE_PROMPT },
            { role: 'user', content: transcription }
          ],
          // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
          max_completion_tokens: 600,
        }, { timeout: 25_000, maxRetries: 0 });

        logAiUsage('voiceChat', completion, startedAt);
        felipeResponse = completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';
        totalTokens = completion.usage?.total_tokens || 0;
      } catch (error) {
        throw toAiError(error);
      }

      // Armazenar no cache para futuras consultas similares
      responseCache.storeResponse(transcription, felipeResponse);
    }

    return { transcription: transcription.trim(), response: felipeResponse, usedCache, totalTokens };
  });
}
