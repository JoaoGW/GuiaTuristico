import { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, RadioGroup, Radio, RadioIndicator, RadioLabel, CircleIcon, RadioIcon, Button, ButtonIcon, ScrollView, ButtonText } from "@gluestack-ui/themed";

import { Check, CircleCheckBig, X } from "lucide-react-native";

import { AuthNavigationProp } from "@routes/auth.routes";

type SelectedPlanTypes = {
  selected: "Premium" | "Deluxe"
}

const benefits = {
  premium: [
    "Gere mais 5 roteiros completos e personalizáveis por mês",
    "Mais 20 créditos de conversas com o Felipe por mês",
    "Customização total dos seus roteiros gerados",
    "Salve até 10 interações com o Felipe no Histórico",
    "Veja eventos próximos a você em tempo real",
    "Converse por voz com o Felipe"
  ],
  deluxe: [
    "Converse por voz com o Felipe",
    "Roteiros Ilimitados todo mês e quando precisar",
    "Créditos ilimitados de conversas com o Felipe",
    "Recomendações Avançadas com IA (clima real, orçamento e preferências detalhadas, entre outos)",
    "Tenha acesso a Roteiros Exclusivos para diversos destinos no mundo",
    "Suporte Prioritário",
    "Customização total dos seus roteiros gerados",
    "Salve quantas interações quiser com o Felipe no Histórico",
    "Veja eventos próximos a você em tempo real"
  ]
};

export function PremiumPlans(){
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanTypes>({ selected: "Premium" });

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
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <View flexDirection="column" mt={25} alignItems="center">
            <Text color="$white" fontSize="$2xl" fontWeight="$bold">Faça upgrade para o Premium</Text>
            <View>
              <RadioGroup flexDirection="row" gap={15} mt={15}>
                <Radio value="change" size="lg" isInvalid={ false } isDisabled={ false }>
                  <RadioIndicator>
                    <RadioIcon as={ CircleIcon } />
                  </RadioIndicator>
                  <RadioLabel color="$white" ml={5}>Mensal</RadioLabel>
                </Radio>
                <Radio value="change" size="lg" isInvalid={ false } isDisabled={ false }>
                  <RadioIndicator>
                    <RadioIcon as={ CircleIcon } />
                  </RadioIndicator>
                  <RadioLabel color="$white" ml={5}>Anual</RadioLabel>
                </Radio>
              </RadioGroup>
            </View>
          </View>
          <View flexDirection="row" width="100%" justifyContent="center">
            <Button
              flexDirection="column"
              alignItems="flex-start"
              mx="$3"
              mt="$8"
              p="$5"
              bg={ selectedPlan.selected === "Premium" ? "$white" : "transparent" }
              borderWidth={ selectedPlan.selected === "Premium" ? 0 : 3 }
              borderColor={ selectedPlan.selected === "Premium" ? "transparent" : "$white" }
              borderRadius="$xl"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.15}
              shadowRadius={20}
              elevation={10}
              w="42.5%"
              maxHeight={200}
              style={{
                aspectRatio: 1,
              }}
              onPress={ () => setSelectedPlan({ selected: "Premium" }) }
            >
              <Text fontSize="$xl" fontWeight="$bold" color={ selectedPlan.selected === "Premium" ? '$warmGray600' : '$white' }>Premium</Text>
              <Text fontSize="$3xl" fontWeight="$bold"  color={ selectedPlan.selected === "Premium" ? '$black' : '$white' } mt={10}>$9.99</Text>
              <View bgColor="#fae050" borderRadius={20} mt={5} alignSelf="center" w="100%">
                <Text textAlign="center" color={ selectedPlan.selected === "Premium" ? '$warmGray600' : '$black' }>Salve 34%</Text>
              </View>
              {
                selectedPlan.selected === "Premium"
                  ?
                  <View mt={15} flexDirection="row" justifyContent="space-between" w="100%">
                    <Text>Mensal</Text>
                    <CircleCheckBig color="darkgreen" />
                  </View>
                  :
                  ''
              }
            </Button>
            <Button
              flexDirection="column"
              alignItems="flex-start"
              mx="$3"
              mt="$8"
              p={ selectedPlan.selected === "Deluxe" ? "$2" : "$5" }
              bg={ selectedPlan.selected === "Deluxe" ? "$white" : "transparent" }
              borderWidth={ selectedPlan.selected === "Deluxe" ? 0 : 3 }
              borderColor={ selectedPlan.selected === "Deluxe" ? "transparent" : "$white" }
              borderRadius="$xl"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.15}
              shadowRadius={20}
              elevation={10}
              w="42.5%"
              maxHeight={200}
              style={{
                aspectRatio: 1,
              }}
              onPress={ () => setSelectedPlan({ selected: "Deluxe" }) }
            >
              <Text fontSize="$xl" fontWeight="$bold" color={ selectedPlan.selected === "Deluxe" ? '$warmGray600' : '$white' }>Premium Deluxe</Text>
              <Text fontSize="$3xl" fontWeight="$bold" color={ selectedPlan.selected === "Deluxe" ? '$black' : '$white' } mt={10}>$14.99</Text>
              <View bgColor="#fae050" borderRadius={20} mt={5} w="100%">
                <Text textAlign="center" color={ selectedPlan.selected === "Deluxe" ? '$warmGray600' : '$black' }>Salve 67%</Text>
              </View>
              {
                selectedPlan.selected === "Deluxe"
                  ?
                  <View mt={10} flexDirection="row" justifyContent="space-between" w="100%">
                    <Text>Mensal</Text>
                    <CircleCheckBig color="darkgreen" />
                  </View>
                  :
                  ''
              }
            </Button>
          </View>
          { 
            selectedPlan.selected === "Premium"
            ?
              <View px={20} mt={25} w="90%">
                { 
                  benefits.premium.map((data, index) => (
                    <View key={ index } flexDirection="row" mb={15} alignItems="center">
                      <Check color="white" size={40} />
                      <Text fontSize="$lg" color="$white" ml={8}>{ data }</Text>
                    </View>
                  ))
                }
              </View>
            : 
              <View px={20} mt={25} w="90%">
                {
                  benefits.deluxe.map((data, index) => (
                    <View key={ index } flexDirection="row" mb={15} alignItems="center">
                      <Check color="white" size={40} />
                      <Text fontSize="$lg" color="$white" ml={8}>{ data }</Text>
                    </View>
                  ))
                }
              </View>
          }
          <View alignSelf="center" w="70%" mt={25} mb={20}>
            <LinearGradient
              colors={['#FFD700', '#FFC107', '#ffea00']}
              style={{
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 25,
                elevation: 15,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Button 
                bgColor="transparent"
                borderRadius={30}
                py="$5"
                px="$6"
                h={60}
                justifyContent="center"
                alignItems="center"
              >
                <ButtonText 
                  color="#000000" 
                  fontWeight="$bold" 
                  fontSize="$lg"
                  textAlign="center"
                >
                  Eleve suas viagens
                </ButtonText>
              </Button>
            </LinearGradient>
          </View>
          <View alignSelf="center" w="60%" mb={20}>
            <Button
              bgColor="transparent"
              borderRadius={30}
              borderWidth={2}
              borderColor="#FFC107"
              py="$2"
              px="$6"
              h={40}
              justifyContent="center"
              alignItems="center"
              onPress={ () => navigation.goBack() }
            >
              <ButtonText
                color="#FFF"
                fontWeight="$bold"
                fontSize="$lg"
                textAlign="center"
              >
                Não, obrigado!
              </ButtonText>
            </Button>
          </View>
        </SafeAreaView> 
      </ScrollView>
    </LinearGradient>
  )
}