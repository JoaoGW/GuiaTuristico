import React from 'react';
import { HStack, Box, Button, Text } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

export function NavigationBar() {
  return (
    <HStack flex={1} justifyContent="space-between" alignItems="center" bg="$blue500" borderRadius={20} p={4} position="absolute" bottom={10} left={0} right={0}>
      <HStack alignItems="center">
        <Button size='xs' width={'$16'} height={60} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700" >
          <MaterialIcons name='public' size={30} color={'white'} />
        </Button>
        <Text color="#fff" fontSize="$md" fontWeight="$bold" ml={10}> Discover </Text>
      </HStack>

      <Box width={1} height={"80%"} bg="#fff" mx={3} />
      <HStack space='md' alignItems='center'>
        <Button size='xs' width={55} height={55} borderRadius={50} justifyContent="center" alignContent='center' alignItems="center" bg="$blue700">
          <MaterialIcons name='home' size={27} color={'white'} > </MaterialIcons>
        </Button>
        <Button size='xs' width={55} height={55} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
          <MaterialIcons name='search' size={27} color={'white'}></MaterialIcons>
        </Button>
        <Button size='xs' width={55} height={55} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
          <MaterialIcons name='settings' size={27} color={'white'}></MaterialIcons>
        </Button>
      </HStack>
    </HStack>
  )
}