import { AppError } from '@/shared/errors';

// Camada anticorrupção da moeda virtual do RevenueCat (Developer API v2, chave secreta).
// Contrato conferido em 01/11/2026: GET .../virtual_currencies (saldo) e POST
// .../virtual_currencies/transactions com { adjustments: { CODIGO: -N } } (débito);
// 422 = saldo insuficiente, sem débito parcial; Idempotency-Key garante execução única.

export interface RevenueCatConfig {
  apiKey: string;
  projectId: string;
  /** Código da moeda virtual dos créditos de IA, criada no painel do RevenueCat. */
  currency: string;
  baseUrl: string;
}

const BILLING_UNAVAILABLE = 'Não foi possível consultar seus créditos agora.';

/** Configuração do RevenueCat, ou `null` enquanto as variáveis não forem definidas (cobrança desligada). */
export function readRevenueCatConfig(): RevenueCatConfig | null {
  const apiKey = process.env.REVENUECAT_SECRET_API_KEY;
  const projectId = process.env.REVENUECAT_PROJECT_ID;
  const currency = process.env.REVENUECAT_CREDITS_CURRENCY;
  if (!apiKey || !projectId || !currency) return null;

  // REVENUECAT_API_BASE_URL só existe para testes locais com um servidor simulado.
  return { apiKey, projectId, currency, baseUrl: process.env.REVENUECAT_API_BASE_URL || 'https://api.revenuecat.com/v2' };
}

function customerUrl(config: RevenueCatConfig, customerId: string, path: string): string {
  // O customer_id do RevenueCat é o App User ID (uid do Firebase, definido pelo logIn do SDK no app).
  return `${config.baseUrl}/projects/${encodeURIComponent(config.projectId)}/customers/${encodeURIComponent(customerId)}${path}`;
}

async function callRevenueCat(url: string, init: RequestInit, apiKey: string): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
  } catch (error) {
    throw new AppError(502, BILLING_UNAVAILABLE, 'BILLING_UNAVAILABLE', { cause: error });
  }
}

/** Saldo de créditos do cliente. Cliente ainda sem registro no RevenueCat conta como saldo zero. */
export async function getCreditBalance(config: RevenueCatConfig, customerId: string): Promise<number> {
  const response = await callRevenueCat(
    customerUrl(config, customerId, '/virtual_currencies?include_empty_balances=true&limit=100'),
    { method: 'GET' },
    config.apiKey
  );

  if (response.status === 404) return 0;
  if (!response.ok) {
    throw new AppError(502, BILLING_UNAVAILABLE, 'BILLING_UNAVAILABLE', { cause: `RevenueCat saldo status=${response.status}` });
  }

  const data = (await response.json().catch(() => null)) as { items?: { currency_code?: string; balance?: number }[] } | null;
  const balance = data?.items?.find((item) => item.currency_code === config.currency)?.balance;
  return typeof balance === 'number' ? balance : 0;
}

/**
 * Debita `amount` créditos. Devolve `false` quando o saldo não cobre (422), sem débito parcial.
 * Falhas de rede ou do RevenueCat viram `AppError` 502; a mesma `idempotencyKey` pode ser reenviada.
 */
export async function spendCredits(
  config: RevenueCatConfig,
  customerId: string,
  amount: number,
  idempotencyKey: string,
  reference: string
): Promise<boolean> {
  const response = await callRevenueCat(
    customerUrl(config, customerId, '/virtual_currencies/transactions'),
    {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ adjustments: { [config.currency]: -amount }, reference })
    },
    config.apiKey
  );

  if (response.status === 422) return false;
  if (!response.ok) {
    throw new AppError(502, BILLING_UNAVAILABLE, 'BILLING_UNAVAILABLE', { cause: `RevenueCat débito status=${response.status}` });
  }
  return true;
}
