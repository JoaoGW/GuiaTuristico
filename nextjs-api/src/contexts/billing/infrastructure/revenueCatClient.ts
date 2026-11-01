import { AppError } from '@/shared/errors';

// Camada anticorrupção da moeda virtual do RevenueCat (Developer API v2, chave secreta).
// Contrato conferido em 01/11/2026: POST .../virtual_currencies/transactions com
// { adjustments: { CODIGO: N }, reference? } (N negativo debita, positivo credita);
// 422 = saldo insuficiente, sem débito parcial; Idempotency-Key garante execução única.

export interface RevenueCatConfig {
  apiKey: string;
  projectId: string;
  /** Código da moeda virtual dos créditos de IA, criada no painel do RevenueCat. */
  currency: string;
  baseUrl: string;
}

/** `retryable`: rede, 429 ou 5xx. `uncertain`: 409, o RevenueCat pode ter aplicado o ajuste. */
export type AdjustmentResult = 'ok' | 'insufficient' | 'retryable' | 'uncertain' | 'failed';

const PRODUCTION_BASE_URL = 'https://api.revenuecat.com/v2';
const ENV_NAMES = ['REVENUECAT_SECRET_API_KEY', 'REVENUECAT_PROJECT_ID', 'REVENUECAT_CREDITS_CURRENCY'] as const;

/**
 * Configuração do RevenueCat, ou `null` quando nenhuma variável foi definida (cobrança desligada).
 * Configuração parcial falha fechada: um erro de digitação não pode desligar a cobrança em silêncio.
 */
export function readRevenueCatConfig(): RevenueCatConfig | null {
  const [apiKey, projectId, currency] = ENV_NAMES.map((name) => process.env[name]);
  if (!apiKey && !projectId && !currency) return null;

  if (!apiKey || !projectId || !currency) {
    throw new AppError(503, 'Serviço indisponível no momento.', 'BILLING_MISCONFIGURED', {
      cause: `RevenueCat parcialmente configurado; faltam: ${ENV_NAMES.filter((name) => !process.env[name]).join(', ')}`
    });
  }

  // REVENUECAT_API_BASE_URL só existe para testes locais com servidor simulado; em produção a
  // chave secreta só pode ir para o host oficial.
  const testBaseUrl = process.env.NODE_ENV === 'production' ? undefined : process.env.REVENUECAT_API_BASE_URL;
  return { apiKey, projectId, currency, baseUrl: testBaseUrl || PRODUCTION_BASE_URL };
}

/** Credita (`delta` positivo) ou debita (`delta` negativo) créditos do cliente. */
export async function adjustCredits(
  config: RevenueCatConfig,
  customerId: string,
  delta: number,
  idempotencyKey: string,
  reference: string
): Promise<AdjustmentResult> {
  // O customer_id do RevenueCat é o App User ID (uid do Firebase, definido pelo logIn do SDK no app).
  const url = `${config.baseUrl}/projects/${encodeURIComponent(config.projectId)}/customers/${encodeURIComponent(customerId)}/virtual_currencies/transactions`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({ adjustments: { [config.currency]: delta }, reference }),
      signal: AbortSignal.timeout(5000)
    });
  } catch {
    return 'retryable';
  }

  if (response.ok) return 'ok';
  if (response.status === 422) return 'insufficient';
  if (response.status === 409) return 'uncertain';
  if (response.status === 429 || response.status >= 500) return 'retryable';
  console.error(`RevenueCat: ajuste de créditos recusado com status ${response.status}.`);
  return 'failed';
}
