import React from 'react';
import { HStack, VStack, Text } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

export function CurrentStatusBar() {
  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" p="$4" width='95%' mt={10}>
        <VStack flex={1}>
          <HStack alignItems="center">
            <MaterialIcons name='place' size={24} color="$gray600" />
            <Text fontSize="$md" fontWeight="$bold" ml="$1">São Paulo, Brazil</Text>
          </HStack>
        </VStack>
        <MaterialIcons name='notifications' size={24} color={"$gray600"} />
      </HStack>
    </>
  )
}