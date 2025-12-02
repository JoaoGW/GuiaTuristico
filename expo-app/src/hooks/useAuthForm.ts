/**
 * Hook customizado para facilitar operações de autenticação
 * Fornece funções prontas para login, logout, signup, etc.
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@contexts/AuthContext';
import { signInUser } from '@services/login/emailLogin';
import { signUpUser } from '@services/login/emailSignup';
import { handleGoogleSignIn } from '@services/login/googleLogin';
import { sendPasswordReset } from '@services/login/passwordReset';
import { NoAuthNavigationProp } from '@routes/noauth.routes';

interface UseAuthFormReturn {
  isAuthenticating: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

/**
 * Hook para gerenciar operações de autenticação
 * @param navigation - Objeto de navegação
 * @returns Funções e estado de autenticação
 */
export const useAuthForm = (navigation: NoAuthNavigationProp): UseAuthFormReturn => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { logout: contextLogout } = useAuth();

  /**
   * Login com email e senha
   */
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    setIsAuthenticating(true);
    try {
      await signInUser(email, password, navigation, setIsAuthenticating);
    } catch (error) {
      setIsAuthenticating(false);
      throw error;
    }
  };

  /**
   * Cadastro com email e senha
   */
  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setIsAuthenticating(true);
    try {
      await signUpUser(name, email, password, navigation, setIsAuthenticating);
    } catch (error) {
      setIsAuthenticating(false);
      throw error;
    }
  };

  /**
   * Login com Google
   */
  const loginWithGoogle = async (): Promise<void> => {
    setIsAuthenticating(true);
    try {
      await handleGoogleSignIn(setIsAuthenticating, navigation);
    } catch (error) {
      setIsAuthenticating(false);
      throw error;
    }
  };

  /**
   * Recuperação de senha
   */
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      return await sendPasswordReset(email);
    } catch (error) {
      return false;
    }
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    try {
      await contextLogout();
      Alert.alert('Logout', 'Você saiu com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout.');
      throw error;
    }
  };

  return {
    isAuthenticating,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    resetPassword,
    logout,
  };
};
