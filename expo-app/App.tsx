import 'react-native-gesture-handler';

import { useState, useEffect, useCallback } from "react";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import * as SplashScreen from 'expo-splash-screen';

import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";

import { NavbarContext } from "@components/NavigationBar";
import { SplashLoading } from "@components/Loading/SplashLoading";

import { ProvideUserLocation } from "@contexts/requestDeviceLocation";
import { AuthProvider } from '@contexts/AuthContext';

import { Routes } from '@routes/index';
import { appPreloader } from '@services/AppPreloader';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1200,
  fade: true,
});

const lightMode = {
  background: '#FDFDFD',
  text: '#000'
};

const darkMode = {
  background: '#292929',
  text: '#FFF'
};

export default function App() {
  const [currentActive, setCurrentActive] = useState<string>('Home');
  const [appIsReady, setAppIsReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando aplicação...");
  const [fontsLoaded] = useFonts({ Poppins_300Light, Poppins_400Regular, Poppins_500Medium });
  
  const colorScheme = useColorScheme();
  const viewMode = colorScheme === 'dark' ? darkMode : lightMode;

  useEffect(() => {
    async function prepare() {
      try {
        setLoadingMessage("Carregando textos...");
        if (!fontsLoaded) return;

        setLoadingMessage("Verificando conexão à internet...");
        const isApiAvailable = await appPreloader.checkApiAvailability();
        
        if (isApiAvailable) {
          setLoadingMessage("Verificando nossos serviços...");
          await appPreloader.preloadCriticalResources();
        } else {
          setLoadingMessage("Modo offline detectado...");
        }

        setLoadingMessage("Quase tudo pronto...");
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAppIsReady(true);
      } catch (e) {
        console.warn('Erro durante a inicialização:', e);
        setLoadingMessage("Infelizmente encontramos um erro. Por favor, contate o suporte!");
        await new Promise(resolve => setTimeout(resolve, 500));
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1E40AF' }}>
        <SplashLoading message={loadingMessage} />
      </View>
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider 
        style={{
          flex: 1,
          backgroundColor: viewMode.background
        }}
        onLayout={onLayoutRootView}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        <AuthProvider>
          <ProvideUserLocation>
            <NavbarContext.Provider value={{ currentActive, setCurrentActive }}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Routes />
              </GestureHandlerRootView> 
            </NavbarContext.Provider>
          </ProvideUserLocation>
        </AuthProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}