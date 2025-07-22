import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LoginScreen } from "@screens/Login";
import { Welcome } from "@screens/Welcome";
import { UserPreferences } from "@screens/UserPreferences";

const Stack = createNativeStackNavigator();

type NoAuthStackParamList = {
  Login: undefined;
  Welcome: undefined;
  SignUp: undefined;
}
export type NoAuthNavigationProp = NativeStackNavigationProp<NoAuthStackParamList>;

export function NoAuthRoute(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={ Welcome } />
      <Stack.Screen name="Login" component={ LoginScreen }/>
      <Stack.Screen name="UserPreferences" component={ UserPreferences } />
    </Stack.Navigator>
  )
}