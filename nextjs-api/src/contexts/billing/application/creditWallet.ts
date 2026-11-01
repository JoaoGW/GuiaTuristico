import { randomUUID } from 'node:crypto';
import { AppError } from '@/shared/errors';
import { getCreditBalance, readRevenueCatConfig, spendCredits } from '../infrastructure/revenueCatClient';

/** Carteira de créditos de IA de um usuário, com saldo e débito no RevenueCat. */
export interface CreditWallet {
  /** Lança 402 INSUFFICIENT_CREDITS quando o saldo não cobre `credits`. */
  ensureAvailable(credits: number): Promise<void>;
  /** Debita os créditos consumidos; `false` quando o débito não foi feito (registrado no log para conciliação). */
  charge(credits: number, reference: string): Promise<boolean>;
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
    async ensureAvailable(credits) {
      const balance = await getCreditBalance(config, uid);
      if (balance < credits) {
        throw new AppError(402, 'Créditos insuficientes para gerar este roteiro.', 'INSUFFICIENT_CREDITS');
      }
    },

    async charge(credits, reference) {
      if (credits <= 0) return true;

      // Mesma chave nas duas tentativas: o RevenueCat executa o débito no máximo uma vez.
      const idempotencyKey = randomUUID();
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const debited = await spendCredits(config, uid, credits, idempotencyKey, reference);
          if (!debited) {
            console.error(`Créditos: saldo insuficiente no débito após a geração (uid=${uid}, créditos=${credits}, ${reference}).`);
          }
          return debited;
        } catch (error) {
          if (attempt === 2) {
            console.error(`Créditos: débito não realizado (uid=${uid}, créditos=${credits}, ${reference}):`, error);
          }
        }
      }
      return false;
    }
  };
}
