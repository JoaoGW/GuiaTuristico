import { Alert } from 'react-native';
import Constants from 'expo-constants';
import {
  AccessToken,
  Profile,
  LoginManager,
  Settings
} from "react-native-fbsdk-next";
import { isFacebookSDKReady, reinitializeFacebookSDK } from './facebookUtils';
import { NoAuthNavigationProp } from '@routes/noauth.routes';

// Função para garantir que o SDK está inicializado
const ensureFacebookSDKInitialized = async (): Promise<boolean> => {
  try {
    // Primeiro verifica se já está pronto
    if (isFacebookSDKReady()) {
      return true;
    }

    console.log('🔄 Facebook SDK não está pronto, tentando reinicializar...');
    
    // Tenta reinicializar
    const success = await reinitializeFacebookSDK();
    
    if (success) {
      console.log('✅ Facebook SDK reinicializado com sucesso');
      return true;
    }

    console.warn('❌ Não foi possível inicializar o Facebook SDK');
    return false;
  } catch (error) {
    console.error('Erro ao verificar Facebook SDK:', error);
    return false;
  }
};

const getUserFBData = async () => {
  try {
    const currentProfile = await Profile.getCurrentProfile();
    console.log('Facebook Profile:', currentProfile);
    return currentProfile;
  } catch (error) {
    console.warn('Erro ao obter dados do perfil do Facebook:', error);
    return null;
  }
};

export const handleFacebookSignIn = async (
  setIsAuthenticating: (status: boolean) => void,
  navigation?: NoAuthNavigationProp
) => {
  setIsAuthenticating(true);

  try {
    const isExpoGo = Constants.appOwnership === 'expo';

    // Em Expo Go não há módulos nativos; simula login (mesmo fluxo do Google)
    if (isExpoGo) {
      Alert.alert("Modo Expo Go", "Login simulado com sucesso!");
      if (navigation) {
        navigation.navigate("Welcome", {
          name: "Usuário Expo",
          email: "expo@example.com",
          photo: "https://cdn.pixabay.com/photo/2022/07/16/04/19/biker-7324421_640.jpg"
        });
      }
      setIsAuthenticating(false);
      return { success: true, simulated: true };
    }

    // Garante que o SDK está inicializado antes de tentar fazer login
    const isSDKReady = await ensureFacebookSDKInitialized();
    
    if (!isSDKReady) {
      throw new Error('Facebook SDK não está disponível. Verifique a configuração no app.json.');
    }

    // Verifica novamente se o LoginManager está disponível
    if (!LoginManager || typeof LoginManager.logInWithPermissions !== 'function') {
      throw new Error('LoginManager não está disponível. O Facebook SDK pode não estar configurado corretamente.');
    }

    const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
    
    if (result.isCancelled) {
      console.log("==> Login cancelled");
      setIsAuthenticating(false);
      return { success: false, cancelled: true };
    } else {
      console.log('Facebook login result:', result);
      
      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        const profileData = await getUserFBData();
        setIsAuthenticating(false);
        return { 
          success: true, 
          accessToken: data,
          profile: profileData 
        };
      }
      
      setIsAuthenticating(false);
      return { success: true, accessToken: data };
    }
  } catch (error) {
    console.error("Login fail with error:", error);
    setIsAuthenticating(false);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
};