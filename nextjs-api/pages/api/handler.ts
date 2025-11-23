// Handler central com rotas por método. Importa aqui sua lógica real (services, utils, etc).
import type { NextApiRequest, NextApiResponse } from 'next'

export async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  // Ex.: cache leve para GET (pode ajustar conforme sua necessidade)
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  
  return res.status(200).json({
    ok: true,
    message: 'GET /api (via handler)',
    timestamp: Date.now()
  })
}

export async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body

  return res.status(200).json({
    ok: true,
    message: 'POST /api (via handler)',
    received: body ?? null,
    timestamp: Date.now()
  })
}

// Handler principal: delega por método. Expanda com PUT/DELETE quando precisar.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res)

    case 'POST':
      return handlePost(req, res)

    default:
      res.setHeader('Allow', 'GET,POST')
      return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }
}