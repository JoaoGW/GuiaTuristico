import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { photo_reference } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!photo_reference) {
    return res.status(400).json({ error: 'photo_reference is required' });
  }

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${apiKey}`;
  const response = await fetch(url);

  // Siga o redirect e envie a imagem final
  if (response.redirected) {
    const imageRes = await fetch(response.url);
    const buffer = await imageRes.arrayBuffer();
    res.setHeader('Content-Type', imageRes.headers.get('content-type') || 'image/jpeg');
    res.send(Buffer.from(buffer));
  } else if (response.ok) {
    // Caso o Google já retorne a imagem direto
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.send(Buffer.from(buffer));
  } else {
    res.status(400).json({ error: 'Could not fetch image from Google' });
  }
}