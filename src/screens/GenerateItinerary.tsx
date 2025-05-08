import { HStack, View, Image, Text } from '@gluestack-ui/themed';

import { NavigationBar } from '@components/NavigationBar';

import OpenAILogo from '@assets/OpenAI/OpenAI-black-wordmark.svg';

export function GenerateItinerary() {
  return (
    <View flex={1}>
      <View pt={70} px={20}>
        <Text fontWeight="$bold" fontSize="$2xl" textAlign='center' mb={15}>Gere o seu próximo roteiro de viagem utilizando IA!</Text>
        <HStack justifyContent='center'>
          <Text pt="4%">Powered by</Text>
          <OpenAILogo
            width={100}
            height={50}
          />
        </HStack>
      </View>

      <View p={32}>
        <Text color='$black'>Aqui será mostrado o texto de resultado da requisição que foi feita ao OpenAI GPT</Text>
      </View>

      <NavigationBar />
    </View>
  );
}