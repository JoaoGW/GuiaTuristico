import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Home } from "@screens/Home";
import { Settings } from "@screens/Settings";
import { Profile } from "@screens/Profile";
import { UserPreferences } from "@screens/UserPreferences";
import { GenerateItinerary } from "@screens/GenerateItinerary";
import { AIChat } from "@screens/AIChat";
import { MapsExpanded } from "@screens/MapsExpanded";

import { NavigationBar } from "@components/NavigationBar";

const Stack = createNativeStackNavigator();

type AuthStackParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  GenerateItinerary: undefined;
  UserPreferences: undefined;
  AIChat: undefined;
  MapsExpanded: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export function AuthRoute() {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="UserPreferences" component={UserPreferences} />
        <Stack.Screen name="GenerateItinerary" component={GenerateItinerary} />
        <Stack.Screen name="AIChat" component={AIChat} />
        <Stack.Screen name="MapsExpanded" component={MapsExpanded} />
      </Stack.Navigator>
      <NavigationBar />
    </>
  );
}