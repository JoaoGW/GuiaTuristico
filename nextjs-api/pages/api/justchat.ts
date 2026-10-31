import type { NextApiRequest, NextApiResponse } from 'next';
import { answerConversation } from '@/contexts/concierge/application/answerConversation';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { ensureMethod, sendError } from '@/shared/http';

export default async function JustChatHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    await guardAiRoute(req, res);

    const message = await answerConversation(req.body);
    return res.status(200).json({ message });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar resposta do chat');
  }
}
