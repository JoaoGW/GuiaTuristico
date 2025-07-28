import { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { Text, View, Input, InputField, InputIcon, Pressable, ScrollView, Button, ButtonIcon, AvatarBadge, InputSlot } from "@gluestack-ui/themed";

import { CharacterLimiter } from "@components/InputItems/CharacterLimiter";
import { UserBalloon } from "@components/Chat/UserBalloon";
import { AiBalloon } from "@components/Chat/AiBalloon";
import { ConnectionErrorAlerter } from "@components/Errors/ConnectionErrorAlerter";

import { Bot, ArrowLeft, Send, Loader } from 'lucide-react-native';

import { AuthNavigationProp } from "@routes/auth.routes";

import { reverseGeocodeWithNominatim } from "@utils/geoDecoder";
import { generateChatAnswers } from "@utils/gptRequests"
import { useNotificationStore } from "@utils/notificationStore";

import { loadChatHistory, storeChatHistory } from '@services/storageManager'

import { LocationContext } from "@contexts/requestDeviceLocation";
import { NetInfoContext } from "@contexts/NetInfo";

import FelipeProfilePicture from '@assets/Mascot/Felipe_Mascot_ProfilePic.svg';
import FelipeNewChat from '@assets/Mascot/Felipe_Mascot_NewChat.svg';

import { MessageTypes } from '../../../@types/MessagesTypes';


// Gera o ID da conversa com base na data e hora
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

type Weather = {
  temperature: number | string,
  condition: string
}

type AIChatRouteParams = {
  AIChat: {
    chatId?: string,
    topic?: string
  };
};

export function AIChat() {
  const route = useRoute<RouteProp<AIChatRouteParams, 'AIChat'>>();
  const receivedChatId = route.params?.chatId;
  const receivedChatTopic = route.params?.topic;
  
  const [address, setAddress] = useState<{ city: string; neighborhood: string } | null>(null);
  const [currentCharactersQuantity, setCurrentCharactersQuantity] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [weatherInfo, setWeatherInfo] = useState<Weather>({ temperature: "--", condition: "--" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastModifiedDate, setLastModifiedDate] = useState<string>("Data indisponível");
  const [chatId] = useState<string>(() => receivedChatId || generateUniqueId());
  const [showModal, setShowModal] = useState<boolean>(true);

  const { location } = useContext(LocationContext);
  const { isConnected } = useContext(NetInfoContext);

  const addNotification = useNotificationStore(state => state.addNotification);

  const navigation = useNavigation<AuthNavigationProp>();

  const handleChatRequest = async (topicMessage?: string) => {
    try {
      setIsLoading(true);

      const messageToSend = topicMessage || currentMessage;

      if (messageToSend.length < 10) {
        throw new Error("Sua mensagem é curta demais. Requisição para a IA cancelada!");
      }

      const newUserMessage: MessageTypes = {
        sender: "user",
        text: messageToSend,
        name: "Nome do Usuário",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      }

      setMessages((prev) => [...prev, newUserMessage]);

      const aiText = await generateChatAnswers(newUserMessage.text);

      const newAIMessage: MessageTypes = {
        sender: "ai",
        text: aiText,
        name: "Felipe - Seu Guia Turístico",
        avatarUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
      }

      setMessages((prev) => [...prev, newAIMessage]);

      addNotification({
        title: "Nova Mensagem",
        description: "Seu Guia Turístico acaba de te enviar uma nova mensagem. Venha aqui conferir!",
        routeIcon: Bot
      });

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Ocorreu algum erro e não conseguirei te ajudar agora! Desculpa...",
          name: "Felipe - Seu Guia Turístico",
          avatarUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
        }
      ]);
    } finally {
      setCurrentMessage("");
      setCurrentCharactersQuantity(0);
      setIsLoading(false);
    }
  }

  const handleWeatherRequest = async (): Promise<Weather> => {
    try {
      if (!location) {
        console.log("Localização não disponível.");
        return { temperature: "--", condition: "--" };
      }
      const { latitude, longitude } = location.coords;
      const response = await fetch(`http://SEU-IP-AQUI:3000/api/weather?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) {
        console.error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        return { temperature: "--", condition: "--" };
      }
      const result = await response.json();

      const temperature = result.current?.temp_c ?? null;
      const condition = result.current?.condition?.text ?? null;

      return { temperature, condition };
    } catch (error) {
      console.log(error);
      return { temperature: "--", condition: "--" };
    }
  }

  useEffect(() => {
    if (location) {
      (async () => {
        try {
          const { temperature, condition } = await handleWeatherRequest();
          setWeatherInfo({ temperature, condition });
        } catch (error) {
          console.error('Erro ao obter clima:', error);
        }
      })();
    }
  }, [location]);

  useEffect(() => {
    loadChatHistory(chatId, setMessages, setLastModifiedDate);
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0) {
      const currentDate = "Data: " + new Date().toLocaleString().split(" ").slice(0, 5).join(" ");
      setLastModifiedDate(currentDate);

      storeChatHistory({ messages, lastModified: currentDate }, chatId);
    }
  }, [messages, chatId]);

  useEffect(() => {
    if(receivedChatTopic != undefined){
      handleChatRequest(receivedChatTopic);
    }
  }, [receivedChatTopic]);

  useEffect(() => {
    if (location) {
      (async () => {
        try {
          const result = await reverseGeocodeWithNominatim(location.coords.latitude, location.coords.longitude);
          setAddress(result);
        } catch (error) {
          console.error('Erro ao obter endereço:', error);
        }
      })();
    }
  }, [location]);

  return (
    <View flex={1}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={ Platform.OS === "ios" ? "padding" : "height" }
          keyboardVerticalOffset={0}
        >
          <View flex={1} px={30} py={20} style={{ paddingBottom: 65 }}>
            <View flexDirection="row" justifyContent="space-between" w="100%" alignItems="center" mt={-15} mr={15}>
              <Button bgColor="transparent" onPress={ () => navigation.goBack() }>
                <ButtonIcon as={ ArrowLeft } color="$black" size="xl" ml={-20} />
              </Button>
              <View flexDirection="column" alignItems="center" ml={8}>
                <Text fontSize="$lg" fontWeight="$bold">Felipe</Text>
                <View flexDirection="row">
                  <Text pr={25}>Online</Text>
                  <AvatarBadge />
                </View>
              </View>
                <View
                position="relative"
                justifyContent="center"
                alignItems="center"
                >
                <View
                  position="absolute"
                  width={55}
                  height={55}
                  borderRadius={27.5}
                  borderWidth={2}
                  borderColor="#2752B7"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  margin="auto"
                />
                  <FelipeProfilePicture height={55} width={55} style={{ marginRight: -10 }} />
                </View>
            </View>
            <View flex={1} mt={20}>
              <ScrollView showsVerticalScrollIndicator={false}>
                { messages.length === 0 ? (
                  <View
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    mx={10}
                  >
                    <View flexDirection="column" justifyContent="center" alignItems="center" mt={20}>
                      <FelipeNewChat style={{ maxWidth: 360, maxHeight: 360 }} />
                      <Text fontWeight="$semibold" fontSize="$xl" color="$black">Como posso te ajudar hoje?</Text>
                    </View>
                  </View>
                ) : (
                  messages.map((message, index) =>
                    message.sender === "user" ? (
                      <UserBalloon
                        key={ index }
                        message={ message.text }
                        avatarUrl={ message.avatarUrl }
                        senderName={ message.name }
                      />
                    ) : (
                      <AiBalloon
                        key={ index }
                        message={ message.text }
                        senderName={ message.name }
                      />
                    )
                  )
                )}
              </ScrollView>
            </View>

            <View flexDirection="row" mb={-10} w="110%" justifyContent="center" alignItems="center" alignSelf="center">
              <Input variant="outline" size="lg" borderRadius={10} borderColor="#2752B7" borderWidth={2} w="85%" mr={7}>
                <InputField
                  placeholder={ isLoading ? "Aguarde..." : "Converse com Felipe..." }
                  value={ currentMessage }
                  maxLength={200}
                  onChangeText={ (text) => { setCurrentCharactersQuantity(text.length); setCurrentMessage(text); }}
                  flex={1}
                />
                <InputSlot justifyContent="center" alignItems="center" mt={2} mr={6}>
                  <CharacterLimiter currentCharactersQuantity={currentCharactersQuantity} characterLimitQuantity={200} />
                </InputSlot>
              </Input>
              <Pressable onPress={() => handleChatRequest(currentMessage)} alignSelf="center" bgColor="#2752B7" p={10} borderRadius={10} disabled={isLoading || currentCharactersQuantity < 10}>
                <InputIcon as={ isLoading ? Loader : Send } color="$white" size="xl" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
        {
          !isConnected &&
          <ConnectionErrorAlerter showModal={showModal} setShowModal={setShowModal} />
        }
      </SafeAreaView>
    </View>
  )
}