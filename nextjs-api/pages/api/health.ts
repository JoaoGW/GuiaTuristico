import type { NextApiRequest, NextApiResponse } from 'next'

export default function health(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*') // Em produção, prefira liberar só seu domínio
  
  if (req.method === 'OPTIONS') 
    return res.status(204).end()

  res.status(200).json({
    ok: true,
    message: 'API online (node)',
    timestamp: Date.now()
  })
}