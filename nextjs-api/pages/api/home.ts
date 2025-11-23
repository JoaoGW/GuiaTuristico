// Endpoint /api que delega para o handler central e aplica CORS/erros.
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import handler from './handler'

const allowedMethods = ['GET', 'POST'] as const
type AllowedMethod = (typeof allowedMethods)[number]

const apiHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // CORS básico (ajuste para seu domínio em produção)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

    if (req.method === 'OPTIONS') {
      return res.status(204).end()
    }

    const method = req.method as AllowedMethod | undefined
    if (!method || !allowedMethods.includes(method)) {
      res.setHeader('Allow', allowedMethods.join(','))
      return res.status(405).json({ error: `Método ${req.method} não permitido` })
    }

    console.log(`[REQUEST] ${req.method} ${req.url}`)
    await handler(req, res)
  } catch (error) {
    console.error('ERRO CRÍTICO NA API:', error)
    return res.status(500).json({ error: 'Erro Interno do Servidor' })
  }
}

export default apiHandler