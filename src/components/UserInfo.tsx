import { Text, HStack, VStack, Image, View } from '@gluestack-ui/themed';
import { loadImage } from '@utils/imageLoader';

export function UserInfo() {
  return (
    <View p={10} mt={10}>
      <Text fontSize="$lg" textAlign="left" mt={5}>
        Bem-Vindo(a) de volta,
      </Text>
      <HStack mt={-9} mb={15} alignItems="center">
        <VStack flex={1} pt={20}>
          <Text fontSize="$2xl" fontWeight="$bold" textAlign="left">
            Usuário Genérico
          </Text>
          <Text fontSize="$lg" fontWeight="$semibold" color="$gray500" textAlign="left">
            Usuário FREE • Desde 2025
          </Text>
        </VStack>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFEbLl5SnPQ7UWguwqz8NINfXZCekj3nSY9Q&s' }}
          alt="User photo"
          width={80}
          height={80}
          borderRadius={40}
          ml="auto"
          borderWidth={3}
          borderColor="#e9ad2d"
        />
      </HStack>
    </View>
  );
}