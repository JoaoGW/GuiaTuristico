import type { NextApiRequest, NextApiResponse } from 'next';
import { quoteItinerary } from '@/contexts/itinerary/application/quoteItinerary';
import { ensureMethod, readQueryParam, sendError } from '@/shared/http';

// Só cálculo, sem chamada à IA: não passa pelo guardAiRoute.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET'])) return;

  try {
    return res.status(200).json(quoteItinerary(readQueryParam(req.query.days)));
  } catch (error) {
    return sendError(res, error, 'Erro ao calcular créditos do roteiro');
  }
}
