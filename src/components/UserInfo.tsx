import React from 'react';
import { Text, HStack, VStack, Image } from '@gluestack-ui/themed';
import { loadImage } from '@utils/imageLoader';

export function UserInfo() {
  return (
    <>
      <Text fontSize={'$sm'} fontWeight={'$bold'} textAlign='left'> Welcome Back, </Text>
      <HStack mt={-9} mb={15} alignItems="center">
        <VStack flex={1}>
          <Text fontSize="$lg" fontWeight="$bold" textAlign='left'> Usuário Default </Text>
          <Text fontSize={'$sm'} fontWeight={'$semibold'} color="$gray500" textAlign='left'> Free User • Since 2024 </Text>
        </VStack>
        <Image source={loadImage('profile.png')} alt='User photo' width={60} height={60} borderRadius={25} ml={'auto'} />
      </HStack>
    </>
  )
}