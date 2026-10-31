import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureMethod } from '@/shared/http';

// Variáveis de sistema da Vercel; fora dela (local ou Docker) os campos ficam nulos.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET'])) return;

  return res.status(200).json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    environment: process.env.VERCEL_ENV ?? 'local'
  });
}
