import { NextApiRequest, NextApiResponse } from 'next';
import { responseCache } from '../../utils/responseCache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  
  if (req.method === 'DELETE') {
    // Limpar cache (para desenvolvimento/debug)
    responseCache.clear();
    return res.status(200).json({
      success: true,
      message: 'Cache limpo com sucesso'
    });
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
