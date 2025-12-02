import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../firebase';
import { NoAuthNavigationProp } from '@routes/noauth.routes';
import { validateSignUpForm, sanitizeInput } from '@utils/validators';
import { getAuthErrorMessage, shouldReportError } from './authErrors';

/**
 * Cadastra um novo usuário com email e senha
 * @param name - Nome do usuário
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param navigation - Objeto de navegação
 * @param setIsAuthenticating - Função para controlar estado de autenticação
 */
export async function signUpUser(
  name: string,
  email: string,
  password: string,
  navigation: NoAuthNavigationProp,
  setIsAuthenticating?: (status: boolean) => void
): Promise<void> {
  try {
    // Sanitiza inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password; // Senha não deve ser alterada

    // Valida todos os campos
    const validation = validateSignUpForm(sanitizedName, sanitizedEmail, sanitizedPassword);
    if (!validation.isValid) {
      Alert.alert('Erro de Validação', validation.error || 'Dados inválidos');
      if (setIsAuthenticating) setIsAuthenticating(false);
      return;
    }

    // Cria usuário no Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      sanitizedEmail,
      sanitizedPassword
    );
    const user = userCredential.user;

    // Atualiza perfil do usuário com nome
    if (sanitizedName) {
      await updateProfile(user, {
        displayName: sanitizedName
      });
    }

    // Envia email de verificação
    try {
      await sendEmailVerification(user);
      if (__DEV__) {
        console.log('Email de verificação enviado');
      }
    } catch (emailError: any) {
      // Não bloqueia o cadastro se email de verificação falhar
      if (__DEV__) {
        console.warn('Erro ao enviar email de verificação:', emailError);
      }
    }
    
    // O AuthContext observer detectará a mudança e navegará automaticamente
    if (setIsAuthenticating) setIsAuthenticating(false);
    
    // Mostra mensagem de sucesso
    Alert.alert(
      "Cadastro realizado!",
      "Sua conta foi criada com sucesso. Verifique seu email para confirmar o cadastro."
    );
    
    // Sucesso - o onAuthStateChanged do AuthContext cuidará da navegação
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const errorMessage = getAuthErrorMessage(errorCode);
    
    // Log detalhado apenas em desenvolvimento
    if (__DEV__) {
      console.error('Erro no cadastro:', {
        code: errorCode,
        message: error?.message,
      });
    }
    
    // Reporta erro se necessário
    if (shouldReportError(errorCode)) {
      // TODO: Integrar com serviço de logging (Sentry, Firebase Crashlytics, etc.)
      console.warn('Erro reportável:', errorCode);
    }
    
    // Mostra mensagem amigável ao usuário
    Alert.alert("Erro no Cadastro", errorMessage);
    
    if (setIsAuthenticating) setIsAuthenticating(false);
  }
}