import { useState } from "react";
import { Linking, StatusBar, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { View, Text, Button, ButtonText } from "@gluestack-ui/themed";

import { NoAuthNavigationProp } from "@routes/noauth.routes";

import WelcomeGuideData from '@data/welcome.json';

import Search from '@assets/Illustrations/Welcome/Search.svg';
import Preferences from '@assets/Illustrations/Welcome/Preferences.svg';
import AI from '@assets/Illustrations/Welcome/Ai.svg';
import AIChat from '@assets/Illustrations/Welcome/AiChat.svg';
import Attractions from '@assets/Illustrations/Welcome/Attractions.svg';
import Navigation from '@assets/Illustrations/Welcome/Navigation.svg';
import Expenses from '@assets/Illustrations/Welcome/Expenses.svg';
import Weather from '@assets/Illustrations/Welcome/Weather.svg';
import Travel from '@assets/Illustrations/Welcome/Travel.svg';

const images: Record<string, React.FC<any>> = {
  "Search.svg": Search,
  "Preferences.svg": Preferences,
  "Ai.svg": AI,
  "AiChat.svg": AIChat,
  "Attractions.svg": Attractions,
  "Navigation.svg": Navigation,
  "Expenses.svg": Expenses,
  "Weather.svg": Weather,
  "Travel.svg": Travel
};

export function Welcome() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const navigation = useNavigation<NoAuthNavigationProp>();
  const currentPageData = WelcomeGuideData.find(page => page.page === currentPage);
  const CurrentImage = currentPageData?.image ? images[currentPageData.image] : null;

  return (
    <View flex={1} bgColor="#336df6">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View mx={10} alignItems="center" flex={1}>
          {
            currentPage != 9
              ?
                <Button bgColor="transparent" size="md" mb={40} alignSelf="flex-end" onPress={ () => navigation.navigate("Login") }>
                  <ButtonText color="#FFF">Pular  &gt;</ButtonText>
                </Button>
              :
                <View mt={45}></View>
          }
          <Text fontSize="$3xl" color="$white" fontWeight="$bold" textAlign="center" mb={20}>{ currentPageData?.title }</Text>
          <Text fontSize="$lg" color="$white" textAlign="center">{ currentPageData?.description }</Text>
          { CurrentImage && <CurrentImage width={350} height={350} style={{ marginVertical: 15 }} /> }
        </View>
        <View alignItems="center" mb={35}>
          {
            currentPage < 9 
              ?
                <Button 
                  bgColor="#FFF" 
                  w="75%" 
                  borderRadius={25} 
                  size="xl" 
                  onPress={ () => setCurrentPage(currentPage => currentPage + 1) }
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
                  <ButtonText color="#336df6">Continuar</ButtonText>
                </Button>
              :
                <View>
                    <Button 
                      bgColor="#FFF" 
                      w="75%" 
                      borderRadius={25} 
                      size="xl" 
                      mb={10} 
                      onPress={ () => navigation.navigate("Login") }
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
                      <ButtonText color="#336df6" textAlign="center" style={{ width: "100%", textAlign: "center" }}>Fazer Login</ButtonText>
                    </Button>
                    <Button 
                      bgColor="#FFF" 
                      w="75%" 
                      borderRadius={25} 
                      size="xl" 
                      onPress={ () => navigation.navigate("Login") }
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
                      <ButtonText color="#336df6" textAlign="center" style={{ width: "100%", textAlign: "center" }}>Cadastrar-se</ButtonText>
                    </Button>
                </View>
          }
        </View>
        <Text fontSize="$2xs" color="#FFF" textAlign="center">
          This application uses external resources.{' '}
          <Text color="black" fontSize="$2xs" onPress={() => Linking.openURL('https://storyset.com/web')}>
            Check them here.
          </Text>
        </Text>
      </SafeAreaView>
    </View>
  )
}