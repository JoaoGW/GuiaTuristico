import { AppError } from '@/shared/errors';
import { verifyFirebaseIdToken } from '../infrastructure/firebaseTokenVerifier';

/**
 * Exige `Authorization: Bearer <ID token do Firebase>` quando `AI_AUTH_REQUIRED=true`.
 * Fica desligado por padrão até o app enviar o token (FE-10); nesse caso devolve `null`.
 */
export async function authenticateRequest(authorization: string | undefined): Promise<{ uid: string } | null> {
  if (process.env.AI_AUTH_REQUIRED !== 'true') {
    return null;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new AppError(503, 'Serviço indisponível no momento.', 'AUTH_UNAVAILABLE', {
      cause: 'AI_AUTH_REQUIRED=true sem FIREBASE_PROJECT_ID'
    });
  }

  const token = /^Bearer (.+)$/.exec(authorization ?? '')?.[1]?.trim();
  if (!token) {
    throw new AppError(401, 'Entre na sua conta para usar este recurso.', 'UNAUTHENTICATED');
  }

  return verifyFirebaseIdToken(token, projectId);
}
