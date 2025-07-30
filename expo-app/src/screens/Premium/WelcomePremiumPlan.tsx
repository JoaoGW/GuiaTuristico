import { SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";

import { View, Text, Button, ButtonText } from "@gluestack-ui/themed";

import FelipeWelcomePremium from '@assets/Mascot/Felipe_Mascot_WelcomePremium.svg'

import { AuthNavigationProp } from "@routes/auth.routes";

export function WelcomePremiumPlan(){
  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <LinearGradient
      colors={['#0b3762', '#0077E6', '#1A91FF']}
      style={{
        flex: 1,
        width: '100%',
        height: '100%'
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView>
        <StatusBar barStyle="light-content" />
        <View flexDirection="column" justifyContent="center" alignItems="center" alignContent="center">
          <View flexDirection="column" justifyContent="center" alignItems="center" mb="1%">
            <FelipeWelcomePremium height={450} width={450}/>
            <Text fontSize="$3xl" fontWeight="$bold" color="$white" mb={5}>Obrigado por assinar!</Text>
            <Text fontSize="$xl" fontWeight="$semibold" color="$white">Você agora é um Membro Premium!</Text>
          </View>
          <View mt={25} maxWidth="85%">
            <Text fontSize="$lg" color="$white" textAlign="center" mb={15}>Você já pode aproveitar todos os seus novos benefícios. Experiencie um novo modo de viajar a partir de agora.</Text>
            <LinearGradient
              colors={['#FFD700', '#FFC107', '#ffea00']}
              style={{
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 25,
                elevation: 15,
                position: "relative",
                bottom: -70,
                left: 0,
                right: 0
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Button 
                bgColor="transparent"
                borderRadius={30}
                px="$6"
                h={40}
                justifyContent="center"
                alignItems="center"
                onPress={ () => { navigation.navigate("WelcomePremium"); } }
              >
                <ButtonText 
                  color="#000000" 
                  fontWeight="$bold" 
                  fontSize="$lg"
                  textAlign="center"
                >
                  Começar!
                </ButtonText>
              </Button>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}