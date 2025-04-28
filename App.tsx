import { View, StatusBar, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";

import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";

import { Loading } from "@components/Loading";
import { AuthRoute } from "@routes/auth.routes";

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
  const [fontsLoaded] = useFonts({ Poppins_300Light, Poppins_400Regular, Poppins_500Medium });
  const viewMode = getViewModeStyle();

  return (
    <GluestackUIProvider config={config}>
      <View style={{
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
            <NavigationContainer>
              <AuthRoute />
            </NavigationContainer>
          ) : (
            <Loading />
          )
        }
      </View>
    </GluestackUIProvider>
  );
}