import React from 'react';
import { Box, Text, Button } from '@gluestack-ui/themed';

export function GoPremium() {
  return (
    <>
      <Box mb={10} bg="$blue300" p={1} borderRadius={10}>
        <Text color="$white" fontSize="$sm" textAlign='center' mb={2}>Get exclusive travel guides & VIP deals!</Text>
        <Button bg='$blue500' p={2} borderRadius={10}>
          <Text fontSize="$sm" fontWeight="$bold" color="$white">Upgrade to Pro</Text>
        </Button>
      </Box>
    </>
  )
}