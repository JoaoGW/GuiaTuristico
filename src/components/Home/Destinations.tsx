import { Box, Text, VStack, HStack, Image } from '@gluestack-ui/themed';
import { Star } from 'lucide-react-native';

export function HomeDestinations({ item }: { item: any }) {
  return (
    <Box borderRadius={10} p={4}>
      <Image
        source={item.image}
        alt={item.name}
        w="100%"
        height={120}
        borderRadius={10}
        mb={5}
      />
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            fontSize="$lg"
            fontWeight="$bold"
            color="$textDark"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text fontSize="$sm" color="$gray500">
            10 km
          </Text>
        </HStack>
        <HStack justifyContent="center" space="xs" alignItems='center'>
          {[...Array(5)].map((_, index) => (
            <Star key={index} size={18} color="#FFD700" fill="none" />
          ))}
          <Text ml={5}>(0.0)</Text>
        </HStack>
      </VStack>
    </Box>
  );
}