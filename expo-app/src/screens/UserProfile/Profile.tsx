import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { 
  AvatarImage, 
  Button, 
  Image, 
  Pressable, 
  Text, 
  View, 
  Modal,
} from "@gluestack-ui/themed";

import { PersonalInfoProfile } from "@components/Profile/PersonalInfoProfile";
import { PersonalInfoPreferences } from "@components/Profile/PersonalInfoPreferences";
import { PersonalInfoSettings } from "@components/Profile/PersonalInfoSettings";

import { AuthNavigationProp } from "@routes/auth.routes";

import { useAuth } from "@contexts/AuthContext";

import { 
  Bell, 
  BookCheck, 
  BriefcaseBusiness, 
  Cake, 
  CircleDollarSign, 
  Crown, 
  Edit, 
  Globe, 
  Heart, 
  Info, 
  LogOut, 
  Mail, 
  MapPin, 
  MessageCircleHeart, 
  Moon, 
  Phone, 
  ScanHeart, 
  ShieldQuestion, 
  VenusAndMars, 
  WifiOff 
} from "lucide-react-native";

export function Profile(){
  const navigation = useNavigation<AuthNavigationProp>();
  const { logout } = useAuth();
  const [tema, setTema] = useState('Claro'); // Default is "Claro"
  const [showThemeModal, setShowThemeModal] = useState(false);

  const themeOptions = [
    { label: "Claro", value: "Claro" },
    { label: "Escuro", value: "Escuro" },
    { label: "Pastel", value: "Pastel" },
    { label: "Midnight", value: "Midnight" }
  ];

  return(
    <View flex={1}>
      {/* IMAGEM DE CIMA */}
      <Image source={ require('@assets/santiago_farellones.jpg') } w="100%" h={225} alt="Background do Fundo de Perfil" />
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
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
              <Text fontSize="$xl" fontWeight="$bold" color="$black" mt={10} mb={25}>Nome do Usuário</Text>
            </View>
            <View justifyContent="center" mt={-30}>
              <View flexDirection="row">
                <Heart color="#2752B7" />
                <Text fontSize="$lg" color="#2752B7" fontWeight="$semibold" ml={5}>99</Text>
              </View>
              <Text fontSize="$sm">Favoritos</Text>
            </View>
            
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 165 }}>
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
              {/* CAIXA INFORMACOES PESSOAIS */}
              <View flexDirection="column">
                <View flexDirection="row" justifyContent="space-between">
                  <Text color="#2752B7" fontWeight="$semibold" fontSize="$lg" mb={15}>Informações Pessoais</Text>
                  <Pressable onPress={ () => navigation.navigate("EditProfile") }>
                    <Edit size={21} color="#2752B7" style={{ marginRight: 20 }} />
                  </Pressable>
                </View>
                {/* nascimento + genero*/}
                <View flexDirection="row" justifyContent="space-between" pr={15}>
                  <PersonalInfoProfile icon={ Cake } topic="Data de Nascimento" information="--/--/----" />
                  <PersonalInfoProfile icon={ VenusAndMars } topic="Gênero" information="Todos" style={{ marginLeft: 10 }} />
                </View>
                {/* relacionamento + profissao */}
                <View flexDirection="row" justifyContent="space-between" pr={15}>
                  <PersonalInfoProfile icon={ ScanHeart } topic="Relacionamento" information="Solteiro" />
                  <PersonalInfoProfile icon={ BriefcaseBusiness } topic="Profissão" information="Viajante" style={{ marginLeft: 10 }} />
                </View>
                {/* email + telefone */}
                <View flexDirection="row" justifyContent="space-between" pr={15}>
                  <PersonalInfoProfile icon={ Mail } topic="Email" information="teste@email.com" />
                  <PersonalInfoProfile icon={ Phone } topic="Telefone" information="+00 11 2233-4455" style={{ marginLeft: 10 }} />
                </View>
              </View>
            </View>
            {/* IDIOMAS */}
            <PersonalInfoPreferences icon={ Globe } preferenceTitle="Idiomas" choices="Português, Inglês, Francês" functionality={ () => navigation.navigate('UserLanguages') } style={{ marginTop: 10 }}  />
            {/* LOCAIS */}
            <PersonalInfoPreferences icon={ MapPin } preferenceTitle="Locais" choices="São Paulo, Brasília, Paris" functionality={ () => {} } style={{ marginTop: 10 }} />
            {/* INTERESSES */}
            <PersonalInfoPreferences icon={ MessageCircleHeart } preferenceTitle="Interesses" choices="Comida, Templos, Natureza, Museus" functionality={ () => navigation.navigate('UserPreferences') } style={{ marginTop: 10 }} />
            
            {/* ABA CONFIGURAÇÕES */}
            <View flexDirection="column">
              <Text color="#2752B7" fontWeight="$semibold" fontSize="$lg" mt={20} mb={10} px={20}>Configurações</Text>
              <PersonalInfoSettings icon={ Crown } settingsTitle="Gerenciar Assinatura" functionality={ () => navigation.navigate("ManagePremiumPlan") } />
              <PersonalInfoSettings icon={ CircleDollarSign } settingsTitle="Cotação" functionality={ () => {} } />
              <PersonalInfoSettings icon={ Moon } settingsTitle="Modo de Exibição" functionality={ () => setShowThemeModal(true) } />
              <PersonalInfoSettings icon={ Bell } settingsTitle="Notificações" functionality={ () => navigation.navigate("Notifications") } />
              <PersonalInfoSettings icon={ WifiOff } settingsTitle="Modo Offline" functionality={ () => {} } />
              <PersonalInfoSettings icon={ ShieldQuestion } settingsTitle="Privacidade" functionality={ () => {} } />
              <PersonalInfoSettings icon={ Info } settingsTitle="Informações" functionality={ () => {} } />
              <PersonalInfoSettings icon={ LogOut } settingsTitle="Sair" functionality={ logout } />
              
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <Modal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        animationPreset="slide"
      >
        <View bgColor="#fff"
          borderRadius={15}
          p={20}
          w={300}
          alignSelf="center"
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={5}
          elevation={5}>
          <Text fontWeight="$bold" fontSize="$lg" mb={15}>Escolha o tema</Text>
          {themeOptions.map(option => (
            <Pressable
              key={option.value}
              onPress={() => {
                setTema(option.value);
                setShowThemeModal(false);
              }}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: tema === option.value ? "#2752B7" : "#F0F0F0",
                marginBottom: 8
              }}
            >
              <Text color={tema === option.value ? "#fff" : "#2752B7"} fontWeight="$semibold">
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  )
}