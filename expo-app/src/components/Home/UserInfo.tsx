import { Text, Image, View } from '@gluestack-ui/themed';

export function UserInfo() {
  return (
    <View p={10} mt={20} mb={10}>
      <Text fontSize="$lg" textAlign="left" mt={5} mb={-15}>
        Olá! Seja Bem-Vindo(a),
      </Text>
      <View flexDirection='row' mb={15} alignItems="center">
        <View flexDirection='column' flex={1} pt={15}>
          <Text fontSize="$2xl" fontWeight="$bold" textAlign="left">
            Usuário Genérico
          </Text>
          <Text fontSize="$md" fontWeight="$semibold" color="$gray500" textAlign="left">
            Usuário FREE • Desde 2025
          </Text>
        </View>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFEbLl5SnPQ7UWguwqz8NINfXZCekj3nSY9Q&s' }}
          alt="User photo"
          width={100}
          height={100}
          borderRadius={40}
          ml="auto"
          borderWidth={3}
          borderColor="#2752B7"
          mt={-15}
        />
      </View>
    </View>
  );
}