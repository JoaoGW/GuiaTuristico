import { SafeAreaView } from 'react-native';
import { useContext } from 'react';

import { HStack, VStack, Text } from '@gluestack-ui/themed';

import { LocationContext } from '@utils/requestDeviceLocation';

import { LocateFixed, Bell } from 'lucide-react-native';

export function CurrentStatusBar() {
  const { location, errorMsg } = useContext(LocationContext);

  return (
    <SafeAreaView>
      <HStack justifyContent="space-between" alignItems="center" pt={60} px={10} width="100%">
        <VStack flex={1}>
          <HStack alignItems="center">
            <LocateFixed size={24} color="#535353" />
            { errorMsg ? (
              <Text color="red.500">{errorMsg}</Text>
            ) : location ? (
              <Text color="green.500">
                Localização atual: {location.coords.latitude}, {location.coords.longitude}
              </Text>
            ) : (
              <Text>Obtendo Localização</Text>
            )}
          </HStack>
        </VStack>
        <Bell size={24} color="#535353" />
      </HStack>
    </SafeAreaView>
  );
}