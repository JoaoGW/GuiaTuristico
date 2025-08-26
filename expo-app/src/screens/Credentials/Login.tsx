import { useState } from 'react';
import { Alert, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

let GoogleSignin: any = null;
if (Constants.appOwnership !== 'expo') {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
}

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from '@expo-google-fonts/libre-bodoni/useFonts';
import { LibreBodoni_700Bold } from '@expo-google-fonts/libre-bodoni/700Bold';

import { 
  Button, 
  ButtonText,
  View, 
  Text, 
  FormControl, 
  FormControlLabel, 
  FormControlLabelText, 
  Input,
  InputField,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText
} from "@gluestack-ui/themed";

import { IconButton } from '@components/Buttons/IconButton';
import { Loading } from '@components/Loading/Loading';
import { ButtonIconImageLeft } from '@components/Buttons/ButtonIconImageLeft';

import { ArrowLeft, CircleAlert } from 'lucide-react-native';

import GoogleLogo from '@assets/Enterprises/Google/google-icon.svg';
import FacebookLogo from '@assets/Enterprises/Facebook/facebook-svgrepo.svg';

import { useAuth } from '@contexts/AuthContext';

import { NoAuthNavigationProp } from '@routes/noauth.routes';

import { WEB_CLIENT_ID, IOS_CLIENT_ID } from "@env";

if (Constants.appOwnership !== 'expo' && GoogleSignin) {
  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    profileImageSize: 150
  });
}

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const { login } = useAuth();
  const navigation = useNavigation<NoAuthNavigationProp>();
  const fontsLoaded = useFonts({ LibreBodoni_700Bold });

  const handleSubmit = () => {
    if (password.length < 8) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      login;
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);

      // Verifica se está rodando no Expo Go
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

      if(result){
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
      }else{
        Alert.alert("Login com Google", "Não foi possível conectar-se a sua conta Google!");
        setIsAuthenticating(false);
      }
    }catch(error){
      console.error('Erro no Google Sign-in:', error);
      setIsAuthenticating(false);
      Alert.alert("Login com Google", "Não foi possível conectar-se a sua conta Google!");
    }
  }

  if(fontsLoaded){
    return (
      <View flex={1}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <LinearGradient
          colors={['rgba(1, 0, 66, 1)', 'rgba(0, 0, 179, 1)', 'rgba(0, 212, 255, 1)']}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            <SafeAreaView>
              <View flexDirection='row' alignItems='center' justifyContent='space-between' p={15}>
                <IconButton buttonBgColor='transparent' icon={ ArrowLeft } iconColor='white' iconSize='xl' buttonFunctionality={ () => navigation.goBack() }/>
                <View flexDirection='row' alignItems='center'>
                  <Text color='$white' mr={10} size='sm'>Novo por aqui?</Text>
                  <Button bgColor='#8a8a9d72' size='sm' onPress={ () => navigation.navigate('SignUp') }>
                    <ButtonText>Criar Conta</ButtonText>
                  </Button>
                </View>
              </View>
            </SafeAreaView>
            <Text textAlign='center' color='$white' fontFamily='LibreBodoni_700Bold' fontSize="$4xl" my={40}>EZ TRIP AI</Text>
            <View 
              bgColor='#ffffffa7' 
              w="90%" 
              h={14}
              alignSelf='center'
              borderTopLeftRadius={20} 
              borderTopRightRadius={20}
              mb={-3}
              zIndex={2}
            />
            <View 
              bgColor='$white' 
              borderTopLeftRadius={20} 
              borderTopRightRadius={20} 
              flex={1}
              flexDirection='column' 
              justifyContent='center'
              alignItems='center'
              p={20}
              zIndex={1}
            >
              <Text fontSize="$2xl" fontWeight="$bold" color='$black' my={15}>Bem-Vindo de Volta!</Text>
              <Text fontSize="$lg" color='$black' mb={20}>Insira suas credenciais para continuar</Text>
              <FormControl
                isInvalid={isInvalid}
                size="lg"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
                w="85%"
              >
                <FormControlLabel>
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Input my={1}>
                  <InputField
                    type="text"
                    placeholder="Email"
                    value={ email }
                    onChangeText={ (mail) => setEmail(mail) }
                  />
                </Input>
                <FormControlHelper>
                </FormControlHelper>
                <FormControlError>
                  <FormControlErrorIcon as={ CircleAlert } />
                  <FormControlErrorText>
                    Insira um email válido
                  </FormControlErrorText>
                </FormControlError>
                <FormControlLabel>
                  <FormControlLabelText mt={10}>Senha</FormControlLabelText>
                </FormControlLabel>
                <Input my={1}>
                  <InputField
                    type="password"
                    placeholder="Senha"
                    value={ password }
                    onChangeText={ (pass) => setPassword(pass) }
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText>
                    Mínimo 8 caracteres
                  </FormControlHelperText>
                </FormControlHelper>
                <FormControlError>
                  <FormControlErrorIcon as={ CircleAlert } />
                  <FormControlErrorText>
                    Mínimo 8 caracteres!
                  </FormControlErrorText>
                </FormControlError>
                <View alignItems='center' mt={30} mb={15}>
                  <Button 
                    bgColor="#336df6" 
                    w="100%" 
                    borderRadius={25} 
                    size="xl" 
                    onPress={ handleSubmit }
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 4,
                    }}
                  >
                    <ButtonText color="#FFF">Continuar</ButtonText>
                  </Button>
                </View>
              </FormControl>
              <Button
                bgColor="transparent"
                size="lg"
                onPress={ login }
              >
                <ButtonText fontWeight="$medium" color="#000">Esqueceu sua senha?</ButtonText>
              </Button>
              <View flexDirection='row' justifyContent='space-evenly' mt={15} mb={25} alignItems='center'>
                <View borderBottomWidth={.7} borderColor='$gray' w="22.5%"></View>
                <Text mx={10}>Faça login com</Text>
                <View borderBottomWidth={.7} borderColor='$gray' w="22.5%"></View>
              </View>
              <View flexDirection='row' justifyContent='center'>
                <ButtonIconImageLeft 
                  icon={ GoogleLogo }
                  iconWidth={30}
                  iconHeight={30}
                  textContent='Google'
                  buttonSize='xl'
                  action={ handleGoogleSignIn }
                  isLoading={ isAuthenticating }
                  iconStyles={{
                    marginRight: 15,
                    marginLeft: 17
                  }}
                  styles={{ 
                    borderWidth: .6,
                    borderRadius: 10,
                    width: '45%',
                    marginRight: 10
                  }}
                />
                <ButtonIconImageLeft 
                  icon={ FacebookLogo }
                  iconWidth={50}
                  iconHeight={50}
                  textContent='Facebook'
                  buttonSize='xl'
                  action={ login } 
                  styles={{ 
                    borderWidth: .6,
                    borderRadius: 10,
                    width: '45%'
                  }}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }else{
    return (
      <View flex={1}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <LinearGradient
          colors={['rgba(1, 0, 66, 1)', 'rgba(0, 0, 179, 1)', 'rgba(0, 212, 255, 1)']}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        >
          <SafeAreaView>
            <Loading />
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}