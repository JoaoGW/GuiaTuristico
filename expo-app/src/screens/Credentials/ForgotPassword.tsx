import { useState, useMemo } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Image } from '@gluestack-ui/themed';

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

import { ArrowLeft, CircleAlert, Mail } from 'lucide-react-native';

import { sendPasswordReset } from '@services/login/passwordReset';
import { validateEmail } from '@utils/validators';

import { NoAuthNavigationProp } from '@routes/noauth.routes';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

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

  const handleSubmit = async () => {
    setEmailError('');

    // Valida email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    setIsSending(true);
    const success = await sendPasswordReset(email);
    setIsSending(false);

    if (success) {
      // Volta para tela de login após envio
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  };

  if (fontsLoaded) {
    return (
      <View flex={1}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Image
          source={backgroundImage}
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
                icon={ArrowLeft} 
                iconColor='white' 
                iconSize='xl' 
                buttonFunctionality={() => navigation.goBack()} 
              />
              <View flexDirection='row' alignItems='center'>
                <Text color='$white' mr={10} size='sm'>Lembrou a senha?</Text>
                <Button bgColor='#8a8a9d72' size='sm' onPress={() => navigation.navigate('Login')}>
                  <ButtonText>Entrar</ButtonText>
                </Button>
              </View>
            </View>
          </SafeAreaView>
          <Text textAlign='center' color='$white' fontFamily='LibreBodoni_700Bold' fontSize="$4xl" my={40}>
            EZ TRIP AI
          </Text>
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
            p={20}
            zIndex={1}
          >
            <View alignItems='center' mb={20}>
              <Mail size={60} color="#336df6" />
            </View>
            <Text fontSize="$2xl" fontWeight="$bold" color='$black' my={15}>
              Esqueceu sua Senha?
            </Text>
            <Text fontSize="$md" color='$gray600' mb={20} textAlign='center' px={20}>
              Não se preocupe! Digite seu email abaixo e enviaremos instruções para redefinir sua senha.
            </Text>
            <FormControl
              isInvalid={!!emailError}
              size="lg"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
              w="85%"
            >
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input my={1} borderColor={emailError ? '$error500' : '#8a8a8a'}>
                <InputField
                  type="text"
                  placeholder="Seu email cadastrado"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  {emailError ? '' : 'Enviaremos um link para este email'}
                </FormControlHelperText>
              </FormControlHelper>
              {emailError ? (
                <FormControlError>
                  <FormControlErrorIcon as={CircleAlert} />
                  <FormControlErrorText>
                    {emailError}
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
                  disabled={isSending}
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
                  <ButtonText color="#FFF">
                    {isSending ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </ButtonText>
                </Button>
              </View>
            </FormControl>
            <Text fontSize="$sm" color='$gray600' mt={30} textAlign='center' px={30}>
              Lembre-se de verificar sua caixa de spam se não encontrar o email.
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
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
