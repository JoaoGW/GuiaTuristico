import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { HStack, VStack, Text, Button, ButtonIcon, AvatarBadge } from '@gluestack-ui/themed';

import { LocationContext } from '@contexts/requestDeviceLocation';

import NotificationsData from '@data/notifications.json';

import { reverseGeocodeWithNominatim } from '@utils/geoDecoder';

import { AuthNavigationProp } from '@routes/auth.routes';

import { LocateFixed, Bell } from 'lucide-react-native';

export function CurrentStatusBar() {
  const { location, errorMsg } = useContext(LocationContext);
  const [address, setAddress] = useState<{ city: string; neighborhood: string } | null>(null);
  const navigation = useNavigation<AuthNavigationProp>();

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
    <SafeAreaView>
      <HStack justifyContent="space-between" alignItems="center" pt={20} px={10} width="100%">
        <VStack flex={1}>
          <HStack alignItems="center">
            <LocateFixed size={28} color="#535353" />
            { errorMsg ? (
              <Text color="red.500" ml={7}>{errorMsg}</Text>
            ) : location ? (
              address ? (
                <Text color="green.500" ml={7} fontWeight="$bold" >
                  {address.neighborhood}, {address.city}
                </Text>
              ) : (
                <Text ml={7}>Obtendo endereço...</Text>
              )
            ) : (
              <Text ml={7}>Obtendo localização...</Text>
            )}
          </HStack>
        </VStack>
        <Button variant="link" onPress={ () => navigation.navigate("Notifications") }>
          <ButtonIcon as={ Bell } color="#535353" size='xl' style={{ marginRight: 15 }} />
          { 
            NotificationsData.length > 0
              ? <AvatarBadge bgColor='$red500'/>
              : ''
          }
        </Button>
      </HStack>
    </SafeAreaView>
  );
}