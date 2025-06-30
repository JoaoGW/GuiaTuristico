import { useContext, useEffect, useRef, useState } from "react";
import { MapPinned, Cloud, MessageCircle } from 'lucide-react-native';

import { Text, View, Input, InputField, InputSlot, InputIcon, Pressable, ScrollView } from "@gluestack-ui/themed";

import { CharacterLimiter } from "@components/CharacterLimiter";
import { UserBalloon } from "@components/Chat/UserBalloon";
import { AiBalloon } from "@components/Chat/AiBalloon";

import { reverseGeocodeWithNominatim } from "@utils/geoDecoder";
import { LocationContext } from "@contexts/requestDeviceLocation";
import { generateChatAnswers } from "@utils/gptRequests"

type Message = {
  sender: "ai" | "user",
  text: string,
  name: string,
  avatarUrl: string
}

type Weather = {
  temperature: number | string,
  condition: string
}

export function AIChat() {
  const [address, setAddress] = useState<{ city: string; neighborhood: string } | null>(null);
  const [currentCharactersQuantity, setCurrentCharactersQuantity] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [weatherInfo, setWeatherInfo] = useState<Weather>({ temperature: "Indisponível", condition: "Indisponível" });
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

  const handleWeatherRequest = async (): Promise<Weather> => {
    try {
      if (!location) {
        console.log("Localização não disponível.");
        return { temperature: "Indisponível", condition: "Indisponível" };
      }
      const { latitude, longitude } = location.coords;
      const response = await fetch(`http://<SEU-IP-AQUI>:3000/api/weather?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) {
        console.error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        return { temperature: "Indisponível", condition: "Indisponível" };
      }
      const result = await response.json();

      const temperature = result.current?.temp_c ?? null;
      const condition = result.current?.condition?.text ?? null;

      return { temperature, condition };
    } catch (error) {
      console.log(error);
      return { temperature: "Indisponível", condition: "Indisponível" };
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
                  { address.neighborhood }, { address.city }
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
            <Text color="green.500" ml={7} fontWeight="$bold" fontSize="$md">
              { weatherInfo && weatherInfo.temperature + "°C, " + weatherInfo.condition }
            </Text>
          </View>
        </View>
      </View>

      <View flex={1} my={20}>
        <ScrollView showsVerticalScrollIndicator={false}>
            { messages.map((message, index) => 
              message.sender === "user" ?
                <UserBalloon
                  key={ index }
                  message={ message.text }
                  avatarUrl={ message.avatarUrl }
                  senderName={ message.name }
                />
              :
                <AiBalloon
                  key={ index }
                  message={ message.text }
                  senderName={ message.name }
                />
            ) }
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