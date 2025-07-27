import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, FlatList, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from 'expo-linear-gradient';

import { Button, ButtonGroup, ButtonText, Pressable, Text, View } from "@gluestack-ui/themed";

import { ChooseDialog } from "@components/ChooseDialog";

import { ArrowRight, LucideIcon, MessageCirclePlus, Mic, MapPin, Lightbulb, Utensils, Bed, Activity, BookOpen, Bus, CloudSun, ClockFading, RefreshCcw, Trash } from "lucide-react-native";

import FelipeMascotPremium from '@assets/Mascot/Felipe_Mascot_GoPremium.svg';

import { clearAllChatsHistory, loadAllChatsHistory } from '@services/storageManager'

import { ChatHistoryTypes } from '../../../@types/ChatHistoryTypes';

import { AuthNavigationProp } from "@routes/auth.routes";

const topics = [
  {
    id: 1,
    title: "Populares",
    icon: MapPin,
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "Dicas",
    icon: Lightbulb,
    color: "#FFD700",
  },
  {
    id: 3,
    title: "Comer",
    icon: Utensils,
    color: "#FF6347",
  },
  {
    id: 4,
    title: "Dormir",
    icon: Bed,
    color: "#6A5ACD",
  },
  {
    id: 5,
    title: "Passear",
    icon: Activity,
    color: "#FF8C00",
  },
  {
    id: 6,
    title: "Cultura",
    icon: BookOpen,
    color: "#8B4513",
  },
  {
    id: 7,
    title: "Transporte",
    icon: Bus,
    color: "#4682B4",
  },
  {
    id: 8,
    title: "Previsão",
    icon: CloudSun,
    color: "#87CEEB",
  },
];

type TopicsAttributes = {
  id: number,
  title: string,
  icon: LucideIcon,
  color: string
}

const TopicItem = ({ title, icon: Icon, color }: TopicsAttributes) => (
  <View alignContent="center" mr={30} alignItems="center">
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
  </View>
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

  const navigation = useNavigation<AuthNavigationProp>();

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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View p={15}>
        <LinearGradient
          colors={['#b6e0c7', '#93deb4']}
          style={{ padding: 20, borderRadius: 15 }}
        >
          <View flexDirection="row">
            <View maxWidth="50%">
              <Text fontSize="$2xl" fontWeight="$bold" mb={7} w="120%">Plano Premium</Text>
              <Text fontWeight="$semibold">Desbloqueie todos os recursos com o Premium</Text>
              <ButtonGroup justifyContent='center' alignItems='center' mt={20} ml={-20}>
                <LinearGradient
                  colors={['#E9AD2D', '#f2d16e']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: '80%',
                    borderRadius: 20,
                    shadowColor: '#f2da95',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <Button w="100%" borderRadius={20} bgColor="transparent" size='lg' onPress={ () => navigation.navigate("AIChatMenu") } $pressed={{ opacity: 0.8, transform: [{ scale: 0.98 }] }}>
                    <ButtonText textAlign="center" fontSize="$xl">Upgrade</ButtonText>
                  </Button>
                </LinearGradient>
              </ButtonGroup>
            </View>
            <FelipeMascotPremium 
              width={180} 
              height={180} 
              style={{ 
                marginLeft: 10, 
                marginBottom: -30,
                zIndex: 2 
              }} 
            />
          </View>
        </LinearGradient>
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
            </View>
          </View>
          <View mt={30}>
            <Text fontSize="$2xl" fontWeight="$bold" color="$black" mb={15}>Tópicos</Text>
            <View>
              <FlatList<TopicsAttributes>
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={ topics }
                keyExtractor={ (item) => item.id.toString() }
                renderItem={({ item }) => (
                  <TopicItem 
                    id={ item.id }
                    title={ item.title } 
                    icon={ item.icon } 
                    color={ item.color } 
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
      </ScrollView>
    </SafeAreaView>
  )
}