import React from 'react';
import { Box, Text, Image } from '@gluestack-ui/themed';

interface DestinationProps {
  item: any
}

export function HomeDestinations(props: DestinationProps) {
  return (
    <Box flex={1} m={2} flexDirection='column' bg="$gray200" borderRadius={10} overflow="hidden">
      <Image source={props.item.image} alt='Pictures Destinations' borderRadius={10} size="2xl" height={100} />
      <Box p={3}>
        <Text fontSize="$sm" fontWeight="$bold" textAlign='center' mb={1}>{props.item.name}</Text>
      </Box>
    </Box>
  )
}