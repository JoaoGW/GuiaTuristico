import OpenAI from 'openai';
import { AppError } from '@/shared/errors';

/**
 * Cria o cliente só quando a rota já validou método e entrada, para que a falta
 * de `OPEN_AI_KEY` vire 503 em JSON e não quebre o carregamento do módulo.
 */
export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPEN_AI_KEY;
  if (!apiKey) {
    throw new AppError(503, 'Serviço de IA indisponível.', 'AI_UNAVAILABLE', { cause: 'OPEN_AI_KEY não configurada' });
  }
  return new OpenAI({ apiKey });
}

/** Traduz falhas do SDK da OpenAI para mensagens em pt-BR, sem repassar o texto do provedor. */
export function toAiError(error: unknown): unknown {
  if (error instanceof AppError) return error;

  if (error instanceof OpenAI.APIConnectionError) {
    return new AppError(502, 'Serviço de IA indisponível no momento.', 'AI_UNAVAILABLE', { cause: error });
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return new AppError(500, 'Erro de autenticação no serviço de IA.', 'AI_AUTH_ERROR', { cause: error });
    }
    if (error.status === 429) {
      return new AppError(429, 'Limite de uso da IA atingido. Tente novamente em instantes.', 'AI_RATE_LIMITED', { cause: error });
    }
    if (typeof error.status === 'number' && error.status >= 500) {
      return new AppError(502, 'Serviço de IA indisponível no momento.', 'AI_UNAVAILABLE', { cause: error });
    }
    return new AppError(500, 'Não foi possível gerar a resposta agora.', 'AI_ERROR', { cause: error });
  }

  return error;
}
