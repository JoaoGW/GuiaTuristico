import { NextApiRequest, NextApiResponse } from 'next';
import { responseCache } from '../../utils/responseCache';
import { ensureMethod } from '@/shared/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET', 'DELETE'])) return;

  if (req.method === 'GET') {
    // Retornar estatísticas do cache
    const stats = responseCache.getStats();
    return res.status(200).json({
      success: true,
      stats: {
        ...stats,
        estimatedSavings: `${(stats.size * 0.00013).toFixed(6)} USD`, // Economia aproximada em tokens GPT
        description: 'Cache de respostas similares para economia de recursos'
      }
    });
  }

  // Limpar o cache é só para desenvolvimento/debug; em produção (inclusive previews da Vercel) fica bloqueado.
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Limpeza do cache disponível apenas em desenvolvimento.' });
  }

  responseCache.clear();
  return res.status(200).json({
    success: true,
    message: 'Cache limpo com sucesso'
  });
}
