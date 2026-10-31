import type { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from './errors';

export interface ErrorBody {
  error: string;
  code?: string;
}

/** Responde 405 com `Allow` e devolve `false` quando o método não é aceito. */
export function ensureMethod(req: NextApiRequest, res: NextApiResponse, allowed: string[]): boolean {
  if (req.method && allowed.includes(req.method)) {
    return true;
  }

  res.setHeader('Allow', allowed);
  res.status(405).json({ error: `Método não permitido. Use ${allowed.join(' ou ')}.` } satisfies ErrorBody);
  return false;
}

/** Converte qualquer falha no formato `{ error, code? }`; detalhes internos ficam só no log. */
export function sendError(res: NextApiResponse, error: unknown, logLabel: string) {
  if (error instanceof AppError) {
    if (error.status >= 500 || error.status === 429) {
      console.error(`${logLabel}:`, error.message, error.cause ?? '');
    }

    const body: ErrorBody = { error: error.message };
    if (error.code) body.code = error.code;
    return res.status(error.status).json(body);
  }

  console.error(`${logLabel}:`, error);
  return res.status(500).json({ error: 'Erro interno do servidor.' } satisfies ErrorBody);
}

/** Primeiro IP de `x-forwarded-for` (definido pela Vercel) ou o endereço do socket. */
export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return first || req.socket.remoteAddress || 'desconhecido';
}

export function readQueryParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** `fetch` com tempo limite; erro de rede ou timeout vira `AppError` 502 com a mensagem dada. */
export async function fetchUpstream(url: string, unavailableMessage: string, code?: string, timeoutMs = 8000) {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    throw new AppError(502, unavailableMessage, code, { cause: error });
  }
}
