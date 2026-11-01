import { randomUUID } from 'node:crypto';
import { AppError } from '@/shared/errors';
import { pseudonymousId } from '@/shared/privacy';
import { adjustCredits, readRevenueCatConfig, type AdjustmentResult, type RevenueCatConfig } from '../infrastructure/revenueCatClient';

/**
 * Carteira de um usuário no RevenueCat. O valor é reservado (debitado) antes de chamar a IA e
 * devolvido quando a falha não é do usuário: assim, pedidos simultâneos não passam do saldo.
 */
export interface CreditWallet {
  /** Debita `amount` antes da IA; lança 402 quando o saldo não cobre. */
  reserve(amount: number, reference: string): Promise<void>;
  /** Devolve `amount`; `false` quando a devolução falhou (registrada no log para conciliação). */
  refund(amount: number, reference: string): Promise<boolean>;
}

/** `itinerary`: créditos de roteiro (comprados). `chat`: mensagens com o Felipe (ganhas com anúncios). */
export type WalletKind = 'itinerary' | 'chat';

const BILLING_UNAVAILABLE = 'Não foi possível consultar seus créditos agora.';

const INSUFFICIENT: Record<WalletKind, () => AppError> = {
  itinerary: () => new AppError(402, 'Créditos insuficientes para gerar este roteiro.', 'INSUFFICIENT_CREDITS'),
  chat: () => new AppError(402, 'Assista a um anúncio para continuar conversando com o Felipe.', 'NEEDS_REWARDED_AD')
};

async function adjustWithRetry(config: RevenueCatConfig, uid: string, currency: string, delta: number, reference: string): Promise<AdjustmentResult> {
  // Mesma chave nas duas tentativas: o RevenueCat aplica o ajuste no máximo uma vez.
  const idempotencyKey = randomUUID();
  const first = await adjustCredits(config, uid, currency, delta, idempotencyKey, reference);
  return first === 'retryable' ? adjustCredits(config, uid, currency, delta, idempotencyKey, reference) : first;
}

/** Falhas de infraestrutura (5xx, 429, erro inesperado) são devolvidas; erros causados pelo pedido do usuário, não. */
export function isRefundableFailure(error: unknown): boolean {
  return !(error instanceof AppError) || error.status >= 500 || error.status === 429;
}

/**
 * Reserva `amount` antes de `run` e devolve se `run` falhar por infraestrutura. Erros causados
 * pelo pedido (áudio inválido, transcrição vazia...) mantêm a cobrança, pois a IA já foi usada.
 */
export async function withReservation<T>(wallet: CreditWallet | null, amount: number, reference: string, run: () => Promise<T>): Promise<T> {
  await wallet?.reserve(amount, reference);
  try {
    return await run();
  } catch (error) {
    if (wallet && isRefundableFailure(error)) await wallet.refund(amount, `${reference} (devolução)`);
    throw error;
  }
}

/**
 * Carteira do usuário, ou `null` quando a cobrança daquele tipo está desligada (RevenueCat sem
 * configurar ou, para `chat`, sem REVENUECAT_CHAT_CURRENCY). Com a cobrança ligada e sem uid
 * (AI_AUTH_REQUIRED desligado), a requisição falha fechada em vez de sair de graça.
 */
export function creditWalletFor(uid: string | null, kind: WalletKind = 'itinerary'): CreditWallet | null {
  const config = readRevenueCatConfig();
  const currency = kind === 'chat' ? config?.chatCurrency : config?.currency;
  if (!config || !currency) return null;

  if (!uid) {
    throw new AppError(503, 'Serviço indisponível no momento.', 'BILLING_MISCONFIGURED', {
      cause: 'RevenueCat configurado sem AI_AUTH_REQUIRED=true: não há uid para cobrar'
    });
  }

  const logId = pseudonymousId(uid);

  return {
    async reserve(amount, reference) {
      const result = await adjustWithRetry(config, uid, currency, -amount, reference);
      if (result === 'ok') return;
      if (result === 'insufficient') throw INSUFFICIENT[kind]();
      // 409 ou duas tentativas sem resposta: o RevenueCat pode ter debitado; fica registrado para conciliar.
      console.error(`Créditos: reserva não confirmada (${result}), conciliar (cliente=${logId}, ${currency}=${amount}, ${reference}).`);
      throw new AppError(502, BILLING_UNAVAILABLE, 'BILLING_UNAVAILABLE', { cause: `reserva de ${currency}: ${result}` });
    },

    async refund(amount, reference) {
      if (amount <= 0) return true;

      const result = await adjustWithRetry(config, uid, currency, amount, reference);
      if (result !== 'ok') {
        console.error(`Créditos: devolução não confirmada (${result}), conciliar (cliente=${logId}, ${currency}=${amount}, ${reference}).`);
      }
      return result === 'ok';
    }
  };
}
