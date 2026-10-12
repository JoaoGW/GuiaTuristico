import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useState, useEffect, useCallback } from "react";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import * as SplashScreen from 'expo-splash-screen';

import { config } from "@gluestack-ui/config";
import { GluestackUIProvider, StyledProvider } from "@gluestack-ui/themed";

import { SplashLoading } from "@components/Loading/SplashLoading";

import { ProvideUserLocation } from "@contexts/requestDeviceLocation";
import { AuthProvider } from '@contexts/AuthContext';
import { ProvideUserNetInfo } from '@contexts/NetInfo';

import { Routes } from '@routes/index';

let mobileAds: any, getTrackingPermissionsAsync: any, PermissionStatus: any, requestTrackingPermissionsAsync: any;
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    const admobModule = require('react-native-google-mobile-ads');
    mobileAds = admobModule.default;
    
    const trackingModule = require('expo-tracking-transparency');
    getTrackingPermissionsAsync = trackingModule.getTrackingPermissionsAsync;
    PermissionStatus = trackingModule.PermissionStatus;
    requestTrackingPermissionsAsync = trackingModule.requestTrackingPermissionsAsync;
  } catch (error) {
    console.log('AdMob or tracking modules not available:', error);
    getTrackingPermissionsAsync = async () => ({ status: 'granted' });
    PermissionStatus = { UNDETERMINED: 'undetermined' };
    requestTrackingPermissionsAsync = async () => ({ status: 'granted' });
  }
} else {
  getTrackingPermissionsAsync = async () => ({ status: 'granted' });
  PermissionStatus = { UNDETERMINED: 'undetermined' };
  requestTrackingPermissionsAsync = async () => ({ status: 'granted' });
}

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

        setLoadingMessage("Personalizando anúncios para você...");
        
        if (!isExpoGo && mobileAds) {
          await mobileAds()
            .initialize()
            .then((adapterStatuses: any) => {
            });
          const { status } = await getTrackingPermissionsAsync();
          if (status === PermissionStatus.UNDETERMINED) {
            await requestTrackingPermissionsAsync();
          }
          await mobileAds().initialize();
        } else {
          console.log('Skipping AdMob initialization in Expo GO');
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider 
          style={{
            flex: 1,
            backgroundColor: viewMode.background
          }}
          onLayout={ onLayoutRootView }
        >
            <StyledProvider config={config}>
            <StatusBar
              barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"}
              backgroundColor="transparent"
              translucent
            />

            <AuthProvider>
              <ProvideUserLocation>
                <ProvideUserNetInfo>
                  <Routes />
                </ProvideUserNetInfo>
              </ProvideUserLocation>
            </AuthProvider>
            </StyledProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}