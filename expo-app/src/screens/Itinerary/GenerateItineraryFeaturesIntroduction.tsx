import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, ButtonGroup, Button, ButtonText, ButtonSpinner, ButtonIcon } from "@gluestack-ui/themed";

import FelipeMascot from '@assets/Mascot/Felipe_Mascot_Itinerary_Features.svg';

import { AuthNavigationProp } from '@routes/auth.routes';
import { X } from 'lucide-react-native';

export function GenerateItineraryFeaturesIntroduction() {
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
        <Button
          position='absolute'
          top={-65}
          right={10}
          zIndex={10}
          p={5}
          bgColor='transparent'
          onPress={() => navigation.goBack()}
        >
          <ButtonIcon as={X} color="$white" size="xl" />
        </Button>
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
          <Text color='$yellow' fontSize="$2xl" fontWeight="$semibold" textAlign='center' mt={5}>Itinerários Personalizados!</Text>
          <Text color='$white' fontSize="$xl" fontWeight="$semibold" textAlign='center' mt={5}>Toda viagem precisa de organização</Text>
          <Text color='$white' fontSize="$lg" textAlign='center' mt={20} px={5}>Atualizamos a forma com que geramos o roteiro de suas viagens para garantir o melhor resultado possível para você.</Text>
          <Text color='$white' fontSize="$lg" textAlign='center' mt={20}>Vamos começar?</Text>
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
              <ButtonText mr={10} fontSize="$xl">Planejar minha viagem</ButtonText>
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