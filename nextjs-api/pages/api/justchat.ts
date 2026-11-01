import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { answerConversation } from '@/contexts/concierge/application/answerConversation';
import { creditWalletFor } from '@/contexts/billing/application/creditWallet';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { ensureMethod, sendError } from '@/shared/http';

// Token (5 s) + reserva de mensagens (2×3 s) + OpenAI (25 s) + devolução (2×3 s).
export const config: PageConfig = { maxDuration: 60 };

export default async function JustChatHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    const user = await guardAiRoute(req, res);

    const message = await answerConversation(req.body, creditWalletFor(user?.uid ?? null, 'chat'));
    return res.status(200).json({ message });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar resposta do chat');
  }
}
