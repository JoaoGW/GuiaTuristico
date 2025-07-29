import { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, RadioGroup, Radio, RadioIndicator, RadioLabel, CircleIcon, RadioIcon, Button, ButtonIcon } from "@gluestack-ui/themed";

import { CircleCheckBig, X } from "lucide-react-native";

import { AuthNavigationProp } from "@routes/auth.routes";

type SelectedPlanTypes = {
  selected: "Premium" | "Deluxe"
}

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
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 16, paddingRight: 8 }}>
          <Button bgColor="transparent" onPress={ () => navigation.goBack() }>
            <ButtonIcon as={ X } size="xl" />
          </Button>
        </View>
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
          <View
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
          >
            <Text fontSize="$xl" fontWeight="$bold" color={ selectedPlan.selected === "Premium" ? '$warmGray600' : '$white' }>Premium</Text>
            <Text fontSize="$3xl" fontWeight="$bold"  color={ selectedPlan.selected === "Premium" ? '$black' : '$white' } mt={10}>$9.99</Text>
            <View bgColor="#fae050" borderRadius={20} mt={5}>
              <Text textAlign="center" color={ selectedPlan.selected === "Premium" ? '$warmGray600' : '$black' }>Salve 34%</Text>
            </View>
            {
              selectedPlan.selected === "Premium"
                ?
                <View mt={15} flexDirection="row" justifyContent="space-between">
                  <Text>Mensal</Text>
                  <CircleCheckBig color="darkgreen" />
                </View>
                :
                ''
            }
          </View>
          <View 
            mx="$3"
            mt="$8"
            p="$5"
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
          >
            <Text fontSize="$xl" fontWeight="$bold" color={ selectedPlan.selected === "Deluxe" ? '$warmGray600' : '$white' }>Deluxe</Text>
            <Text fontSize="$3xl" fontWeight="$bold" color={ selectedPlan.selected === "Deluxe" ? '$black' : '$white' } mt={10}>$14.99</Text>
            <View bgColor="#fae050" borderRadius={20} mt={5}>
              <Text textAlign="center" color={ selectedPlan.selected === "Deluxe" ? '$warmGray600' : '$black' }>Salve 67%</Text>
            </View>
            {
              selectedPlan.selected === "Deluxe"
                ?
                <View mt={15} flexDirection="row" justifyContent="space-between">
                  <Text>Mensal</Text>
                  <CircleCheckBig color="darkgreen" />
                </View>
                :
                ''
            }
          </View>
        </View>
      </SafeAreaView> 
      </LinearGradient>
  )
}