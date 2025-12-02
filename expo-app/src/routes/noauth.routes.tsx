import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LoginScreen } from "@screens/Credentials/Login";
import { SignUpScreen } from "@screens/Credentials/SignUp";
import { ForgotPasswordScreen } from "@screens/Credentials/ForgotPassword";
import { Introduction } from "@screens/Presentations/Introduction";

const Stack = createNativeStackNavigator();

type NoAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Introduction: undefined;
}

export type NoAuthNavigationProp = NativeStackNavigationProp<NoAuthStackParamList>;

export function NoAuthRoute(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Introduction" component={ Introduction } />
      <Stack.Screen name="Login" component={ LoginScreen }/>
      <Stack.Screen name="SignUp" component={ SignUpScreen }/>
      <Stack.Screen name="ForgotPassword" component={ ForgotPasswordScreen }/>
    </Stack.Navigator>
  )
}