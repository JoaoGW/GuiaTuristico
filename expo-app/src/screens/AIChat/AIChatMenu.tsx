import { useContext, useEffect, useState } from "react";
import { StatusBar, FlatList, ScrollView, Alert, View as RNView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from 'expo-linear-gradient';

import { Button, ButtonGroup, ButtonText, Pressable, Text, View } from "@gluestack-ui/themed";

import { ChooseDialog } from "@components/ChooseDialog";

import { 
  ArrowRight, 
  LucideIcon, 
  MessageCirclePlus, 
  Mic, MapPin, 
  Lightbulb, 
  Utensils, 
  Bed, 
  Activity, 
  BookOpen, 
  Bus, 
  CloudSun, 
  ClockFading, 
  RefreshCcw, 
  Trash, 
  Crown 
} from "lucide-react-native";

import { ConnectionErrorAlerter } from "@components/Errors/ConnectionErrorAlerter";
import { GoPremium } from "@components/GoPremium";

import { clearAllChatsHistory, loadAllChatsHistory } from '@services/storageManager'

import { LocationContext } from "@contexts/requestDeviceLocation";
import { NetInfoContext } from "@contexts/NetInfo";

import { AuthNavigationProp } from "@routes/auth.routes";

import { reverseGeocodeWithNominatim } from "@utils/geoDecoder";

import { ChatHistoryTypes } from '../../../@types/ChatHistoryTypes';

type TopicsAttributes = {
  id: number,
  title: string,
  icon: LucideIcon,
  color: string,
  routeNav: string
}

const TopicItem = ({ title, icon: Icon, color, onPress }: { title: string, icon: LucideIcon, color: string, onPress: () => void }) => (
  <Pressable alignContent="center" mr={30} alignItems="center" onPress={ onPress }>
    <LinearGradient
      colors={[color, `${color}AA`]}
      style={{
      borderRadius: 50,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      }}
    >
      <Icon color="white" size={28} />
    </LinearGradient>
    <Text fontWeight="$semibold" color="$black">{ title }</Text>
  </Pressable>
);

const HistoryItem = ({ title, date, icon: Icon, navigate, route, chatId }: ChatHistoryTypes) => (
  <Pressable
    flexDirection="row"
    alignItems="center"
    bgColor="#ffffff"
    borderRadius={15}
    shadowColor="#000"
    shadowOffset={{ width: 0, height: 4 }}
    shadowOpacity={0.2}
    shadowRadius={5}
    elevation={5}
    p={15}
    mb={10}
    onPress={ () => navigate(route, chatId) }
  >
    <View
      bgColor="#2752B7"
      borderRadius={50}
      width={45}
      height={45}
      justifyContent="center"
      alignItems="center"
      mr={15}
    >
      <Icon color="white" size={25} />
    </View>
    <View>
      <Text fontWeight="$bold" fontSize="$md" color="$black">{title}</Text>
      <Text fontSize="$sm" color="$gray500">{ date.toString() }</Text>
    </View>
  </Pressable>
);

export function AIChatMenu(){
  const [chatsHistory, setChatsHistory] = useState<ChatHistoryTypes[]>([]);
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const [topics, setTopics] = useState<TopicsAttributes[]>([]);
  const [showModal, setShowModal] = useState<boolean>(true);

  const navigation = useNavigation<AuthNavigationProp>();

  const { location } = useContext(LocationContext);
  const { isConnected } = useContext(NetInfoContext);

  useEffect(() => {
    const loadTopics = async () => {
      let locationUser = "Localização não disponível";
      
      if (location) {
        try {
          const address = await reverseGeocodeWithNominatim(location.coords.latitude, location.coords.longitude);
          locationUser = `${address.city}, ${address.neighborhood}`;
        } catch (error) {
          console.error('Erro ao obter endereço:', error);
        }
      }

      const topicsData = [
        {
          id: 1,
          title: "Populares",
          icon: MapPin,
          color: "#4CAF50",
          routeNav: location ? `Sugira locais populares para visitar em ${locationUser}` : "Sugira locais populares para visitar"
        },
        {
          id: 2,
          title: "Dicas",
          icon: Lightbulb,
          color: "#FFD700",
          routeNav: "Me dê dicas de viagem, aquelas que ninguém nunca te conta e somente os mais experientes sabem."
        },
        {
          id: 3,
          title: "Comer",
          icon: Utensils,
          color: "#FF6347",
          routeNav: location ? `Onde posso comer bem e com boa qualidade em ${locationUser}?` : "Onde posso comer bem"
        },
        {
          id: 4,
          title: "Dormir",
          icon: Bed,
          color: "#6A5ACD",
          routeNav: location ? `Sugira lugares para hospedagem em ${locationUser} em todas as faixas de preço.` : "Sugira lugares para hospedagem"
        },
        {
          id: 5,
          title: "Passear",
          icon: Activity,
          color: "#FF8C00",
          routeNav: location ? `O que fazer para se divertir em ${locationUser} sozinho? E com a família e amigos?` : "O que fazer para se divertir"
        },
        {
          id: 6,
          title: "Cultura",
          icon: BookOpen,
          color: "#8B4513",
          routeNav: location ? `Quais os pontos culturais para visitar em ${locationUser} e passar um bom tempo?` : "Pontos culturais para visitar"
        },
        {
          id: 7,
          title: "Transporte",
          icon: Bus,
          color: "#4682B4",
          routeNav: location ? `Como posso me locomover em ${locationUser}?` : "Quais são os melhores métodos de locomoção em grandes cidades?"
        },
        {
          id: 8,
          title: "Previsão",
          icon: CloudSun,
          color: "#87CEEB",
          routeNav: location ? `Como é o clima em ${locationUser} em cada época do ano?` : "Como está o clima"
        },
      ];

      setTopics(topicsData);
    };

    loadTopics();
  }, [location]);

  const clearHistory = async () => {
    try {
      await clearAllChatsHistory();
      setChatsHistory([]);
      setShowAlertDialog(false);
    } catch (error) {
      Alert.alert("Erro ao limpar histórico de chats");
    }
  };

  const loadAllChats = async () => {
    try {
      const history = await loadAllChatsHistory();
      if (history) {
        const updatedHistory = history.map(chat => ({
          ...chat,
          date: chat.date || "Data indisponível",
          navigate: (routeName: string, chatId: string) => navigation.navigate(routeName as any, { chatId })
        }));
        setChatsHistory(updatedHistory);
      }
    } catch (error) {
      Alert.alert('Erro ao carregar histórico de chats');
    }
  };

  useEffect(() => {
    loadAllChats();
  }, []);

  return(
    <RNView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View p={15} pt={70}>
        <GoPremium />
        <View mt={25}>
          <View flexDirection="row" gap={15}>
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
              w="48%"
              py={15}
              pl={20}
            >
              <View 
                bgColor="#8a4ab2"
                borderRadius={50}
                width={45}
                height={45}
                justifyContent="center"
                alignItems="center"
              >
                <MessageCirclePlus color="white" size={25} />
              </View>
              <Pressable flexDirection="row" alignItems="center" onPress={ () => navigation.navigate("AIChat") }>
                <Text fontSize="$md" fontWeight="$semibold" mt={15} color="$black" maxWidth="60%">Converse com Felipe</Text>
                <ArrowRight style={{ marginTop: 15, marginLeft: 10 }} />
              </Pressable>
            </View>
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
              w="48%"
              py={15}
              pl={20}
            >
              <View 
                bgColor="#ffd900"
                borderRadius={50}
                width={45}
                height={45}
                justifyContent="center"
                alignItems="center"
              >
                <Mic color="white" size={27} />
              </View>
              <Pressable flexDirection="row" alignItems="center" onPress={ () => navigation.navigate("AIVoiceChat") }>
                <Text fontSize="$md" fontWeight="$semibold" mt={15} color="$black" maxWidth="60%">Falar com Felipe</Text>
                <ArrowRight style={{ marginTop: 15, marginLeft: 10 }} />
              </Pressable>
              <Crown color="#FFD700" size={30} style={{ position: 'absolute', top: 20, right: 20 }} />
            </View>
          </View>
          <View mt={30}>
            <View flexDirection="row" justifyContent="space-between">
              <Text fontSize="$2xl" fontWeight="$bold" color="$black" mb={15}>Tópicos</Text>
              <Crown color="#FFD700" size={30} />
            </View>
            <View>
              <FlatList<TopicsAttributes>
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={ topics }
                keyExtractor={ (item) => item.id.toString() }
                renderItem={({ item }) => (
                  <TopicItem 
                    title={ item.title } 
                    icon={ item.icon } 
                    color={ item.color }
                    onPress={ () => navigation.navigate("AIChat", { topic: item.routeNav }) }
                  />
                )}
              />
            </View>
          </View>
          <View mt={30}>
            <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={15}>
              <Text fontSize="$2xl" fontWeight="$bold" color="$black">Histórico</Text>
              <View flexDirection="row">
                <Pressable onPress={ loadAllChats } mr={10}>
                  <RefreshCcw style={{ marginRight: 15 }} />
                </Pressable>
                <Pressable onPress={ () => setShowAlertDialog(true) }>
                  <Trash style={{ marginRight: 15 }} />
                </Pressable>
              </View>
            </View>
            <View>
              <FlatList<ChatHistoryTypes>
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={ chatsHistory }
                keyExtractor={ (item) => item.id.toString() }
                renderItem={({ item }) => (
                  <HistoryItem 
                    id={ item.id }
                    title={ item.title }
                    date={ item.date }
                    icon={ item.icon }
                    chatId={ item.chatId }
                    route={ item.route }
                    navigate={ item.navigate }
                  />
                )}
                ListEmptyComponent={
                  <View alignItems="center">
                    <ClockFading color="red" size={55} />
                    <Text textAlign="center" mt={10}>Por enquanto não há mensagens para exibir. Tente começar uma nova conversa com Felipe!</Text>
                  </View>
                }
              />
            </View>
          </View>
        </View>
        </View>
        {
          showAlertDialog &&
            <ChooseDialog
              title="Excluir Histórico"
              message="Você tem certeza que deseja excluir o histórico de conversas com Felipe?"
              isOpen={ showAlertDialog }
              setShowAlertDialog={ setShowAlertDialog }
              performAction={ clearHistory }
            />
        }
        {
          !isConnected &&
            <ConnectionErrorAlerter showModal={ showModal } setShowModal={ setShowModal } />
        }
      </ScrollView>
    </RNView>
  )
}