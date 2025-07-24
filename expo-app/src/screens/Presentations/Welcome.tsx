import { Linking, StatusBar, SafeAreaView } from "react-native";

import { View, Text, Button, ButtonText } from "@gluestack-ui/themed";

import WelcomeIllustration from '@assets/Illustrations/Welcome/Welcome.svg';
import { useAuth } from "@contexts/AuthContext";

export function Welcome(){
  const { login } = useAuth();

  return(
    <View flex={1} bgColor="#336df6">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View mx={10} alignItems="center" flex={1}>
          <View mt={45}></View>
          <Text fontSize="$3xl" color="$white" fontWeight="$bold" textAlign="center" mb={20}>Seja Bem-Vindo(a)!</Text>
          <Text fontSize="$lg" color="$white" textAlign="center">Explore o mundo com a gente! Descubra destinos incríveis e viva experiências únicas. Sua jornada começa aqui.</Text>
          <WelcomeIllustration width={400} height={400} style={{ marginVertical: 15 }} />
        </View>
        <View alignItems="center" mb={35}>
          <View>
            <Button
              bgColor="#FFF"
              w="75%"
              borderRadius={25}
              size="xl"
              mb={10}
              onPress={ login }
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
              <ButtonText color="#336df6" textAlign="center" style={{ width: "100%", textAlign: "center" }}>Começar a Jornada!</ButtonText>
            </Button>
          </View>
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