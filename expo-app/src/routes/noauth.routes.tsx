import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LoginScreen } from "@screens/Login";
import { UserPreferences } from "@screens/UserPreferences";

const Stack = createNativeStackNavigator();

type NoAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
}
export type NoAuthNavigationProp = NativeStackNavigationProp<NoAuthStackParamList>;

export function NoAuthRoute(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={ LoginScreen }/>
      <Stack.Screen name="UserPreferences" component={UserPreferences} />
    </Stack.Navigator>
  )
}