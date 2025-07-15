import 'react-native-gesture-handler';

import { useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";

import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";

import { Loading } from "@components/Loading";
import { NavbarContext } from "@components/NavigationBar";

import { ProvideUserLocation } from "@contexts/requestDeviceLocation";
import { AuthProvider } from '@contexts/AuthContext';

import { Routes } from '@routes/index';

const lightMode = {
  background: '#FDFDFD',
  text: '#000'
};

const darkMode = {
  background: '#292929',
  text: '#FFF'
};

function getViewModeStyle() {
  const viewMode = useColorScheme();
  const theme = viewMode === 'dark' ? darkMode : lightMode;
  return theme;
}

export default function App() {
  const [currentActive, setCurrentActive] = useState<string>('Home');
  const [fontsLoaded] = useFonts({ Poppins_300Light, Poppins_400Regular, Poppins_500Medium });
  const viewMode = getViewModeStyle();

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider style={{
        flex: 1,
        backgroundColor: viewMode.background
      }}>
        <StatusBar
          barStyle={useColorScheme() === 'dark' ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        {
          fontsLoaded ? (
            <AuthProvider>
              <ProvideUserLocation>
                <NavbarContext.Provider value={{ currentActive, setCurrentActive }}>
                  <GestureHandlerRootView>
                    <Routes />
                  </GestureHandlerRootView> 
                </NavbarContext.Provider>
              </ProvideUserLocation>
            </AuthProvider>
          ) : (
            <Loading />
          )
        }
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}