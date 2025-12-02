import { useState, useMemo } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

import { Image } from '@gluestack-ui/themed';

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

import { handleGoogleSignIn } from '@services/login/googleLogin';
import { signUpUser } from '@services/login/emailSignup';
import { validateName, validateEmail, validatePassword } from '@utils/validators';

import { NoAuthNavigationProp } from '@routes/noauth.routes';

export function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const navigation = useNavigation<NoAuthNavigationProp>();
  const fontsLoaded = useFonts({ LibreBodoni_700Bold });

  // Fixa o background na primeira renderização para não mudar durante digitação
  const backgroundImage = useMemo(() => {
    const possibleBackgrounds = [
      require("@assets/CredentialsBackgrounds/gaztelugatxe-4377342_640.png"),
      require("@assets/CredentialsBackgrounds/italy-2725346_640.png"),
      require("@assets/CredentialsBackgrounds/waterfall-6574302_640.jpg"),
      require("@assets/CredentialsBackgrounds/river-7447346_640.png")
    ];
    const randomIndex = Math.floor(Math.random() * possibleBackgrounds.length);
    return possibleBackgrounds[randomIndex];
  }, []);

  const handleSubmit = () => {
    // Limpa erros anteriores
    setNameError('');
    setEmailError('');
    setPasswordError('');

    // Valida cada campo
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    let hasError = false;

    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || '');
      hasError = true;
    }

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      hasError = true;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      hasError = true;
    }

    // Se houver erros, não prossegue
    if (hasError) {
      return;
    }

    // Prossegue com o cadastro
    setIsAuthenticating(true);
    signUpUser(name, email, password, navigation, setIsAuthenticating);
  }

  if(fontsLoaded){
    return (
      <View flex={1}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Image
          source={ backgroundImage }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
          }} 
          alt=''
        />
        <View style={{ flex: 1 }}>
          <SafeAreaView>
            <View flexDirection='row' alignItems='center' justifyContent='space-between' p={15}>
              <IconButton 
                buttonBgColor='transparent' 
                icon={ ArrowLeft } 
                iconColor='white' 
                iconSize='xl' 
                buttonFunctionality={() => navigation.goBack()}
                styles={{ marginLeft: -10 }}
              />
              <View flexDirection='row' alignItems='center'>
                <Text color='$white' mr={10} size='sm' fontWeight="$semibold">Já possui uma conta?</Text>
                <Button bgColor='#8a8a9db1' size='sm' onPress={ () => navigation.navigate('Login') }>
                  <ButtonText>Entrar</ButtonText>
                </Button>
              </View>
            </View>
          </SafeAreaView>
          <Text textAlign='center' color='$white' fontFamily='LibreBodoni_700Bold' fontSize="$4xl" my={20}>EZ TRIP AI</Text>
          <View
            bgColor='#ffffffae'
            w="90%"
            h={14}
            alignSelf='center'
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            zIndex={2}
          />
          <View
            bgColor='#ffffffd5'
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            flex={1}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            pt={50}
            pb={30}
            px={20}
            zIndex={1}
          >
            <Text fontSize="$2xl" fontWeight="$bold" color='$black' my={15}>Comece Gratuitamente!</Text>
            <FormControl
              isInvalid={!!nameError || !!emailError || !!passwordError}
              size="lg"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
              w="85%"
            >
              <FormControlLabel>
                <FormControlLabelText>Nome</FormControlLabelText>
              </FormControlLabel>
              <Input my={1} borderColor={nameError ? '$error500' : '#8a8a8a'}>
                <InputField
                  type="text"
                  placeholder="Insira Seu Nome"
                  value={ name }
                  onChangeText={ (text) => {
                    setName(text);
                    if (nameError) setNameError('');
                  }}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  { nameError ? '' : 'Digite seu nome completo' }
                </FormControlHelperText>
              </FormControlHelper>
              {nameError ? (
                <FormControlError>
                  <FormControlErrorIcon as={ CircleAlert } />
                  <FormControlErrorText>
                    { nameError }
                  </FormControlErrorText>
                </FormControlError>
              ) : null}
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input my={1} borderColor={emailError ? '$error500' : '#8a8a8a'}>
                <InputField
                  type="text"
                  placeholder="Insira seu melhor Email"
                  value={ email }
                  onChangeText={ (text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  { emailError ? '' : 'Usaremos para recuperação de senha' }
                </FormControlHelperText>
              </FormControlHelper>
              {emailError ? (
                <FormControlError>
                  <FormControlErrorIcon as={CircleAlert} />
                  <FormControlErrorText>
                    { emailError }
                  </FormControlErrorText>
                </FormControlError>
              ) : null}
              <FormControlLabel>
                <FormControlLabelText mt={10}>Senha</FormControlLabelText>
              </FormControlLabel>
              <Input my={1} borderColor={passwordError ? '$error500' : '#8a8a8a'}>
                <InputField
                  type="password"
                  placeholder="Memorize sua Senha"
                  value={ password }
                  onChangeText={ (text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  autoCapitalize="none"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  { passwordError ? '' : 'Mínimo 8 caracteres com letras e números' }
                </FormControlHelperText>
              </FormControlHelper>
              {passwordError ? (
                <FormControlError>
                  <FormControlErrorIcon as={CircleAlert} />
                  <FormControlErrorText>
                    { passwordError }
                  </FormControlErrorText>
                </FormControlError>
              ) : null}
              <View alignItems='center' mt={30} mb={15}>
                <Button
                  bgColor="#336df6"
                  w="100%"
                  borderRadius={25}
                  size="xl"
                  onPress={handleSubmit}
                  disabled={ isAuthenticating ? true : false }
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
                  <ButtonText color="#FFF">Fazer Cadastro</ButtonText>
                </Button>
              </View>
            </FormControl>
            <View flexDirection='row' justifyContent='space-evenly' mt={15} mb={25} alignItems='center'>
              <View borderBottomWidth={.7} borderColor='$gray' w="22.5%"></View>
              <Text mx={10}>Faça login com</Text>
              <View borderBottomWidth={.7} borderColor='$gray' w="22.5%"></View>
            </View>
            <View width="100%" alignItems="center" mt={10}>
              <ButtonIconImageLeft
                icon={GoogleLogo}
                iconWidth={30}
                iconHeight={30}
                textContent='Google'
                buttonSize='xl'
                action={ () => handleGoogleSignIn(setIsAuthenticating, navigation) }
                iconStyles={{
                  marginRight: 15
                }}
                styles={{
                  borderWidth: .6,
                  borderRadius: 10,
                  width: '80%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  borderColor: "black",
                  marginBottom: 20
                }}
              />
            </View>
          </View>
        </View>
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