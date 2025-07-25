import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, ButtonGroup, Button, ButtonText, ButtonSpinner } from "@gluestack-ui/themed";

import FelipeMascot from '@assets/Mascot/Felipe_Mascot_Hello.svg';

import { AuthNavigationProp } from '@routes/auth.routes';

export function AIMascotIntroduction() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigation = useNavigation<AuthNavigationProp>();

  useEffect(() => {
    const loadingBotContentDelay = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsLoading(false);
    }

    loadingBotContentDelay();
  }, []);

  return (
    <LinearGradient
      colors={['#2563eb', '#1e3a8a']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView>
        <StatusBar barStyle="light-content" />
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            position: 'absolute',
            width: 250,
            height: 250,
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
            borderRadius: 100,
            shadowColor: '#2563eb',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 20,
            elevation: 10,
          }} />
          <FelipeMascot width={330} height={330} style={{ marginBottom: 20 }} />
        </View>
        <View flexDirection='column' justifyContent='center' alignItems='center'>
          <Text color='$white' fontSize="$3xl" fontWeight="$bold">Conheça <Text color='$yellow' fontSize="$3xl" fontWeight="$bold">Felipe</Text>!</Text>
          <Text color='$white' fontSize="$2xl" fontWeight="$semibold" textAlign='center' mt={5}>Seu novo Assistente Turístico</Text>
          <Text color='$white' fontSize="$lg" textAlign='center' mt={20}>Faça perguntas e peça sugestões para ele sempre que precisar.</Text>
        </View>
        <ButtonGroup justifyContent='center' alignItems='center' mt={35}>
          <LinearGradient
            colors={['#E9AD2D', '#f2d16e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: '80%',
              borderRadius: 20,
              shadowColor: '#f2da95',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Button w="100%" borderRadius={20} bgColor="transparent" size='lg' isDisabled={ isLoading } onPress={ () => navigation.navigate("AIChatMenu") } $pressed={{ opacity: 0.8, transform: [{ scale: 0.98 }] }}>
              <ButtonText mr={10} fontSize="$xl">Conhecer</ButtonText>
              {
                isLoading ? <ButtonSpinner /> : ''
              }
            </Button>
          </LinearGradient>
        </ButtonGroup>
      </SafeAreaView>
    </LinearGradient>
  );
}