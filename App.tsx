import { View, StatusBar, useColorScheme } from "react-native";
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";

import { config } from "@gluestack-ui/config";
import { GluestackUIProvider, Text } from "@gluestack-ui/themed";

import { Loading } from "./src/components/Loading";
import { Home } from "./src/screens/Home";

const lightMode = {
  background: '#FDFDFD',
  text: '#000'
}

const darkMode = {
  background: '#292929',
  text: '#FFF'
}

function getViewModeStyle() {
  const viewMode = useColorScheme();
  const theme = viewMode === 'dark' ? darkMode : lightMode
  return theme
}

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_300Light, Poppins_400Regular, Poppins_500Medium });
  const viewMode = getViewModeStyle();

  return (
    <GluestackUIProvider config={config}>
      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: viewMode.background
      }}>

        <StatusBar
          barStyle={useColorScheme() === 'dark' ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        {
          fontsLoaded
             /*<Text>Página Inicial</Text>*/
            ? <Home/>
            : <Loading/>
            
        }
      </View>
    </GluestackUIProvider>
  );
}