import { randomUUID } from 'node:crypto';
import { AppError } from '@/shared/errors';
import { adjustCredits, readRevenueCatConfig, type AdjustmentResult, type RevenueCatConfig } from '../infrastructure/revenueCatClient';

/**
 * Carteira de créditos de IA de um usuário no RevenueCat. Os créditos são reservados (debitados)
 * antes da geração e os blocos que falharem são devolvidos: assim, pedidos simultâneos não
 * conseguem gerar roteiros além do saldo, e o saldo final reflete só os blocos gerados.
 */
export interface CreditWallet {
  /** Debita `credits` antes da geração; lança 402 INSUFFICIENT_CREDITS se o saldo não cobrir. */
  reserve(credits: number, reference: string): Promise<void>;
  /** Devolve créditos de blocos não gerados; `false` quando a devolução falhou (registrada no log). */
  refund(credits: number, reference: string): Promise<boolean>;
}

const BILLING_UNAVAILABLE = 'Não foi possível consultar seus créditos agora.';

async function adjustWithRetry(config: RevenueCatConfig, uid: string, delta: number, reference: string): Promise<AdjustmentResult> {
  // Mesma chave nas duas tentativas: o RevenueCat aplica o ajuste no máximo uma vez.
  const idempotencyKey = randomUUID();
  const first = await adjustCredits(config, uid, delta, idempotencyKey, reference);
  return first === 'retryable' ? adjustCredits(config, uid, delta, idempotencyKey, reference) : first;
}

/**
 * Carteira do usuário, ou `null` enquanto o RevenueCat não estiver configurado (cobrança desligada).
 * Com o RevenueCat ligado, a cobrança exige saber quem é o usuário: sem uid (AI_AUTH_REQUIRED
 * desligado) a requisição falha fechada, em vez de gerar roteiros sem débito.
 */
export function creditWalletFor(uid: string | null): CreditWallet | null {
  const config = readRevenueCatConfig();
  if (!config) return null;

  if (!uid) {
    throw new AppError(503, 'Serviço indisponível no momento.', 'BILLING_MISCONFIGURED', {
      cause: 'RevenueCat configurado sem AI_AUTH_REQUIRED=true: não há uid para cobrar'
    });
  }

  return {
    async reserve(credits, reference) {
      const result = await adjustWithRetry(config, uid, -credits, reference);
      if (result === 'ok') return;
      if (result === 'insufficient') {
        throw new AppError(402, 'Créditos insuficientes para gerar este roteiro.', 'INSUFFICIENT_CREDITS');
      }
      if (result === 'uncertain') {
        console.error(`Créditos: reserva em estado incerto (409), conciliar (uid=${uid}, créditos=${credits}, ${reference}).`);
      }
      throw new AppError(502, BILLING_UNAVAILABLE, 'BILLING_UNAVAILABLE', { cause: `reserva de créditos: ${result}` });
    },

    async refund(credits, reference) {
      if (credits <= 0) return true;

      const result = await adjustWithRetry(config, uid, credits, reference);
      if (result !== 'ok') {
        console.error(`Créditos: devolução não confirmada (${result}), conciliar (uid=${uid}, créditos=${credits}, ${reference}).`);
      }
      return result === 'ok';
    }
  };
}
