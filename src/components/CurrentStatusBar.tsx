import { HStack, VStack, Text } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

export function CurrentStatusBar() {
  return (
    <SafeAreaView>
      <HStack justifyContent="space-between" alignItems="center" pt={60} px={10} width="100%">
        <VStack flex={1}>
          <HStack alignItems="center">
            <MaterialIcons name="place" size={24} color="#535353" />
            <Text fontSize="$md" fontWeight="$bold" ml="$1">
              São Paulo, Brazil
            </Text>
          </HStack>
        </VStack>
        <MaterialIcons name="notifications" size={24} color="#535353" />
      </HStack>
    </SafeAreaView>
  );
}