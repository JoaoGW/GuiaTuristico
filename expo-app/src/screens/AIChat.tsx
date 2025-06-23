import { useContext, useEffect, useRef, useState } from "react";
import { MapPinned, Cloud, MessageCircle } from 'lucide-react-native';

import { Text, View, Input, InputField, InputSlot, InputIcon, Pressable, ScrollView } from "@gluestack-ui/themed";

import { CharacterLimiter } from "@components/CharacterLimiter";
import { UserBalloon } from "@components/Chat/UserBalloon";
import { AiBalloon } from "@components/Chat/AiBalloon";

import { reverseGeocodeWithNominatim } from "@utils/geoDecoder";
import { LocationContext } from "@utils/requestDeviceLocation";
import { generateChatAnswers } from "@utils/gptRequests"

type Message = {
  sender: "ai" | "user",
  text: string,
  name: string,
  avatarUrl: string
}

export function AIChat() {
  const [address, setAddress] = useState<{ city: string; neighborhood: string } | null>(null);
  const [currentCharactersQuantity, setCurrentCharactersQuantity] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { location, errorMsg } = useContext(LocationContext);
  const scrollViewRef = useRef(null);

  const handleChatRequest = async () => {
    try {
      setIsLoading(true);

      if(currentMessage.length < 10){
        throw new Error("Sua mensagem é curta demais. Requisição para a IA cancelada!");
      }

      const newUserMessage: Message = {
        sender: "user",
        text: currentMessage,
        name: "Nome do Usuário",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      }
      
      setMessages((prev) => [...prev, newUserMessage]);

      const aiText = await generateChatAnswers(newUserMessage.text);

      const newAIMessage: Message = {
        sender: "ai",
        text: aiText,
        name: "Seu Guia Turístico - IA",
        avatarUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
      }

      setMessages((prev) => [...prev, newAIMessage]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Ocorreu algum erro e não conseguirei te ajudar agora! Desculpa...",
          name: "Seu Guia Turístico - IA",
          avatarUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
        }
      ]);
    } finally {
      setCurrentMessage("");
      setCurrentCharactersQuantity(0);
      setIsLoading(false);
    }
  }

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
    <View flex={1} px={30} py={60}>
      <View flexDirection="column">
        <Text fontWeight="$bold" fontSize="$2xl" mb={15}>O que você procura hoje?</Text>
        <View gap={10}>
          <View flexDirection="row" alignItems="center">
            <MapPinned size={50} color="#e9ad2d" />
            { errorMsg ? (
              <Text color="red.500" ml={7} fontSize="$md">{ errorMsg }</Text>
            ) : location ? (
              address ? (
                <Text color="green.500" ml={7} fontWeight="$bold" fontSize="$md">
                  {address.neighborhood}, {address.city}
                </Text>
              ) : (
                <Text ml={7} fontSize="$md">Obtendo endereço...</Text>
              )
            ) : (
              <Text ml={7} fontSize="$md">Obtendo localização...</Text>
            )}
          </View>
          <View flexDirection="row" alignItems="center">
            <Cloud size={50} color="#e9ad2d" />
            <Text ml={7} fontSize="$md">Clima ainda não foi implementado</Text>
          </View>
        </View>
      </View>

      <View flex={1} my={20}>
        <ScrollView showsVerticalScrollIndicator={false}>
          { messages.length === 0 ? (
            <View
              bg="#182ffd65" // tom de roxo que contrasta com #e9ad2d
              borderRadius={20}
              p={30}
              alignItems="center"
              justifyContent="center"
              minHeight={250}
              mx={10}
              mt={20}
            >
              <Text fontWeight="$bold" fontSize="$xl" color="$black" mb={10}>
                Conversar com a IA
              </Text>
              <Text fontSize="$md" color="$black" textAlign="center">
                Aqui você pode pedir algumas solicitações para a Inteligência Artificial do que fazer agora! Ela irá tomar como base a sua localização atual e o clima atual.
              </Text>
            </View>
          ) : (
            messages.map((message, index) =>
              message.sender === "user" ? (
                <UserBalloon
                  key={index}
                  message={message.text}
                  avatarUrl={message.avatarUrl}
                  senderName={message.name}
                />
              ) : (
                <AiBalloon
                  key={index}
                  message={message.text}
                  senderName={message.name}
                />
              )
            )
          )}
        </ScrollView>
      </View>

      <View>
        <View alignItems="flex-end" mr={15}>
          <CharacterLimiter currentCharactersQuantity={ currentCharactersQuantity } characterLimitQuantity={200} />
        </View>
        <Input
          variant="outline"
          size="lg"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
          borderRadius={30}
          borderColor="#e9ad2d"
          borderWidth={2}
        >
          <InputField 
            placeholder={ isLoading ? "Aguarde..." : "Conversar com IA" } 
            value={ currentMessage }
            maxLength={200} 
            onChangeText={ (text) => { setCurrentCharactersQuantity(text.length); setCurrentMessage(text); } } 
          />
          <InputSlot pr={10}>
            <Pressable onPress={ handleChatRequest } alignSelf="center" disabled={ isLoading ? true : false }>
              <InputIcon as={ MessageCircle } color="#e9ad2d" size="xl" />
            </Pressable>
          </InputSlot>
        </Input>
      </View>
    </View>
  )
}