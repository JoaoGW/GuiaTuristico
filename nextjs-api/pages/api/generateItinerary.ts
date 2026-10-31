import type { NextApiRequest, NextApiResponse } from 'next';
import { generateItinerary } from '@/contexts/itinerary/application/generateItinerary';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { ensureMethod, sendError } from '@/shared/http';

export default async function generateItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    await guardAiRoute(req, res);

    const itinerary = await generateItinerary(req.body);
    return res.status(200).json({ itinerary });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar roteiro');
  }
}
