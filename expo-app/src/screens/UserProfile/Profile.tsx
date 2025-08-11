import { SafeAreaView, ScrollView, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { AvatarImage, Button, Image, Text, View } from "@gluestack-ui/themed";

import { PersonalInfoProfile } from "@components/Profile/PersonalInfoProfile";
import { PersonalInfoPreferences } from "@components/Profile/PersonalInfoPreferences";
import { PersonalInfoSettings } from "@components/Profile/PersonalInfoSettings";

import { AuthNavigationProp } from "@routes/auth.routes";

import { useAuth } from "@contexts/AuthContext";

import { BookCheck, BriefcaseBusiness, Cake, Globe, Heart, Info, LogOut, Mail, MapPin, MessageCircleHeart, Phone, ScanHeart, ShieldQuestion, VenusAndMars } from "lucide-react-native";

export function Profile(){
  const navigation = useNavigation<AuthNavigationProp>();
  const { logout } = useAuth();

  return(
    <View flex={1}>
      <Image source={ require('@assets/santiago_farellones.jpg') } w="100%" h={225} />
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <View bgColor="#FDFDFD" flex={1}>
          <View flexDirection="row" justifyContent="space-between" px={20}>
            <View justifyContent="center" mt={-30}>
              <View flexDirection="row">
                <BookCheck color="#2752B7" />
                <Text fontSize="$lg" color="#2752B7" fontWeight="$semibold" ml={5}>99</Text>
              </View>
              <Text fontSize="$sm">Roteiros</Text>
            </View>
            <View mt={-75} flexDirection="column" alignItems="center">
              <Button w={200} h={160} borderRadius={75} overflow="hidden" p={0} bgColor="transparent" onPress={ () => navigation.navigate("EditProfile") }>
                <AvatarImage source={'https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_1280.png'} alt="Avatar do Usuário" style={{ width: '100%', height: '100%', borderRadius: 75 }} />
              </Button>
              <Text fontSize="$xl" fontWeight="$bold" mt={10} mb={25}>Nome do Usuário</Text>
            </View>
            <View justifyContent="center" mt={-30}>
              <View flexDirection="row">
                <Heart color="#2752B7" />
                <Text fontSize="$lg" color="#2752B7" fontWeight="$semibold" ml={5}>99</Text>
              </View>
              <Text fontSize="$sm">Favoritos</Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 115 }}>
            <View 
              bgColor="#ffffff" 
              width={100} 
              borderRadius={15} 
              shadowColor="#000" 
              shadowOffset={{ width: 0, height: 4 }} 
              shadowOpacity={0.2} 
              shadowRadius={5} 
              elevation={5} 
              justifyContent="center"
              alignSelf="center"
              w="95%"
              py={15}
              pl={20}
            >
              <View flexDirection="column">
                <Text color="#2752B7" fontWeight="$semibold" fontSize="$lg" mb={15}>Informações Pessoais</Text>
                <View flexDirection="row" justifyContent="space-between" pr={15}>
                  <PersonalInfoProfile icon={ Cake } topic="Data de Nascimento" information="--/--/----" />
                  <PersonalInfoProfile icon={ VenusAndMars } topic="Gênero" information="Todos" style={{ marginLeft: 10 }} />
                </View>
                <View flexDirection="row" justifyContent="space-between" pr={15}>
                  <PersonalInfoProfile icon={ ScanHeart } topic="Relacionamento" information="Solteiro" />
                  <PersonalInfoProfile icon={ BriefcaseBusiness } topic="Profissão" information="Viajante" style={{ marginLeft: 10 }} />
                </View>
                <View flexDirection="row" justifyContent="space-between" pr={15}>
                  <PersonalInfoProfile icon={ Mail } topic="Email" information="teste@email.com" />
                  <PersonalInfoProfile icon={ Phone } topic="Telefone" information="+00 11 2233-4455" style={{ marginLeft: 10 }} />
                </View>
              </View>
            </View>
            <PersonalInfoPreferences icon={ Globe } preferenceTitle="Idiomas" choices="Português, Inglês, Francês" functionality={ () => {} } style={{ marginTop: 10 }} />
            <PersonalInfoPreferences icon={ MapPin } preferenceTitle="Locais" choices="São Paulo, Brasília, Paris" functionality={ () => {} } style={{ marginTop: 10 }} />
            <PersonalInfoPreferences icon={ MessageCircleHeart } preferenceTitle="Interesses" choices="Comida, Templos, Natureza, Museus" functionality={ () => {} } style={{ marginTop: 10 }} />
            
            <View flexDirection="column">
              <Text color="#2752B7" fontWeight="$semibold" fontSize="$lg" mt={20} mb={10} px={20}>Configurações</Text>
              <PersonalInfoSettings icon={ ShieldQuestion } settingsTitle="Privacidade" functionality={ () => {} } />
              <PersonalInfoSettings icon={ Info } settingsTitle="Informações" functionality={ () => {} } />
              <PersonalInfoSettings icon={ LogOut } settingsTitle="Sair" functionality={ logout } />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  )
}