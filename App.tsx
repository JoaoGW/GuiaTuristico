import { View, StatusBar, Text, useColorScheme } from "react-native";
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";

import { Loading } from "./src/components/Loading";

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
          ? <Text>Página Inicial</Text>
          : <Loading/>
      }
    </View>
  );
}