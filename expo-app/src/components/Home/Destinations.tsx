import { useState } from 'react';
import { Box, Text, VStack, HStack, Image } from '@gluestack-ui/themed';
import { Star } from 'lucide-react-native';

import Default from '@assets/400x300.svg'

interface Place {
  name: string;
  vicinity: string;
  rating: number;
  photos?: { photo_reference: string }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface Props {
  item: Place;
  userLocation: {
    coords: {
      latitude: number;
      longitude: number;
    };
  };
}

export function HomeDestinations({ item, userLocation }: Props) {
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

  return (
    <Box borderRadius={10} p={4}>
      {photoUrl && !imageError ? (
      <Image
        source={{ uri: photoUrl }}
        alt={item.name}
        style={{ width: '100%', height: 120, borderRadius: 10, marginBottom: 20 }}
        onError={() => setImageError(true)}
      />
      ) : (
      <Default width="100%" height={120} style={{ borderRadius: 10, marginBottom: 20 }} />
      )}
      <VStack space="sm">
      <HStack justifyContent="space-between" alignItems="center">
        <Text
        fontSize="$lg"
        fontWeight="$bold"
        color="$textDark"
        numberOfLines={1}
        ellipsizeMode="tail"
        maxWidth="70%"
        >
        {item.name}
        </Text>
        <Text fontSize="$sm" color="$gray500">
        {calculateDistance()} km
        </Text>
      </HStack>
      <HStack justifyContent="center" space="xs" alignItems="center">
        {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={18}
          color="#FFD700"
          fill={index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0"}
          stroke={index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0"}
        />
        ))}
        <Text ml={5}>({item.rating || '0.0'})</Text>
      </HStack>
      </VStack>
    </Box>
  );
}