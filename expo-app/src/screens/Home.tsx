import { useContext, useEffect, useState, useMemo } from 'react';
import { FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Box, Spinner, Text, VStack, View, Button, ScrollView, Badge, BadgeText, BadgeIcon } from '@gluestack-ui/themed';

import { Expand, TrendingUp, MapPinHouse, LandPlot, Map, Radio } from 'lucide-react-native';

import { UserInfo } from '@components/Home/UserInfo';
import { GoPremium } from '@components/GoPremium';
import { CurrentStatusBar } from '@components/CurrentStatusBar';
import { HomeDestinations } from '@components/Home/Destinations';
import { Maps } from '@components/Maps/Maps';
import { LocalFetchError } from '@components/Errors/LocalFetchError';
import { ButtonSelect } from '@components/Buttons/ButtonSelect';
import { GlobalDestinations } from '@components/Home/GlobalDestinations';

import GlobalDestinationsData from '@data/destinations.json';

import { LocationContext } from '@contexts/requestDeviceLocation';

import { AuthNavigationProp } from '@routes/auth.routes';

import { Place } from '../../@types/PlacesTypes';

export function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState<string>("Global");

  const { location } = useContext(LocationContext);
  const navigation = useNavigation<AuthNavigationProp>();

  const fetchNearbyPlaces = useMemo(() => {
    return async () => {
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
  }, [location, places]);

  useEffect(() => {
    fetchNearbyPlaces();
  }, [fetchNearbyPlaces]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FDFDFD' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFDFD" />
      <Box flex={1} bg="#FDFDFD" mt={-75}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="md">
            <CurrentStatusBar />
            <UserInfo />
            <View flexDirection='row' ml={8}>
              <Map color="black" size={30} style={{ marginRight: 8 }} />
              <Text fontSize="$2xl" fontWeight="$bold" color="$black" mb={5}>Seu Mapa</Text>
              <Badge size="md" variant="solid" action="muted" ml={10} bgColor='$red500'>
                <BadgeText color='$white' mr={5} size='md'>Live</BadgeText>
                <BadgeIcon as={Radio} color='$white' size='md' style={{ marginLeft: 2 }} />
              </Badge>
            </View>
            <Box
              height={200}
              mb={15}
              mx={6}
              borderRadius={15}
              overflow="hidden"
              borderWidth={2}
              borderColor="#2752B7"
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
                bg="#2752B7"
                px={8}
                py={2}
                borderRadius={5}
                onPress={() => {
                  navigation.navigate('MapsExpanded', { places, loading });
                }}
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
              <View flexDirection="row" mb={10} justifyContent='center'>
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
                  text="Próximos a Mim"
                  icon={MapPinHouse}
                />
              </View>
            </View>
          </VStack>
          {
            isSelected === "Global"
              ?
              <FlatList
                data={GlobalDestinationsData}
                numColumns={2}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Box flex={1} px={4} py={2}>
                    { location && (
                      <GlobalDestinations
                        id={Number(item.id)}
                        imageUrl={item.image || ''}
                        imagesUrlCarousel={item.imagesUrlCarousel || []}
                        title={item.title || ''}
                        description={item.description || ''}
                        country={item.country || ''}
                        countryCode={item.countryCode || ''}
                        continent={item.continent || ''}
                        rating={item.rating || 0}
                        averageCost={item.averageCost || ''}
                        currency={item.currency || ''}
                        language={item.language || ''}
                        timeZone={item.timeZone || ''}
                        climate={item.climate || ''}
                        temperature={item.temperature || { min: 0, max: 0 }}
                        coordinates={item.coordinates || { latitude: 0, longitude: 0 }}
                        attractions={item.attractions || []}
                        activities={item.activities || []}
                        transportation={item.transportation || []}
                        accommodation={item.accommodation || { simples: '', semiLuxo: '', luxo: '', airbnb: '' }}
                        foodSpecialties={item.foodSpecialties || []}
                        tips={item.tips || []}
                        safety={item.safety || 0}
                        familyFriendly={item.familyFriendly ?? false}
                        bestTimeToVisit={item.bestTimeToVisit || ''}
                        tags={item.tags || []}
                      />
                    )}
                  </Box>
                )}
                ListEmptyComponent={
                  <Box>
                    {!loading ? <LocalFetchError /> : <Spinner size="large" color="#2752B7" my={25} />}
                  </Box>
                }
                ListFooterComponent={
                  <Box px={6} my={12}>
                    <GoPremium />
                  </Box>
                }
                contentContainerStyle={{ paddingBottom: 35 }}
              />
              :
              <FlatList
                data={places}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
                renderItem={({ item }) => (
                  <Box flex={1} px={4} py={2}>
                    {location && (
                      <HomeDestinations
                        item={item}
                        userLocation={{ coords: location.coords }}
                        currentScreen="Home"
                      />
                    )}
                  </Box>
                )}
                ListEmptyComponent={
                  <Box>
                    {!loading ? <LocalFetchError /> : <Spinner size="large" color="#2752B7" my={25} />}
                  </Box>
                }
                ListFooterComponent={
                  <Box px={6} my={12}>
                    <GoPremium />
                  </Box>
                }
                contentContainerStyle={{ paddingBottom: 35 }}
              />
          }
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}