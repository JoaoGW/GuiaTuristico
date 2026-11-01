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

  // Os timeouts por chamada ficam abaixo do maxDuration da rota, para a resposta sair em JSON.
  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return new AppError(504, 'O serviço de IA demorou para responder. Tente novamente.', 'AI_TIMEOUT', { cause: error });
  }

  if (error instanceof OpenAI.APIConnectionError) {
    return new AppError(502, 'Serviço de IA indisponível no momento.', 'AI_UNAVAILABLE', { cause: error });
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      // A mensagem da OpenAI para 401 repete parte da chave; o log fica só com o código.
      return new AppError(500, 'Erro de autenticação no serviço de IA.', 'AI_AUTH_ERROR', { cause: `OpenAI 401 (${error.code ?? 'sem código'})` });
    }
    // Conta sem saldo também chega como 429, mas não passa com o tempo: é indisponibilidade nossa.
    // A OpenAI manda `type: insufficient_quota` com `code` variável (ex.: credit_balance_exhausted).
    if (error.status === 429 && (error.type === 'insufficient_quota' || error.code === 'insufficient_quota')) {
      return new AppError(503, 'Serviço de IA indisponível no momento.', 'AI_QUOTA_EXCEEDED', { cause: error });
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
