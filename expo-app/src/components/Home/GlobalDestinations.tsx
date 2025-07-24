import { useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Box, Text, View, HStack, Image } from '@gluestack-ui/themed';

import { AuthNavigationProp } from '@routes/auth.routes';

import { GlobalPlaces } from '../../../@types/GlobalPlacesTypes';

import Default from '@assets/400x300.svg';

export function GlobalDestinations({ id, title, imageUrl }: GlobalPlaces) {
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <Pressable onPress={ () => navigation.navigate("DestinationDetail", { destinationId: id }) }>
      <Box borderRadius={10} padding={4}>
        { imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            alt={ title }
            onError={() => setImageError(true)}
            w="100%"
            h={120}
            borderRadius={10}
            marginBottom={10}
            borderWidth={2}
            borderColor="#2752B7"
          />
        ) : (
          <Default width="100%" height={120} style={{ borderRadius: 10, marginBottom: 20 }} />
        )}
        <View flexDirection='column'>
          <View flexDirection="column">
            <HStack justifyContent="space-between" alignItems="center" mb={10}>
              <Text
                fontSize="$lg"
                fontWeight="$bold"
                color="$textDark"
                ellipsizeMode="tail"
                maxWidth="80%"
                margin="auto"
              >
                { title }
              </Text>
            </HStack>
          </View>
        </View>
      </Box>
    </Pressable>
  );
}