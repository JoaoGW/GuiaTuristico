import { useState } from 'react';
import { Pressable } from 'react-native';

import { Box, Text, View, HStack, Image } from '@gluestack-ui/themed';

import { GlobalPlaces } from '../../../@types/GlobalPlacesTypes';

import Default from '@assets/400x300.svg';

export function GlobalDestinations({ title, imageUrl }: GlobalPlaces) {
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable>
      <Box borderRadius={10} padding={4}>
        { imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            alt={ title }
            onError={() => setImageError(true)}
            w="100%"
            h={120}
            borderRadius={10}
            marginBottom={15}
            borderWidth={2}
            borderColor="#E9AD2D"
          />
        ) : (
          <Default width="100%" height={120} style={{ borderRadius: 10, marginBottom: 20 }} />
        )}
        <View flexDirection='column' gap={8}>
          <View flexDirection="column">
            <HStack justifyContent="space-between" alignItems="center" mb={7}>
              <Text
                fontSize="$lg"
                fontWeight="$bold"
                color="$textDark"
                numberOfLines={1}
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