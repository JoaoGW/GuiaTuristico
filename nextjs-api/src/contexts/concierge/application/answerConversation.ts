import { withReservation, type CreditWallet } from '@/contexts/billing/application/creditWallet';
import { parseConversation } from '../domain/conversation';
import { FELIPE_TEXT_CHAT_PROMPT } from '../domain/felipePersona';
import { TEXT_MESSAGE_COST } from '../domain/messagePricing';
import { createOpenAIClient, logAiUsage, toAiError } from '../infrastructure/openaiClient';

/**
 * Resposta do Felipe no chat de texto, considerando as últimas mensagens da conversa.
 * Com `wallet`, consome TEXT_MESSAGE_COST mensagens (devolvidas se a IA falhar).
 */
export async function answerConversation(body: unknown, wallet: CreditWallet | null): Promise<string> {
  const conversation = parseConversation(body);
  const openai = createOpenAIClient();

  return withReservation(wallet, TEXT_MESSAGE_COST, 'chat de texto', async () => {
    try {
      const startedAt = Date.now();
      const response = await openai.chat.completions.create({
        model: 'gpt-6-luna',
        messages: [{ role: 'system', content: FELIPE_TEXT_CHAT_PROMPT }, ...conversation],
        // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
        max_completion_tokens: 1500
      }, { timeout: 25_000, maxRetries: 0 }); // Sem retentativa: token (5 s) + reserva (2×3 s) + IA (25 s) + devolução (2×3 s) < 60 s da rota.

      logAiUsage('justchat', response, startedAt);
      return response.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';
    } catch (error) {
      throw toAiError(error);
    }
  });
}
