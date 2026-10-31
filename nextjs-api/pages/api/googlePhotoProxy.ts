import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlacePhoto } from '@/contexts/catalog/application/getPlacePhoto';
import { ensureMethod, readQueryParam, sendError } from '@/shared/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET'])) return;

  try {
    const photo = await getPlacePhoto(readQueryParam(req.query.photo_reference));
    res.setHeader('Content-Type', photo.contentType);
    return res.status(200).send(photo.body);
  } catch (error) {
    return sendError(res, error, 'Erro ao carregar foto do Google Places');
  }
}
