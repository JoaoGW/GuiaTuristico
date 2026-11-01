import { createPublicKey, verify, type KeyObject } from 'node:crypto';
import { AppError } from '@/shared/errors';

// Verificação server-side (SSV) de anúncios recompensados do AdMob, conferida em 01/11/2026:
// a assinatura (ECDSA SHA-256, DER, base64 web-safe) cobre a query string exatamente como
// chegou, até antes de "&signature="; `signature` e `key_id` são sempre os dois últimos
// parâmetros. As chaves públicas podem ficar em cache por até 24 h.
const KEYS_URL = 'https://www.gstatic.com/admob/reward/verifier-keys.json';
const KEYS_TTL_MS = 12 * 60 * 60 * 1000;

let keysCache: { keys: Map<string, KeyObject>; expiresAt: number } | null = null;
// Recarga forçada (key_id desconhecido) no máximo 1 vez por minuto: callbacks forjados não viram rajadas ao Google.
let lastForcedRefreshAt = 0;

export interface AdReward {
  adUnit: string;
  rewardItem: string;
  rewardAmount: number;
  transactionId: string;
  userId: string | null;
}

const invalidCallback = (cause: string) => new AppError(403, 'Callback de recompensa inválido.', 'INVALID_REWARD_CALLBACK', { cause });

async function getVerifierKeys(forceRefresh: boolean): Promise<Map<string, KeyObject>> {
  const canForce = forceRefresh && Date.now() - lastForcedRefreshAt > 60_000;
  if (keysCache && keysCache.expiresAt > Date.now() && !canForce) return keysCache.keys;
  if (canForce) lastForcedRefreshAt = Date.now();

  let response: Response;
  try {
    // ADMOB_VERIFIER_KEYS_URL só existe para testes locais com chaves próprias; em produção vale só o Google.
    const keysUrl = (process.env.NODE_ENV !== 'production' && process.env.ADMOB_VERIFIER_KEYS_URL) || KEYS_URL;
    response = await fetch(keysUrl, { signal: AbortSignal.timeout(5000) });
  } catch (error) {
    throw new AppError(503, 'Verificação de anúncios indisponível.', 'REWARD_VERIFICATION_UNAVAILABLE', { cause: error });
  }
  const data = (await response.json().catch(() => null)) as { keys?: { keyId?: number | string; base64?: string; pem?: string }[] } | null;
  if (!response.ok || !Array.isArray(data?.keys)) {
    throw new AppError(503, 'Verificação de anúncios indisponível.', 'REWARD_VERIFICATION_UNAVAILABLE', {
      cause: `chaves do AdMob status=${response.status}`
    });
  }

  const keys = new Map<string, KeyObject>();
  for (const key of data.keys) {
    try {
      const publicKey = key.pem
        ? createPublicKey(key.pem)
        : createPublicKey({ key: Buffer.from(key.base64 ?? '', 'base64'), format: 'der', type: 'spki' });
      keys.set(String(key.keyId), publicKey);
    } catch {
      // Chave em formato inesperado: ignorada; as demais continuam válidas.
    }
  }
  keysCache = { keys, expiresAt: Date.now() + KEYS_TTL_MS };
  return keys;
}

/** Confere a assinatura do callback e devolve os dados da recompensa. `rawQuery` é a query sem decodificar. */
export async function verifyAdRewardCallback(rawQuery: string): Promise<AdReward> {
  const signatureIndex = rawQuery.indexOf('&signature=');
  if (signatureIndex <= 0) throw invalidCallback('sem signature');

  const message = rawQuery.slice(0, signatureIndex);
  const params = new URLSearchParams(rawQuery);
  const signature = params.get('signature');
  const keyId = params.get('key_id');
  if (!signature || !keyId) throw invalidCallback('sem signature ou key_id');

  // Chave desconhecida pode ser rotação recente: recarrega uma vez antes de recusar.
  let publicKey = (await getVerifierKeys(false)).get(keyId);
  if (!publicKey) publicKey = (await getVerifierKeys(true)).get(keyId);
  if (!publicKey) throw invalidCallback(`key_id ${keyId} desconhecido`);

  // O decodificador 'base64' do Node aceita também o alfabeto web-safe (- e _) usado pelo AdMob.
  let isValid = false;
  try {
    isValid = verify('sha256', Buffer.from(message), publicKey, Buffer.from(signature, 'base64'));
  } catch {
    isValid = false;
  }
  if (!isValid) throw invalidCallback('assinatura inválida');

  const rewardAmount = Number(params.get('reward_amount'));
  const transactionId = params.get('transaction_id') ?? '';
  if (!Number.isInteger(rewardAmount) || rewardAmount <= 0 || !/^[0-9a-fA-F]{8,64}$/.test(transactionId)) {
    throw invalidCallback('reward_amount ou transaction_id inválido');
  }

  return {
    adUnit: params.get('ad_unit') ?? '',
    rewardItem: params.get('reward_item') ?? '',
    rewardAmount,
    transactionId,
    userId: params.get('user_id')
  };
}
