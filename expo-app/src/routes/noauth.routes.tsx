import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LoginScreen } from "@screens/Credentials/Login";
import { SignUpScreen } from "@screens/Credentials/SignUp";
import { Introduction } from "@screens/Presentations/Introduction";
import { Welcome } from "@screens/Presentations/Welcome";

const Stack = createNativeStackNavigator();

type NoAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Introduction: undefined;
  Welcome: undefined;
}

export type NoAuthNavigationProp = NativeStackNavigationProp<NoAuthStackParamList>;

export function NoAuthRoute(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Introduction" component={ Introduction } />
      <Stack.Screen name="Login" component={ LoginScreen }/>
      <Stack.Screen name="SignUp" component={ SignUpScreen }/>
      <Stack.Screen name="Welcome" component={ Welcome } />
    </Stack.Navigator>
  )
}