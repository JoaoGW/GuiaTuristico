import { Box, Text, VStack, HStack, Image } from '@gluestack-ui/themed';
import { Star } from 'lucide-react-native';

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

  const thumbnail =
    item.photos && item.photos.length > 0
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=YOUR_GOOGLE_PLACES_API_KEY`
      : 'https://via.placeholder.com/400';

  return (
    <Box borderRadius={10} p={4}>
      <Image
        source={{ uri: thumbnail }}
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
            maxWidth="70%"
          >
            {item.name}
          </Text>
          <Text fontSize="$sm" color="$gray500">
            { calculateDistance() } km
          </Text>
        </HStack>
        <HStack justifyContent="center" space="xs" alignItems="center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={18}
              color="#FFD700"
              fill={index < Math.round(item.rating) ? "#FFD700" : "#E0E0E0"}
              stroke={index < Math.round(item.rating) ? "#FFD700" : "#E0E0E0"}
            />
          ))}
          <Text ml={5}>({item.rating || '0.0'})</Text>
        </HStack>
      </VStack>
    </Box>
  );
}