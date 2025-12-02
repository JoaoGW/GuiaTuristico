import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { NoAuthNavigationProp } from '@routes/noauth.routes';
import { validateLoginForm, sanitizeInput } from '@utils/validators';
import { getAuthErrorMessage, shouldReportError } from './authErrors';

/**
 * Realiza login do usuário com email e senha
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param navigation - Objeto de navegação
 * @param setIsAuthenticating - Função para controlar estado de autenticação
 */
export async function signInUser(
  email: string,
  password: string,
  navigation: NoAuthNavigationProp,
  setIsAuthenticating?: (status: boolean) => void
): Promise<void> {
  try {
    // Sanitiza inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password; // Senha não deve ser alterada

    // Valida campos
    const validation = validateLoginForm(sanitizedEmail, sanitizedPassword);
    if (!validation.isValid) {
      Alert.alert('Erro de Validação', validation.error || 'Dados inválidos');
      if (setIsAuthenticating) setIsAuthenticating(false);
      return;
    }

    // Autenticação via Firebase
    const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword);
    const user = userCredential.user;
    
    // O AuthContext observer detectará a mudança e navegará automaticamente
    if (setIsAuthenticating) setIsAuthenticating(false);
    
    // Sucesso - o onAuthStateChanged do AuthContext cuidará da navegação
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const errorMessage = getAuthErrorMessage(errorCode);
    
    // Log detalhado apenas em desenvolvimento
    if (__DEV__) {
      console.error('Erro no login:', {
        code: errorCode,
        message: error?.message,
      });
    }
    
    // Reporta erro se necessário (pode integrar com serviço de monitoramento)
    if (shouldReportError(errorCode)) {
      // TODO: Integrar com serviço de logging (Sentry, Firebase Crashlytics, etc.)
      console.warn('Erro reportável:', errorCode);
    }
    
    // Mostra mensagem amigável ao usuário
    Alert.alert("Erro no Login", errorMessage);
    
    if (setIsAuthenticating) setIsAuthenticating(false);
  }
}