import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { answerChat } from '@/contexts/concierge/application/answerChat';
import { creditWalletFor } from '@/contexts/billing/application/creditWallet';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { ensureMethod, sendError } from '@/shared/http';

// Token (5 s) + reserva de mensagens (2×3 s) + OpenAI (25 s) + devolução (2×3 s).
export const config: PageConfig = { maxDuration: 60 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    const user = await guardAiRoute(req, res);

    // `context` não é mais aceito: o system prompt é sempre o do servidor.
    const { response, usage } = await answerChat(req.body?.message, creditWalletFor(user?.uid ?? null, 'chat'));

    return res.status(200).json({
      success: true,
      response: response,
      usage: usage
    });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar resposta do chat');
  }
}
