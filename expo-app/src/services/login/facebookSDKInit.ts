import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export const initializeFacebookSDK = async (): Promise<void> => {
  try {
    // Não há SDK nativo no Expo Go
    if (Constants.appOwnership === 'expo') {
      console.log('Facebook SDK: pulando inicialização (rodando no Expo Go)');
      return;
    }
    // Se estivermos no modo de desenvolvimento no simulador, pode não funcionar perfeitamente
    if (__DEV__ && Platform.OS === 'ios' && Constants.isDevice === false) {
      console.log('Facebook SDK: Executando no simulador iOS - alguns recursos podem não funcionar');
    }

    // Tenta importar dinamicamente o Settings para evitar problemas de inicialização
    const { Settings } = await import('react-native-fbsdk-next');
    
    // Verifica se o Settings está disponível
    if (!Settings || typeof Settings.initializeSDK !== 'function') {
      console.warn('Facebook SDK não está disponível ou não foi configurado corretamente');
      console.warn('Verifique se o plugin react-native-fbsdk-next está configurado no app.json');
      return;
    }

    // Adiciona um delay para garantir que o SDK está pronto
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Inicializa o SDK do Facebook
    Settings.initializeSDK();
    
    // Adiciona outro delay após a inicialização
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Solicita permissão de rastreamento (necessário para iOS)
    if (Platform.OS === 'ios') {
      try {
        const { status } = await requestTrackingPermissionsAsync();
        
        if (status === 'granted' && Settings.setAdvertiserTrackingEnabled) {
          await Settings.setAdvertiserTrackingEnabled(true);
        }
      } catch (trackingError) {
        console.warn('Erro ao configurar tracking permission:', trackingError);
      }
    }
    
    console.log('✅ Facebook SDK inicializado com sucesso');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('Facebook SDK não pôde ser inicializado:', errorMessage);
    console.warn('Verifique se todas as configurações do Facebook estão corretas no app.json');
    // Não propaga o erro para não quebrar o carregamento da aplicação
  }
};
