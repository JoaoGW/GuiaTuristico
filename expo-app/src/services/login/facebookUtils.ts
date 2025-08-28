import { Settings, LoginManager } from 'react-native-fbsdk-next';

// Função utilitária para verificar se o Facebook SDK está funcionando
export const isFacebookSDKReady = (): boolean => {
  try {
    return !!(Settings && LoginManager && 
             typeof Settings.initializeSDK === 'function' &&
             typeof LoginManager.logInWithPermissions === 'function');
  } catch (error) {
    return false;
  }
};

// Forçar a reinicialização do Facebook SDK
export const reinitializeFacebookSDK = async (): Promise<boolean> => {
  try {
    if (!Settings || typeof Settings.initializeSDK !== 'function') {
      return false;
    }

    // Reinicializa o SDK
    Settings.initializeSDK();
    
    // Aguarda um pouco para a inicialização completar
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return isFacebookSDKReady();
  } catch (error) {
    console.error('Erro ao reinicializar Facebook SDK:', error);
    return false;
  }
};
