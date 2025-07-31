import { SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";

import { View, Text, Button, ButtonText } from "@gluestack-ui/themed";

import FelipeMascotGoodbye from '@assets/Mascot/Felipe_Mascot_Goodbye.svg';

import { AuthNavigationProp } from "@routes/auth.routes";

export function CancelPremiumPlan(){
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
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View  flexDirection="column" justifyContent="center" alignItems="center" alignContent="center">
          <View flexDirection="column" justifyContent="center" alignItems="center" mb="1%">
            <FelipeMascotGoodbye height={450} width={450}/>
            <Text fontSize="$3xl" fontWeight="$bold" color="$white" mb={5}>Você tem certeza?</Text>
            <Text fontSize="$xl" fontWeight="$semibold" color="$white" textAlign="center">Felipe está muito triste em ver você indo embora!</Text>
          </View>
          <View mt={15} maxWidth="95%">
            <Text fontSize="$lg" color="$white" textAlign="center" mb={15}>Ao cancelar seu plano Premium, você perderá acesso a todos os benefícios exclusivos. Tem certeza que deseja continuar?</Text>
          </View>
        </View>
        <View position="absolute" bottom={35} left={0} right={0} px={30} flexDirection="column" gap={10}>
          <View>
            <LinearGradient
              colors={['#6B7280', '#4B5563', '#374151']}
              style={{
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 10,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Button 
                bgColor="transparent"
                borderRadius={30}
                px="$4"
                h={50}
                justifyContent="center"
                alignItems="center"
                onPress={ () => { navigation.goBack(); } }
              >
                <ButtonText 
                  color="#FFFFFF" 
                  fontWeight="$bold" 
                  fontSize="$md"
                  textAlign="center"
                >
                  Manter Premium
                </ButtonText>
              </Button>
            </LinearGradient>
          </View>
          <View flex={1}>
            <LinearGradient
              colors={['#FF6347', '#FF4500', '#DC2626']}
              style={{
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 12,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Button 
                bgColor="transparent"
                borderRadius={30}
                px="$4"
                h={50}
                justifyContent="center"
                alignItems="center"
                onPress={ () => { navigation.navigate("Home"); } }
              >
                <ButtonText 
                  color="#FFFFFF" 
                  fontWeight="$bold" 
                  fontSize="$md"
                  textAlign="center"
                >
                  Cancelar Plano
                </ButtonText>
              </Button>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}