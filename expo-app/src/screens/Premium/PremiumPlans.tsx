import { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, RadioGroup, Radio, RadioIndicator, RadioLabel, CircleIcon, RadioIcon, Button, ScrollView, ButtonText } from "@gluestack-ui/themed";

import { Check, CircleCheckBig } from "lucide-react-native";

import { AuthNavigationProp } from "@routes/auth.routes";

type SelectedPlanTypes = {
  selectedPlan?: "Premium" | "Deluxe",
  selectedPeriod?: "Monthly" | "Yearly"
}

const benefits = {
  premium: [
    "5 roteiros personalizados mensais",
    "20 créditos extras de chat com Felipe",
    "Customização completa dos roteiros",
    "Histórico de 10 conversas salvas",
    "Eventos locais em tempo real",
    "Conversas por voz (limitadas)",
    "Geração de roteiros mais rápida",
    "Recomendações baseadas em suas preferências"
  ],
  deluxe: [
    "Conversas ilimitadas por voz com Felipe",
    "Roteiros ilimitados sempre que precisar",
    "Créditos ilimitados de conversas",
    "IA avançada (clima, orçamento, preferências)",
    "Roteiros exclusivos para destinos globais",
    "Suporte prioritário 24/7",
    "Customização total e avançada",
    "Histórico ilimitado de conversas",
    "Eventos e experiências VIP",
    "Acesso antecipado a novos recursos",
    "Modo offline para roteiros salvos",
    "Badge exclusivo de membro Deluxe"
  ]
};

export function PremiumPlans(){
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanTypes>({ selectedPlan: "Premium" });
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPlanTypes>({ selectedPeriod: "Monthly" })

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
            <View flexDirection="row">
              <RadioGroup flexDirection="row" gap={15} mt={15} value={ selectedPeriod.selectedPeriod } onChange={ (value) => setSelectedPeriod({ selectedPeriod: value as "Monthly" | "Yearly" }) }>
                <Radio value="Monthly" size="lg" isInvalid={ false } isDisabled={ false }>
                  <RadioIndicator borderColor="$white" $checked={{ borderColor: "$white" }}>
                    <RadioIcon as={ CircleIcon } color="$white" />
                  </RadioIndicator>
                  <RadioLabel color="$white" ml={5}>Mensal</RadioLabel>
                </Radio>
                <Radio value="Yearly" size="lg" isInvalid={ false } isDisabled={ false }>
                  <RadioIndicator borderColor="$white" $checked={{ borderColor: "$white" }}>
                    <RadioIcon as={ CircleIcon } color="$white" />
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
              bg={ selectedPlan.selectedPlan === "Premium" ? "$white" : "transparent" }
              borderWidth={ selectedPlan.selectedPlan === "Premium" ? 0 : 3 }
              borderColor={ selectedPlan.selectedPlan === "Premium" ? "transparent" : "$white" }
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
              onPress={ () => setSelectedPlan({ selectedPlan: "Premium" }) }
            >
              <Text fontSize="$xl" fontWeight="$bold" color={ selectedPlan.selectedPlan === "Premium" ? '$warmGray600' : '$white' }>Premium</Text>
              <Text fontSize="$3xl" fontWeight="$bold"  color={ selectedPlan.selectedPlan === "Premium" ? '$black' : '$white' } mt={10}>{ selectedPeriod.selectedPeriod === "Monthly" ? "$6.99" : "$60" }</Text>
              <View bgColor="#fae050" borderRadius={20} mt={5} alignSelf="center" w="100%">
                <Text textAlign="center" color={ selectedPlan.selectedPlan === "Premium" ? '$warmGray600' : '$black' }>{ selectedPeriod.selectedPeriod === "Monthly" ? "Salve 40%" : "Salve 60%" }</Text>
              </View>
              {
                selectedPlan.selectedPlan === "Premium"
                  ?
                  <View mt={15} flexDirection="row" justifyContent="space-between" w="100%">
                    <Text>{ selectedPeriod.selectedPeriod === "Monthly" ? "Mensal" : "Anual" }</Text>
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
              p={ selectedPlan.selectedPlan === "Deluxe" ? "$2" : "$5" }
              bg={ selectedPlan.selectedPlan === "Deluxe" ? "$white" : "transparent" }
              borderWidth={ selectedPlan.selectedPlan === "Deluxe" ? 0 : 3 }
              borderColor={ selectedPlan.selectedPlan === "Deluxe" ? "transparent" : "$white" }
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
              onPress={ () => setSelectedPlan({ selectedPlan: "Deluxe" }) }
            >
              <Text fontSize="$xl" fontWeight="$bold" color={ selectedPlan.selectedPlan === "Deluxe" ? '$warmGray600' : '$white' }>Premium Deluxe</Text>
              <Text fontSize="$3xl" fontWeight="$bold" color={ selectedPlan.selectedPlan === "Deluxe" ? '$black' : '$white' } mt={10}>{ selectedPeriod.selectedPeriod === "Monthly" ? "$9.99" : "$100" }</Text>
              <View bgColor="#fae050" borderRadius={20} mt={5} w="100%">
                <Text textAlign="center" color={ selectedPlan.selectedPlan === "Deluxe" ? '$warmGray600' : '$black' }>{ selectedPeriod.selectedPeriod === "Monthly" ? "Salve 67%" : "Salve 86%" }</Text>
              </View>
              {
                selectedPlan.selectedPlan === "Deluxe"
                  ?
                  <View mt={10} flexDirection="row" justifyContent="space-between" w="100%">
                    <Text>{ selectedPeriod.selectedPeriod === "Monthly" ? "Mensal" : "Anual" }</Text>
                    <CircleCheckBig color="darkgreen" />
                  </View>
                  :
                  ''
              }
            </Button>
          </View>
          { 
            selectedPlan.selectedPlan === "Premium"
            ?
              <View px={15} mt={25} w="100%" alignSelf="center">
                <Text 
                  fontSize="$xl" 
                  color="$white" 
                  fontWeight="$bold" 
                  textAlign="center" 
                  mb={20}
                >
                  O que você ganha com o Premium
                </Text>
                { 
                  benefits.premium.map((data, index) => (
                    <View 
                      key={ index } 
                      flexDirection="row" 
                      mb={15} 
                      alignItems="center"
                      bg="rgba(255,255,255,0.1)"
                      borderRadius={15}
                      p={16}
                      mx={5}
                      minHeight={65}
                    >
                      <View 
                        bg="rgba(255,215,0,0.3)" 
                        borderRadius={20} 
                        p={8} 
                        mr={15}
                      >
                        <Check color="#FFD700" size={22} />
                      </View>
                      <Text 
                        fontSize="$lg" 
                        color="$white" 
                        flex={1}
                        fontWeight="$medium"
                        lineHeight="$lg"
                      >
                        { data }
                      </Text>
                    </View>
                  ))
                }
              </View>
            : 
              <View px={15} mt={25} w="100%" alignSelf="center">
                <Text 
                  fontSize="$xl" 
                  color="$white" 
                  fontWeight="$bold" 
                  textAlign="center" 
                  mb={20}
                >
                  O que você ganha com o Premium Deluxe
                </Text>
                {
                  benefits.deluxe.map((data, index) => (
                    <View 
                      key={ index } 
                      flexDirection="row" 
                      mb={15} 
                      alignItems="center"
                      bg="rgba(255,255,255,0.15)"
                      borderRadius={15}
                      p={16}
                      mx={5}
                      borderWidth={1}
                      borderColor="rgba(255,215,0,0.3)"
                      minHeight={65}
                    >
                      <View 
                        bg="rgba(255,215,0,0.3)" 
                        borderRadius={20} 
                        p={8} 
                        mr={15}
                      >
                        <Check color="#FFD700" size={22} />
                      </View>
                      <Text 
                        fontSize="$lg" 
                        color="$white" 
                        flex={1}
                        fontWeight="$medium"
                        lineHeight="$lg"
                      >
                        { data }
                      </Text>
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
                onPress={ () => { navigation.navigate("WelcomePremium"); } }
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