import { NextApiRequest, NextApiResponse } from 'next';
import { answerChat } from '@/contexts/concierge/application/answerChat';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { ensureMethod, sendError } from '@/shared/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    await guardAiRoute(req, res);

    // `context` não é mais aceito: o system prompt é sempre o do servidor.
    const { response, usage } = await answerChat(req.body?.message);

    return res.status(200).json({
      success: true,
      response: response,
      usage: usage
    });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar resposta do chat');
  }
}
