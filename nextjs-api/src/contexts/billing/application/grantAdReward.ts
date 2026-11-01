import { AppError } from '@/shared/errors';
import { pseudonymousId } from '@/shared/privacy';
import { verifyAdRewardCallback } from '../infrastructure/admobRewardVerifier';
import { adjustCredits, readRevenueCatConfig } from '../infrastructure/revenueCatClient';

/** Teto por anúncio: protege contra um bloco de anúncio configurado com valor errado no AdMob. */
const MAX_REWARD_PER_AD = 20;

export type RewardOutcome = 'credited' | 'ignored' | 'retry';

/**
 * Credita as mensagens de um anúncio recompensado assistido, a partir do callback assinado do
 * AdMob. O `user_id` é o uid do Firebase, informado pelo app no `serverSideVerificationOptions`.
 * `retry` pede ao AdMob que reenvie (ele tenta até 5 vezes); `ignored` responde 200 sem creditar.
 */
export async function grantAdReward(rawQuery: string): Promise<RewardOutcome> {
  const config = readRevenueCatConfig();
  if (!config?.chatCurrency) {
    throw new AppError(503, 'Recompensas de anúncio desligadas.', 'BILLING_MISCONFIGURED', {
      cause: 'callback do AdMob sem RevenueCat ou sem REVENUECAT_CHAT_CURRENCY'
    });
  }

  const reward = await verifyAdRewardCallback(rawQuery);
  const allowedAdUnits = (process.env.ADMOB_REWARDED_AD_UNIT_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean);

  // Callbacks autênticos, mas que não devem virar mensagens, recebem 200 para o AdMob não reenviar.
  if (!allowedAdUnits.includes(reward.adUnit) || reward.rewardItem !== config.chatCurrency) {
    console.error(`Anúncio: recompensa ignorada (bloco ${reward.adUnit} ou item ${reward.rewardItem} não configurado).`);
    return 'ignored';
  }
  if (!reward.userId || reward.userId.length > 128 || reward.userId === '.' || reward.userId === '..') {
    console.error(`Anúncio: recompensa ignorada sem user_id válido (transação ${reward.transactionId}).`);
    return 'ignored';
  }

  const amount = Math.min(reward.rewardAmount, MAX_REWARD_PER_AD);
  // A transação do AdMob é a chave de idempotência: reenvios do mesmo callback creditam uma vez só.
  const result = await adjustCredits(
    config,
    reward.userId,
    config.chatCurrency,
    amount,
    `admob-${reward.transactionId}`,
    `anúncio recompensado ${reward.transactionId.slice(0, 8)}`
  );

  if (result === 'ok') return 'credited';
  if (result === 'retryable') return 'retry';
  console.error(`Anúncio: crédito não confirmado (${result}), conciliar (cliente=${pseudonymousId(reward.userId)}, transação ${reward.transactionId}).`);
  return 'ignored';
}
