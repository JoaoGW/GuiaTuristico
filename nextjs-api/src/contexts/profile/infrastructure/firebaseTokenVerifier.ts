import { X509Certificate, verify } from 'node:crypto';
import { AppError } from '@/shared/errors';

// Verificação do ID token do Firebase sem `firebase-admin`, conforme a documentação
// "Verify ID tokens using a third-party JWT library": RS256, `kid` nos certificados
// públicos do Google, `aud` = projeto, `iss` = securetoken, `sub` = uid.
const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const CLOCK_SKEW_SECONDS = 60;

let certsCache: { certs: Record<string, string>; expiresAt: number } | null = null;

const invalidToken = (cause: string) =>
  new AppError(401, 'Sessão inválida ou expirada. Entre novamente.', 'UNAUTHENTICATED', { cause });

async function getGoogleCerts(): Promise<Record<string, string>> {
  if (certsCache && certsCache.expiresAt > Date.now()) {
    return certsCache.certs;
  }

  let response: Response;
  try {
    response = await fetch(CERTS_URL, { signal: AbortSignal.timeout(5000) });
  } catch (error) {
    throw new AppError(503, 'Não foi possível validar a sessão agora.', 'AUTH_UNAVAILABLE', { cause: error });
  }
  if (!response.ok) {
    throw new AppError(503, 'Não foi possível validar a sessão agora.', 'AUTH_UNAVAILABLE', {
      cause: `Certificados do Firebase status=${response.status}`
    });
  }

  const certs = (await response.json()) as Record<string, string>;
  const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get('cache-control') ?? '')?.[1] ?? 3600);
  certsCache = { certs, expiresAt: Date.now() + maxAge * 1000 };
  return certs;
}

function decodeSegment(segment: string): Record<string, unknown> {
  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
  } catch {
    throw invalidToken('segmento do token não é JSON válido');
  }
}

/** Valida assinatura e claims do ID token e devolve o uid do usuário. */
export async function verifyFirebaseIdToken(token: string, projectId: string): Promise<{ uid: string }> {
  const segments = token.split('.');
  if (segments.length !== 3) {
    throw invalidToken('token sem 3 segmentos');
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = decodeSegment(headerSegment);
  const payload = decodeSegment(payloadSegment);
  const now = Math.floor(Date.now() / 1000);

  if (header.alg !== 'RS256' || typeof header.kid !== 'string') throw invalidToken('alg/kid inválidos');
  if (payload.aud !== projectId) throw invalidToken('aud diferente do projeto');
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw invalidToken('iss inválido');
  if (typeof payload.sub !== 'string' || payload.sub === '' || payload.sub.length > 128) throw invalidToken('sub inválido');
  if (typeof payload.exp !== 'number' || payload.exp <= now - CLOCK_SKEW_SECONDS) throw invalidToken('token expirado');
  if (typeof payload.iat !== 'number' || payload.iat > now + CLOCK_SKEW_SECONDS) throw invalidToken('iat no futuro');
  if (typeof payload.auth_time !== 'number' || payload.auth_time > now + CLOCK_SKEW_SECONDS) throw invalidToken('auth_time inválido');

  const certificate = (await getGoogleCerts())[header.kid];
  if (!certificate) throw invalidToken('kid sem certificado correspondente');

  const isValid = verify(
    'RSA-SHA256',
    Buffer.from(`${headerSegment}.${payloadSegment}`),
    new X509Certificate(certificate).publicKey,
    Buffer.from(signatureSegment, 'base64url')
  );
  if (!isValid) throw invalidToken('assinatura inválida');

  return { uid: payload.sub };
}
