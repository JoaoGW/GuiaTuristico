import type { NextApiRequest, NextApiResponse } from 'next'

export default function health(req: NextApiRequest, res: NextApiResponse) {
const allowedOrigin =
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGIN || 'https://example.com'
      : '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);  

  if (req.method === 'OPTIONS') 
    return res.status(204).end()

  res.status(200).json({
    ok: true,
    message: 'API online (node)',
    timestamp: Date.now()
  })
}