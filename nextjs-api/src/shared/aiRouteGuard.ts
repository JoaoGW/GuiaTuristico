import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '@/contexts/profile/application/authenticateRequest';
import { AppError } from './errors';
import { getClientIp } from './http';

const WINDOW_MS = 60_000;
/** Unidades por minuto; cada chamada à OpenAI que a requisição pode gerar conta 1 (ver `weight`). */
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_TRACKED_KEYS = 10_000;

// Limite por instância: em serverless cada instância tem o próprio contador, então isto
// só contém abuso de uma origem só. O limite global depende de armazenamento externo (sem aprovação).
const windows = new Map<string, { count: number; resetAt: number }>();

function consume(key: string, now: number, weight: number): { allowed: boolean; retryAfterSeconds: number } {
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
    windows.set(key, { count: weight, resetAt: now + WINDOW_MS });
    return { allowed: weight <= MAX_REQUESTS_PER_WINDOW, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  current.count += weight;
  return {
    allowed: current.count <= MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000)
  };
}

/**
 * Autenticação (quando ligada) e limite de uso das rotas que chamam a OpenAI.
 * `weight` é quantas chamadas à IA a requisição pode gerar (o roteiro de 28 dias faz 5).
 * Devolve o usuário autenticado, ou `null` com AI_AUTH_REQUIRED desligado.
 */
export async function guardAiRoute(req: NextApiRequest, res: NextApiResponse, weight = 1): Promise<{ uid: string } | null> {
  const user = await authenticateRequest(req.headers.authorization);
  const key = user ? `uid:${user.uid}` : `ip:${getClientIp(req)}`;
  const { allowed, retryAfterSeconds } = consume(key, Date.now(), weight);

  if (!allowed) {
    res.setHeader('Retry-After', String(retryAfterSeconds));
    throw new AppError(429, 'Muitas solicitações em pouco tempo. Tente novamente em instantes.', 'RATE_LIMITED');
  }

  return user;
}
