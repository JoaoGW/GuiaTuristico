/**
 * Tipos e interfaces para autenticação
 * Centraliza todas as definições de tipos relacionadas ao sistema de auth
 */

import { User } from 'firebase/auth';

/**
 * Dados do usuário armazenados localmente
 */
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Converte User do Firebase para UserData
 */
export const firebaseUserToUserData = (user: User): UserData => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
};

/**
 * Parâmetros de navegação para Welcome screen
 */
export interface WelcomeParams {
  name: string;
  email: string;
  photo: string;
}

/**
 * Estado de autenticação
 */
export type AuthState = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * Códigos de erro do Firebase Auth
 */
export type FirebaseAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/weak-password'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/invalid-credential'
  | 'auth/network-request-failed'
  | 'auth/too-many-requests'
  | 'auth/requires-recent-login'
  | 'auth/invalid-user-token'
  | 'auth/user-token-expired';

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Props para componentes de autenticação
 */
export interface AuthFormProps {
  isAuthenticating: boolean;
  onSubmit: () => void;
  onGoogleSignIn: () => void;
}

/**
 * Configuração de autenticação social
 */
export interface SocialAuthConfig {
  googleEnabled: boolean;
  facebookEnabled?: boolean;
  appleEnabled?: boolean;
}
