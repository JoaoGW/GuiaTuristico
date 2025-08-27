import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { NoAuthNavigationProp } from '@routes/noauth.routes';
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from "@env";

let GoogleSignin: any = null;
if (Constants.appOwnership !== 'expo') {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
}

if (Constants.appOwnership !== 'expo' && GoogleSignin) {
  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    profileImageSize: 150
  });
}

export async function handleGoogleSignIn(
  setIsAuthenticating: (status: boolean) => void,
  navigation: NoAuthNavigationProp
) {
  try {
    setIsAuthenticating(true);

    const isExpoGo = Constants.appOwnership === 'expo';

    if (isExpoGo) {
      Alert.alert("Modo Expo Go", "Login simulado com sucesso!");
      navigation.navigate("Welcome", {
        name: "Usuário Expo",
        email: "expo@example.com",
        photo: "https://cdn.pixabay.com/photo/2022/07/16/04/19/biker-7324421_640.jpg"
      });
      setIsAuthenticating(false);
      return;
    }

    if (!GoogleSignin) {
      Alert.alert("Erro", "Google Sign-In não está disponível.");
      setIsAuthenticating(false);
      return;
    }

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const result = await GoogleSignin.signIn();

    if (result) {
      if (result.type === 'success' && result.data) {
        const { user, idToken } = result.data;
        const { name, email, photo } = user;
        navigation.navigate("Welcome", {
          name: name || 'Usuário',
          email: email || '',
          photo: photo || ''
        });
      } else {
        Alert.alert("Login com Google", "Login cancelado pelo usuário!");
        setIsAuthenticating(false);
      }
    } else {
      Alert.alert("Login com Google", "Não foi possível conectar-se a sua conta Google!");
      setIsAuthenticating(false);
    }
  } catch (error) {
    console.error('Erro no Google Sign-in:', error);
    setIsAuthenticating(false);
    Alert.alert("Login com Google", "Não foi possível conectar-se a sua conta Google!");
  }
}