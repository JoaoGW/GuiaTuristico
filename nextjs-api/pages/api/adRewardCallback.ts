import type { NextApiRequest, NextApiResponse } from 'next';
import { grantAdReward } from '@/contexts/billing/application/grantAdReward';
import { ensureMethod, sendError } from '@/shared/http';

// URL de verificação server-side (SSV) cadastrada no bloco de anúncio recompensado do AdMob.
// Não usa guardAiRoute: quem chama é o Google, e a autenticidade vem da assinatura.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET'])) return;

  try {
    // A assinatura cobre a query sem decodificar, exatamente na ordem recebida.
    const url = req.url ?? '';
    const rawQuery = url.includes('?') ? url.slice(url.indexOf('?') + 1) : '';
    const outcome = await grantAdReward(rawQuery);

    if (outcome === 'retry') {
      return res.status(503).json({ error: 'Não foi possível registrar a recompensa agora.', code: 'REWARD_RETRY' });
    }
    return res.status(200).json({ ok: true, outcome });
  } catch (error) {
    return sendError(res, error, 'Erro no callback de recompensa do AdMob');
  }
}
