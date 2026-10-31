import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '@/contexts/profile/application/authenticateRequest';
import { AppError } from './errors';
import { getClientIp } from './http';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_TRACKED_KEYS = 10_000;

// Limite por instância: em serverless cada instância tem o próprio contador, então isto
// só contém abuso de uma origem só. O limite global depende de armazenamento externo (sem aprovação).
const windows = new Map<string, { count: number; resetAt: number }>();

function consume(key: string, now: number): { allowed: boolean; retryAfterSeconds: number } {
  if (windows.size >= MAX_TRACKED_KEYS) {
    for (const [storedKey, window] of windows) {
      if (window.resetAt <= now) windows.delete(storedKey);
    }
    // Se ainda estiver cheio, descarta as chaves mais antigas (o Map mantém a ordem de inserção).
    for (const storedKey of windows.keys()) {
      if (windows.size < MAX_TRACKED_KEYS) break;
      windows.delete(storedKey);
    }
  }

  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  return {
    allowed: current.count <= MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000)
  };
}

/** Autenticação (quando ligada) e limite de uso das rotas que chamam a OpenAI. */
export async function guardAiRoute(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = await authenticateRequest(req.headers.authorization);
  const key = user ? `uid:${user.uid}` : `ip:${getClientIp(req)}`;
  const { allowed, retryAfterSeconds } = consume(key, Date.now());

  if (!allowed) {
    res.setHeader('Retry-After', String(retryAfterSeconds));
    throw new AppError(429, 'Muitas solicitações em pouco tempo. Tente novamente em instantes.', 'RATE_LIMITED');
  }
}
