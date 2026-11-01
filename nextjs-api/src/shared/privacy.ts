import { createHash } from 'node:crypto';

/**
 * Identificador pseudônimo para logs (LGPD: minimização). O uid do Firebase não vai para os logs;
 * para conciliar, o suporte calcula o mesmo hash a partir do uid do cliente que reclamou.
 */
export function pseudonymousId(uid: string): string {
  return `u_${createHash('sha256').update(uid).digest('hex').slice(0, 16)}`;
}
