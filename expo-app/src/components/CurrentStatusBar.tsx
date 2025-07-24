import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { View, VStack, Text, Button, ButtonIcon, AvatarBadge } from '@gluestack-ui/themed';

import { LocationContext } from '@contexts/requestDeviceLocation';

import { reverseGeocodeWithNominatim } from '@utils/geoDecoder';
import { useNotificationStore } from '@utils/notificationStore';

import { AuthNavigationProp } from '@routes/auth.routes';

import { LocateFixed, BellRing } from 'lucide-react-native';

export function CurrentStatusBar() {
  const [address, setAddress] = useState<{ city: string; neighborhood: string } | null>(null);

  const { location, errorMsg } = useContext(LocationContext);
  const navigation = useNavigation<AuthNavigationProp>();
  const checkNotifications = useNotificationStore(state => state.notifications);

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
      <View flexDirection="row" justifyContent="space-between" alignItems="center" pt={20} px={10} width="100%">
        <VStack flex={1}>
          <View flexDirection="row" alignItems="center">
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
          </View>
        </VStack>
        <Button variant="link" onPress={ () => navigation.navigate("Notifications") }>
          <ButtonIcon as={ BellRing } color="#535353" size='xl' style={{ marginRight: 15 }} />
          { 
            checkNotifications.length > 0
              ? <AvatarBadge bgColor='$red500'/>
              : ''
          }
        </Button>
      </View>
    </SafeAreaView>
  );
}