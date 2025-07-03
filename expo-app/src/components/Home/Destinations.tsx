import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Box, Text, View, HStack, Image } from '@gluestack-ui/themed';

import { Star } from 'lucide-react-native';

import { Place } from '../../../@types/PlacesTypes';

import Default from '@assets/400x300.svg'

interface DestinationProps {
  item: Place,
  userLocation: {
    coords: {
      latitude: number;
      longitude: number;
    };
  },
  currentScreen: "Home" | "MapsExpanded" | null
}

export function HomeDestinations({ item, userLocation, currentScreen }: DestinationProps) {
  const [imageError, setImageError] = useState(false);

  const photoUrl = item.photos?.[0]
    ? `http://192.168.1.156:3000/api/googlePhotoProxy?photo_reference=${item.photos[0].photo_reference}`
    : null;

  const calculateDistance = () => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const lat1 = userLocation.coords.latitude;
    const lon1 = userLocation.coords.longitude;
    const lat2 = item.geometry.location.lat;
    const lon2 = item.geometry.location.lng;

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1); // Distance in km
  };

  const styles = StyleSheet.create({
    homeStyle: {
      flexDirection: "column", 
      gap: 8
    },
    mapsExpandedStyle: {
      flexDirection: "row"
    },
    homeBoxStyle: {
      borderRadius: 10,
      padding: 4
    },
    mapsExpandedBoxStyle: {
      flexDirection: 'row',
      gap: 10,
      borderRadius: 10,
      padding: 4
    }
  })

  return (
    <Box style={ currentScreen === "Home" ? styles.homeBoxStyle : styles.mapsExpandedBoxStyle }>
      { photoUrl && !imageError ? (
       <Image
        source={{ uri: photoUrl }}
        alt={ item.name }
        onError={ () => setImageError(true) }
        w={ currentScreen === "Home" ? "100%" : "35%" }
        h={120}
        borderRadius={10}
        marginBottom={15}
        borderWidth={2}
        borderColor='#E9AD2D'
      />
      ) : (
        <Default width="100%" height={120} style={{ borderRadius: 10, marginBottom: 20 }} />
      )}
      <View style={ currentScreen === "Home" ? styles.homeStyle : styles.mapsExpandedStyle }>
        <View flexDirection='column' paddingTop="5%">
          <HStack justifyContent="space-between" alignItems="center">
            <View flexDirection='row' alignItems='center' justifyContent='space-between' w="100%" mb={20}>
              <Text
                fontSize="$lg"
                fontWeight="$bold"
                color="$textDark"
                numberOfLines={1}
                ellipsizeMode="tail"
                maxWidth="70%"
              >
                { item.name }
              </Text>
              <Text fontSize="$sm" color="$gray500">
                { calculateDistance() } km
              </Text>
            </View>
          </HStack>
          <HStack justifyContent="center" space="xs" alignItems="center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={ index }
                size={18}
                color="#FFD700"
                fill={ index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0" }
                stroke={ index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0" }
              />
            ))}
            <Text ml={5}>({item.rating || '0.0'})</Text>
          </HStack>
        </View>
      </View>
    </Box>
  );
}