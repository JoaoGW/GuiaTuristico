import { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Box, Spinner, Text, VStack, View, Button } from '@gluestack-ui/themed';

import { Expand, TrendingUp, MapPinHouse, LandPlot } from 'lucide-react-native';

import { UserInfo } from '@components/UserInfo';
import { GoPremium } from '@components/GoPremium';
import { CurrentStatusBar } from '@components/CurrentStatusBar';
import { HomeDestinations } from '@components/Home/Destinations';
import { Maps } from '@components/Maps/Maps';
import { LocalFetchError } from '@components/Errors/LocalFetchError';
import { ButtonSelect } from '@components/Buttons/ButtonSelect';

import { LocationContext } from '@contexts/requestDeviceLocation';

import { AuthNavigationProp } from '@routes/auth.routes';

import { Place } from '../../@types/PlacesTypes';

export function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState<string>("Global");
  
  const { location } = useContext(LocationContext);
  const navigation = useNavigation<AuthNavigationProp>();

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!location) return;

      setLoading(true);

      try {
        const response = await fetch(
          `https://guia-turistico-alpha.vercel.app/api/googlePlacesApi?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch nearby places');
        }

        const data = await response.json();
        
        const mappedPlaces = data.places.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          photos: place.photos,
          geometry: place.geometry,
          open_now: place.opening_hours?.open_now
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
        data={ places }
        numColumns={2}
        keyExtractor={ (item) => item.id }
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
              <Button
                position="absolute"
                top={2}
                right={2}
                bg="#e9ad2d"
                px={8}
                py={2}
                borderRadius={5}
                onPress={ () => { navigation.navigate('MapsExpanded', { places, loading }); } }
                style={{ padding: 10 }}
              >
                <Expand color="white" />
              </Button>
            </Box>
            <View flexDirection="column" my={6} px={6}>
              <View flexDirection="row">
                <TrendingUp color="black" size={30} style={{ marginRight: 8 }} />
                <Text fontSize="$2xl" fontWeight="$bold" color="$black" mb={15}>
                  Destinos Populares
                </Text>
              </View>
              <View flexDirection="row">
                <ButtonSelect
                  isSelected={isSelected === "Global"}
                  objective={() => setIsSelected("Global")}
                  text="Seleção Global"
                  icon={LandPlot}
                  style={{ marginRight: 8 }}
                />
                <ButtonSelect
                  isSelected={isSelected === "Proximos"}
                  objective={() => setIsSelected("Proximos")}
                  text="Próximos de Mim"
                  icon={MapPinHouse}
                />
              </View>
            </View>
          </VStack>
        }
        renderItem={({ item }) => (
          <Box flex={1} px={4} py={2}>
            { location && 
              <HomeDestinations item={item} userLocation={{ coords: location.coords }} currentScreen="Home" />
            }
          </Box>
        )}
        ListEmptyComponent={
          <Box>
            {
              !loading ? <LocalFetchError /> : <Spinner size="large" color="#e9ad2d" my={25} />
            }
          </Box>
        }
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