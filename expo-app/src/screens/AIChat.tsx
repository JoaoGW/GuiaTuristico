import { Text, View, Input, InputField, InputSlot, InputIcon, Pressable } from "@gluestack-ui/themed";

import { reverseGeocodeWithNominatim } from "@utils/geoDecoder";
import { LocationContext } from "@utils/requestDeviceLocation";

import { MapPinned, Cloud, MessageCircle } from 'lucide-react-native';
import { useContext, useEffect, useState } from "react";

export function AIChat() {
  const { location, errorMsg } = useContext(LocationContext);
  const [address, setAddress] = useState<{ city: string; neighborhood: string } | null>(null);

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
              <Text color="red.500" ml={7} fontSize="$md">{errorMsg}</Text>
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

      <View flex={1} />

      <View>
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
          <InputField placeholder="Conversar com IA" />
          <InputSlot pr={10}>
            <InputIcon as={MessageCircle} color="#e9ad2d" size="xl" />
          </InputSlot>
        </Input>
      </View>
    </View>
  )
}