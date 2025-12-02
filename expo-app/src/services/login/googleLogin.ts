import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { auth } from '../../../firebase';
import { NoAuthNavigationProp } from '@routes/noauth.routes';
import { getAuthErrorMessage } from './authErrors';

let GoogleSignin: any = null;
if (Constants.appOwnership !== 'expo') {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
}

// Configura Google Sign-In apenas em builds nativos
if (Constants.appOwnership !== 'expo' && GoogleSignin) {
  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: process.env.WEB_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID,
    profileImageSize: 150
  });
}

/**
 * Realiza login com conta Google
 * @param setIsAuthenticating - Função para controlar estado de autenticação
 * @param navigation - Objeto de navegação
 */
export async function handleGoogleSignIn(
  setIsAuthenticating: (status: boolean) => void,
  navigation: NoAuthNavigationProp
) {
  try {
    setIsAuthenticating(true);

    if (!GoogleSignin) {
      Alert.alert("Erro", "Google Sign-In não está disponível neste build.");
      setIsAuthenticating(false);
      return;
    }

    // Verifica se Google Play Services está disponível (Android)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    } catch (playServicesError: any) {
      if (__DEV__) {
        console.error('Google Play Services error:', playServicesError);
      }
      Alert.alert(
        "Erro",
        "Google Play Services não está disponível ou desatualizado."
      );
      setIsAuthenticating(false);
      return;
    }

    // Tenta fazer login
    const result = await GoogleSignin.signIn();

    if (result) {
      if (result.type === 'success' && result.data) {
        const { user, idToken } = result.data;
        
        // Valida dados recebidos
        if (!user || !user.email) {
          Alert.alert("Erro", "Não foi possível obter suas informações do Google.");
          setIsAuthenticating(false);
          return;
        }

        // Autentica com Firebase usando o token do Google
        const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        
        // O AuthContext observer detectará a mudança e navegará automaticamente
        setIsAuthenticating(false);
        
        // Sucesso - o onAuthStateChanged do AuthContext cuidará da navegação
      } else if (result.type === 'cancelled') {
        // Usuário cancelou o login
        if (__DEV__) {
          console.log('Login cancelado pelo usuário');
        }
        setIsAuthenticating(false);
      } else {
        Alert.alert("Login com Google", "Não foi possível conectar-se à sua conta Google.");
        setIsAuthenticating(false);
      }
    } else {
      Alert.alert("Login com Google", "Não foi possível conectar-se à sua conta Google.");
      setIsAuthenticating(false);
    }
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    
    // Log detalhado apenas em desenvolvimento
    if (__DEV__) {
      console.error('Erro no Google Sign-in:', {
        code: errorCode,
        message: error?.message,
        error: error,
      });
    }

    // Tratamento especial para cancelamento
    if (errorCode === '-5' || errorCode === '12501' || error?.message?.includes('SIGN_IN_CANCELLED')) {
      // Usuário cancelou, não mostra erro
      setIsAuthenticating(false);
      return;
    }

    // Mensagens específicas para erros comuns do Google Sign-In
    let errorMessage = 'Não foi possível conectar-se à sua conta Google.';
    
    if (errorCode === 'SIGN_IN_REQUIRED') {
      errorMessage = 'Por favor, faça login com sua conta Google.';
    } else if (errorCode === 'IN_PROGRESS') {
      errorMessage = 'Login já em andamento. Aguarde.';
    } else if (errorCode === 'PLAY_SERVICES_NOT_AVAILABLE') {
      errorMessage = 'Google Play Services não está disponível.';
    } else if (error?.message) {
      // Tenta usar mensagem de erro do Firebase se disponível
      const firebaseError = getAuthErrorMessage(errorCode);
      if (firebaseError !== 'Ocorreu um erro inesperado. Tente novamente.') {
        errorMessage = firebaseError;
      }
    }

    Alert.alert("Login com Google", errorMessage);
    setIsAuthenticating(false);
  }
}