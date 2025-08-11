import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";

import { Button, ButtonText, Text, View } from "@gluestack-ui/themed";

import { BadgeCheck, ChevronRight, CircleFadingArrowUp, HandCoins, ListTodo, MonitorPlay, TicketPercent } from "lucide-react-native";

import CoinIllustration from '@assets/Illustrations/Extras/Coin.svg';

import { AuthNavigationProp } from "@routes/auth.routes";

export function ManagePremiumPlan(){
  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <ScrollView>
        <View px={15} pt={5}>
          <LinearGradient
            colors={['#b6e0c7', '#93deb4']}
            style={{ padding: 20, borderRadius: 15 }}
          >
            <View flexDirection="row" alignItems="center">
              <CoinIllustration width={69} height={69} />
              <View flexDirection="column" ml={15}>
                <View flexDirection="row" mt={5}>
                  <Text fontSize="$3xl" color="$white" fontWeight="$bold">999999</Text>
                  <Text fontSize="$xl" color="$white" ml={6} mt={7}>moedas</Text>
                </View>
                <View bgColor="#f3e16b" p={5} borderRadius={20} mt={5} alignItems="center"><Text fontSize="$sm">100 moedas = $0,00394</Text></View>
              </View>
            </View>
              <View flexDirection="row" justifyContent="space-between" alignItems="center" mt={20}>
                <Text fontSize="$md" color="$white" fontWeight="$medium">Opções de resgate das moedas</Text>
                <ChevronRight color="white" />
              </View>
          </LinearGradient>
          <View
            bgColor="#ffffff"
            borderRadius={15}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={5}
            elevation={5}
            justifyContent="center"
            py={15}
            px={20}
            mt={15}
          >
            <View flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text fontSize="$xl" fontWeight="$bold" color="$black">Status da Assinatura</Text>
              <View bgColor="#f22d2d" p={5} borderRadius={20} mt={5} alignItems="center"><Text fontSize="$sm" color="$white" px={5}>Inativa</Text></View>
            </View>
            <View flexDirection="column" mt={25}>
              <View flexDirection="row" alignItems="center" mb={25} maxWidth="90%">
                <BadgeCheck color="#2752B7" size={45} />
                <View ml={10}>
                  <Text fontSize="$md" color="$black" fontWeight="$semibold">Recursos Premium</Text>
                  <Text fontSize="$sm" color="$black">Tenha acesso a tudo que oferecemos</Text>
                </View>
              </View>
              <View flexDirection="row" alignItems="center" mb={25} maxWidth="90%">
                <HandCoins color="#2752B7" size={45} />
                <View ml={10}>
                  <Text fontSize="$md" color="$black" fontWeight="$semibold">Mais moedas</Text>
                  <Text fontSize="$sm" color="$black">Ganhe mais moedas para desbloquear novos recursos</Text>
              </View>
              </View>
              <View flexDirection="row" alignItems="center" maxWidth="90%">
                <TicketPercent color="#2752B7" size={45} />
                <View ml={10}>
                  <Text fontSize="$md" color="$black" fontWeight="$semibold">Ganhe Descontos</Text>
                  <Text fontSize="$sm" color="$black">Descontos incríveis para quem já assina continuar conosco</Text>
                </View>
              </View>
              <Button variant="link" flexDirection="row" justifyContent="space-between" alignItems="center" bgColor="trasparent" w="100%" mt={20} onPress={ () => navigation.navigate("OptionsManagePremiumPlan") }>
                <Text fontSize="$md" color="$black" fontWeight="$medium">Gerenciar minha assinatura</Text>
                <ChevronRight color="black" />
              </Button>
            </View>
          </View>
          <View
            bgColor="#ffffff"
            borderRadius={15}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={5}
            elevation={5}
            justifyContent="center"
            py={15}
            px={20}
            mt={15}
          >
            <Text fontSize="$xl" fontWeight="$bold" color="$black">Como ganhar moedas?</Text>
            <View flexDirection="row" justifyContent="space-around" gap={10}>
              <View flexDirection="column" mt={25} alignItems="center">
                <CircleFadingArrowUp color="#2752B7" size={45} />
                <Text fontWeight="$semibold" mt={5}>Premium</Text>
              </View>
              <View flexDirection="column" mt={25} alignItems="center">
                <MonitorPlay color="#2752B7" size={45} />
                <Text fontWeight="$semibold" mt={5}>Anúncios</Text>
              </View>
              <View flexDirection="column" mt={25} alignItems="center">
                <ListTodo color="#2752B7" size={45} />
                <Text fontWeight="$semibold" mt={5}>Missões</Text>
              </View>
            </View>
          </View>
          <Button
            bgColor="#ffffff"
            borderRadius={15}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={5}
            elevation={5}
            py={5}
            px={20}
            mt={15}
            mb={70}
            flexDirection="row"
            justifyContent="space-between"
            size="lg"
            alignItems="center"
          >
            <ButtonText color="$black">Histórico de Moedas</ButtonText>
            <ChevronRight color="black" />
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}