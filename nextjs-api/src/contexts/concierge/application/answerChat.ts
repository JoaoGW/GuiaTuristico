import { withReservation, type CreditWallet } from '@/contexts/billing/application/creditWallet';
import { requireText } from '@/shared/validation';
import { FELIPE_CHAT_PROMPT } from '../domain/felipePersona';
import { TEXT_MESSAGE_COST } from '../domain/messagePricing';
import { createOpenAIClient, logAiUsage, toAiError } from '../infrastructure/openaiClient';

const MAX_MESSAGE_LENGTH = 2000;

/** Resposta única do Felipe para `/api/chat`; cobrada como mensagem de texto quando há `wallet`. */
export async function answerChat(rawMessage: unknown, wallet: CreditWallet | null) {
  const message = requireText(rawMessage, 'message', MAX_MESSAGE_LENGTH);
  const openai = createOpenAIClient();

  return withReservation(wallet, TEXT_MESSAGE_COST, 'chat', async () => {
    try {
      const startedAt = Date.now();
      const completion = await openai.chat.completions.create({
        model: 'gpt-6-luna',
        messages: [
          { role: 'system', content: FELIPE_CHAT_PROMPT },
          { role: 'user', content: message }
        ],
        // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
        max_completion_tokens: 600,
      }, { timeout: 25_000, maxRetries: 0 }); // Sem retentativa: token (5 s) + reserva (2×3 s) + IA (25 s) + devolução (2×3 s) < 60 s da rota.

      logAiUsage('chat', completion, startedAt);
      return {
        response: completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.',
        usage: completion.usage
      };
    } catch (error) {
      throw toAiError(error);
    }
  });
}
