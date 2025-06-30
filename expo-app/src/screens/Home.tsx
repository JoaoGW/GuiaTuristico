import { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Box, Spinner, Text, VStack, View } from '@gluestack-ui/themed';

import { UserInfo } from '@components/UserInfo';
import { GoPremium } from '@components/GoPremium';
import { CurrentStatusBar } from '@components/CurrentStatusBar';
import { HomeDestinations } from '@components/Home/Destinations';
import { Maps } from '@components/Maps/Maps';

import { LocationContext } from '@contexts/requestDeviceLocation';

import { TrendingUp } from 'lucide-react-native';

interface Place {
  id: string;
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

export function Home() {
  const { location } = useContext(LocationContext);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!location) return;

      setLoading(true);

      try {
        const response = await fetch(
          `http://<SEU-IP-AQUI>:3000/api/googlePlacesApi?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch nearby places');
        }

        const data = await response.json();

        // Map the response to include an `id` field for FlatList
        const mappedPlaces = data.places.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          photos: place.photos,
          geometry: place.geometry,
        }));

        setPlaces(mappedPlaces || []);
      } catch (error) {
        console.error('Error fetching nearby places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [location]);

  return (
    <Box flex={1} bg="#FDFDFD">
      <FlatList
        data={places}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <VStack space="md">
            <CurrentStatusBar />

            <UserInfo />

            <Box
              height={200}
              mb={15}
              mx={6}
              borderRadius={15}
              overflow="hidden"
              borderWidth={2}
              borderColor="#e9ad2d"
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.2}
              shadowRadius={4}
            >
              <Maps />
            </Box>

            <View flexDirection="row" alignItems="center" my={6} px={6}>
              <TrendingUp color="black" size={30} style={{ marginRight: 8 }} />
              <Text fontSize="$2xl" fontWeight="$bold" color="$black">
                Destinos Populares
              </Text>
            </View>
          </VStack>
        }
        renderItem={({ item }) => (
          <Box flex={1} px={4} py={2}>
            { loading 
                ? <Spinner size="large" color="#e9ad2d"/>
                : location && <HomeDestinations item={item} userLocation={{ coords: location.coords }} /> 
            }
          </Box>
        )}
        ListFooterComponent={
          <Box px={6} my={12}>
            <GoPremium />
          </Box>
        }
        contentContainerStyle={{ paddingBottom: 35 }}
      />
    </Box>
  );
}