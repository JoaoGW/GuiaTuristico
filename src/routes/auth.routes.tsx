import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LoginScreen } from "@screens/Login";
import { Home } from "@screens/Home";
import { Settings } from "@screens/Settings";
import { Profile } from "@screens/Profile";
import { GenerateItinerary } from "@screens/GenerateItinerary";

import { NavigationBar } from "@components/NavigationBar";

const Stack = createNativeStackNavigator();

type AuthStackParamList = {
  Login: undefined;
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  GenerateItinerary: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export function AuthRoute() {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="GenerateItinerary" component={GenerateItinerary} />
      </Stack.Navigator>
      <NavigationBar />
    </>
  );
}