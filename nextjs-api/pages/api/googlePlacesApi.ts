import type { NextApiRequest, NextApiResponse } from 'next';
import { findNearbyPlaces } from '@/contexts/catalog/application/findNearbyPlaces';
import { ensureMethod, readQueryParam, sendError } from '@/shared/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET'])) return;

  try {
    const results = await findNearbyPlaces(readQueryParam(req.query.latitude), readQueryParam(req.query.longitude));
    return res.status(200).json({ results });
  } catch (error) {
    return sendError(res, error, 'Erro ao buscar lugares próximos');
  }
}
