import { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

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
                  action={ login }
                  iconStyles={{
                    marginRight: 15
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