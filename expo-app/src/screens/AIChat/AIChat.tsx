// Importação de hooks do React e componentes do React Native
import { useContext, useEffect, useEffectEvent, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Keyboard } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Constants from 'expo-constants';

// Importação de componentes UI do Gluestack
import { Text, View, Input, InputField, InputIcon, Pressable, ScrollView, Button, ButtonIcon, AvatarBadge, InputSlot } from "@gluestack-ui/themed";

// Componentes personalizados
import { CharacterLimiter } from "@components/InputItems/CharacterLimiter";
import { UserBalloon } from "@components/Chat/UserBalloon";
import { AiBalloon } from "@components/Chat/AiBalloon";
import { ConnectionErrorAlerter } from "@components/Errors/ConnectionErrorAlerter";
import { DotIndicator } from 'react-native-indicators';

// Ícones
import { Bot, ArrowLeft, Send, Loader } from 'lucide-react-native';

// Tipagem de navegação
import { AuthNavigationProp } from "@routes/auth.routes";

// Funções utilitárias

import { generateChatAnswers } from "@utils/gptRequests"
import { useNotificationStore } from "@utils/notificationStore";

// Funções para salvar e carregar histórico de chat
import { loadChatHistory, storeChatHistory } from '@services/storageManager'

// Contextos

import { NetInfoContext } from "@contexts/NetInfo";

// Assets
import FelipeProfilePicture from '@assets/Mascot/Felipe_Mascot_ProfilePic.svg';
import FelipeNewChat from '@assets/Mascot/Felipe_Mascot_NewChat.svg';

import { getAuth } from "firebase/auth";

import { MessageTypes } from '../../../@types/MessagesTypes';

import { responseCache } from '@utils/responseCache';

let GoogleSignin: any = null;
if (Constants.appOwnership !== 'expo') {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
}

// Função para gerar um ID único baseado no timestamp + random
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Tipagem dos parâmetros da rota
type AIChatRouteParams = {
  AIChat: {
    chatId?: string,
    topic?: string
  };
};

// Componente principal do chat com IA
export function AIChat() {
  // Captura os parâmetros da rota
  const route = useRoute<RouteProp<AIChatRouteParams, 'AIChat'>>();
  const receivedChatId = route.params?.chatId;
  const receivedChatTopic = route.params?.topic;
  
  // Estados locais
  const [currentCharactersQuantity, setCurrentCharactersQuantity] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [chatId] = useState<string>(() => receivedChatId || generateUniqueId());
  const [showModal, setShowModal] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<string>("");

  // Contextos

  const { isConnected } = useContext(NetInfoContext);

  // Função do store de notificações
  const addNotification = useNotificationStore(state => state.addNotification);

  // Navegação
  const navigation = useNavigation<AuthNavigationProp>();

  // Usuário autenticado
  const auth = getAuth();
  const user = auth.currentUser;

  // Efeito para obter informações do usuário (nome e foto do Google)
  useEffect(() => {
    async function checkCurrentUser() {
      const isExpoGo = Constants.appOwnership === 'expo';

      if (isExpoGo) {
        setUserName(user?.displayName || "Usuário Desconhecido");
        setUserPhoto(user?.photoURL || "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg");
      } else {
        try {
          const userInfo = await GoogleSignin.getCurrentUser();
          setUserName(userInfo?.user.name || "Usuário");

          const photoUrl = userInfo?.user.photo;
          if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim() !== '') {
            setUserPhoto(photoUrl);
          } else {
            setUserPhoto("https://cdn.pixabay.com/photo/2022/07/16/04/19/biker-7324421_640.jpg");
          }
        } catch (error) {
          console.error("Erro ao obter informações do usuário:", error);
          setUserName("Usuário");
          setUserPhoto("https://cdn.pixabay.com/photo/2022/07/16/04/19/biker-7324421_640.jpg");
        }
      }
    }

    checkCurrentUser();
  }, [user?.displayName, user?.photoURL]);

  // Função para enviar uma mensagem e receber resposta da IA
  const handleChatRequest = async (topicMessage?: string) => {
    try {
      setIsLoading(true);
      Keyboard.dismiss();
  
      const messageToSend = topicMessage || currentMessage;
      // DEBUG: console.log("Mensagem enviada para a IA:", messageToSend);
  
      // Validação para mensagens muito curtas
      if (messageToSend.length < 10) {
        throw new Error("Sua mensagem é curta demais. Requisição para a IA cancelada!");
      }
  
      // Cria a mensagem do usuário 
      const newUserMessage: MessageTypes = {
        sender: "user",
        text: messageToSend,
        name: userName || user?.displayName || "Usuário",
        avatarUrl: userPhoto || "https://cdn.pixabay.com/photo/2022/07/16/04/19/biker-7324421_640.jpg"
      }
  
      // Atualiza o estado das mensagens
      setMessages((prev) => [...prev, newUserMessage]);
  
      // Verifica resposta cacheada/predefinida
      const cachedResponse = responseCache.getCachedResponse(messageToSend);
      let aiText: string;
      let promptText = messageToSend;
      if (cachedResponse) {
        aiText = cachedResponse;
        console.log("Resposta cacheada/predefinida usada:", aiText);
      } else {
        // Adiciona o prefixo se não estiver no cache
        promptText = `Apenas responda a pergunta a seguir se ela for minimamente relacionada a turismo ou uma sugestão de algo a se fazer em algum lugar, caso não seja, diga que não pode respondê-la por não ser de turismo. Não seja tão restrito também. ${messageToSend}`;
        // DEBUG: console.log("Mensagem para a IA (com prefixo):", promptText);
        // Faz a requisição para a IA
        aiText = await generateChatAnswers(promptText);
        // DEBUG: console.log("Resposta recebida da IA:", aiText);
        // Armazena resposta no cache
        responseCache.storeResponse(messageToSend, aiText);
      }
  
      // Cria a mensagem da IA
      const newAIMessage: MessageTypes = {
        sender: "ai",
        text: aiText,
        name: "Felipe - Seu Guia Turístico",
        avatarUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
      }
  
      // Atualiza mensagens com resposta da IA
      setMessages((prev) => [...prev, newAIMessage]);
  
      // Dispara notificação local
      addNotification({
        title: "Nova Mensagem",
        description: "Seu Guia Turístico acaba de te enviar uma nova mensagem. Venha aqui conferir!",
        routeIcon: Bot
      });
  
    } catch {
      // Em caso de erro, envia uma mensagem de erro da IA
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
      // Limpa input e estado
      setCurrentMessage("");
      setCurrentCharactersQuantity(0);
      setIsLoading(false);
    }
  }

  // Efeito que carrega histórico do chat ao iniciar
  useEffect(() => {
    loadChatHistory(chatId, setMessages);
  }, [chatId]);

  // Efeito que salva o histórico sempre que as mensagens mudam
  useEffect(() => {
    if (messages.length > 0) {
      const currentDate = "Data: " + new Date().toLocaleString().split(" ").slice(0, 5).join(" ");
      storeChatHistory({ messages, lastModified: currentDate }, chatId);
    }
  }, [messages, chatId]);

  const sendReceivedTopic = useEffectEvent((topic: string) => {
    handleChatRequest(topic);
  });

  // Se houver tópico recebido, inicia a conversa automaticamente após a montagem.
  // O cancelamento no cleanup evita envio duplicado quando o efeito é reexecutado.
  useEffect(() => {
    if (receivedChatTopic == null) return;

    const timer = setTimeout(() => sendReceivedTopic(receivedChatTopic), 0);
    return () => clearTimeout(timer);
  }, [receivedChatTopic]);

  return (
    <View flex={1}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={ Platform.OS === "ios" ? "padding" : undefined }
          keyboardVerticalOffset={ Platform.OS === "ios" ? 0 : 0 }
        >
          <View flex={1} px={30} py={20} style={{ paddingBottom: 85 }}>
            {/* Header do chat */}
            <View flexDirection="row" justifyContent="space-between" w="100%" alignItems="center" mt={-15} mr={15}>
              <Button bgColor="transparent" onPress={ () => navigation.goBack() }>
                <ButtonIcon as={ ArrowLeft } color="$black" size="xl" ml={-20} />
              </Button>
              <View flexDirection="column" alignItems="center" ml={8}>
                <Text fontSize="$lg" fontWeight="$bold">Felipe</Text>
                <View flexDirection="row">
                  <Text pr={25}>{ isLoading ? "Digitando..." : "Online" }</Text>
                  <AvatarBadge />
                </View>
              </View>
              <View position="relative" justifyContent="center" alignItems="center">
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

            {/* Área de mensagens */}
            <View flex={1} mt={20}>
              <ScrollView showsVerticalScrollIndicator={false}>
                { messages.length === 0 ? (
                  <View flex={1} justifyContent="center" alignItems="center" mx={10}>
                    <View flexDirection="column" justifyContent="center" alignItems="center" mt={20}>
                      <FelipeNewChat style={{ maxWidth: 360, maxHeight: 360 }} />
                      <Text fontWeight="$semibold" fontSize="$xl" color="$black">Como posso te ajudar hoje?</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    {messages.map((message, index) =>
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
                    )}
                    {isLoading && (
                      <View flexDirection="row" alignItems="center" mb={10}>
                        <View
                          bgColor="#2752B7"
                          borderRadius={15}
                          px={20}
                          py={15}
                          maxWidth="75%"
                          height={50}
                          justifyContent="center"
                        >
                          <DotIndicator 
                            color="#FFFFFF"
                            size={6}
                            count={3}
                          />
                        </View>
                      </View>
                    )}
                  </>
                )}
              </ScrollView>
            </View>

            {/* Input de envio de mensagens */}
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
                  <CharacterLimiter currentCharactersQuantity={ currentCharactersQuantity } characterLimitQuantity={200} />
                </InputSlot>
              </Input>
              <Pressable onPress={ () => handleChatRequest(currentMessage) } alignSelf="center" bgColor="#2752B7" p={10} borderRadius={10} disabled={isLoading || currentCharactersQuantity < 10}>
                <InputIcon as={ isLoading ? Loader : Send } color="$white" size="xl" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Modal de erro de conexão */}
        { !isConnected && <ConnectionErrorAlerter showModal={showModal} setShowModal={setShowModal} /> }
      </SafeAreaView>
    </View>
  )
}
