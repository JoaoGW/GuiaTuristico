import { SafeAreaView, StatusBar, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import ReactCountryFlag from "react-country-flag"

import { View, Text, Box, VStack, HStack, Icon } from "@gluestack-ui/themed";

import { CarouselImages } from "@components/CarouselImages";

import DestinationData from '@data/destinations.json';

import { GlobalPlaces } from "../../@types/GlobalPlacesTypes";
import { Car, Cloud, Home, Info, Map, Shield, Tag, Utensils, Star } from "lucide-react-native";

type DestinationRouteProp = RouteProp<{ params: { destinationId: number } }, 'params'>;

export function DestinationDetails(){
  const route = useRoute<DestinationRouteProp>();
  const { destinationId } = route.params;

  const item = DestinationData.find((item: any) => String(item.id) === String(destinationId))!;
  const destinationInfo: GlobalPlaces = {
    ...item,
    id: Number(item.id),
    imageUrl: item.image || '',
    imagesUrlCarousel: item.imagesUrlCarousel || [],
    title: item.title ?? '',
    description: item.description ?? '',
    country: item.country ?? '',
    countryCode: item.countryCode ?? '',
    continent: item.continent ?? '',
    rating: item.rating ?? 0,
    averageCost: item.averageCost ?? '',
    currency: item.currency ?? '',
    language: item.language ?? '',
    timeZone: item.timeZone ?? '',
    bestTimeToVisit: item.bestTimeToVisit ?? '',
    climate: item.climate ?? '',
    temperature: item.temperature ?? { min: 0, max: 0 },
    coordinates: item.coordinates ?? { latitude: 0, longitude: 0 },
    attractions: item.attractions ?? [],
    activities: item.activities ?? [],
    transportation: item.transportation ?? [],
    accommodation: item.accommodation ?? { simples: '', semiLuxo: '', luxo: '', airbnb: '' },
    foodSpecialties: item.foodSpecialties ?? [],
    tips: item.tips ?? [],
    safety: item.safety ?? 0,
    familyFriendly: item.familyFriendly ?? false,
    tags: item.tags ?? [],
  };

  return (
    <View flex={1}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <CarouselImages images={ destinationInfo.imagesUrlCarousel } />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ marginBottom: 50 }}>
          <Box p="$6" w={"100%"}>
            <Text fontSize="$3xl" fontWeight="bold" color="#E9AD2D" mb="$6">{ destinationInfo.title }</Text>
            <Text fontSize="$lg" color="#E9AD2D" mb="$6">{ destinationInfo.description }</Text>
            <VStack space="lg">
              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Info size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="bold" color="#E9AD2D" ml="$4">Informações Gerais</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">País:</Text> { destinationInfo.country }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Continente:</Text> { destinationInfo.continent }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Classificação:</Text>
                    <Star
                      size={14}
                      color="#FFD700"
                      fill={ destinationInfo.rating < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0" }
                      stroke={ destinationInfo.rating < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0" }
                      style={{ marginHorizontal: 30 }}
                    />
                    ({ destinationInfo.rating })
                  </Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Custo médio:</Text> { destinationInfo.averageCost }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Moeda:</Text> { destinationInfo.currency }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Idioma:</Text> { destinationInfo.language }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Fuso horário:</Text> { destinationInfo.timeZone }</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Cloud size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Clima</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Melhor época para visitar:</Text> {destinationInfo.bestTimeToVisit}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Clima:</Text> {destinationInfo.climate}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Temperatura máxima:</Text> {destinationInfo.temperature.max}°C</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Map size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Atrações e Atividades</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Atrações:</Text> {destinationInfo.attractions.join(', ')}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Atividades:</Text> {destinationInfo.activities.join(', ')}</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Car size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Transporte</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Transportes:</Text> {destinationInfo.transportation.join(', ')}</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Home size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Acomodações</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações Simples:</Text> {destinationInfo.accommodation.simples}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações de Semi-Luxo:</Text> {destinationInfo.accommodation.semiLuxo}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações de Luxo:</Text> {destinationInfo.accommodation.luxo}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações AirBnB:</Text> {destinationInfo.accommodation.airbnb}</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Utensils size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Gastronomia</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Especialidades culinárias:</Text> {destinationInfo.foodSpecialties.join(', ')}</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Shield size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Dicas e Segurança</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Dicas:</Text> {destinationInfo.tips.join(', ')}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Segurança:</Text> {destinationInfo.safety}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Amigável para famílias:</Text> {destinationInfo.familyFriendly ? 'Sim' : 'Não'}</Text>
                </VStack>
              </Box>

              <Box mb="$6">
                <HStack alignItems="center" mb="$4">
                  <Tag size="md" color="#E9AD2D" />
                  <Text fontSize="$xl" fontWeight="$bold" color="#E9AD2D" ml="$4">Tags</Text>
                </HStack>
                <VStack space="md">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Tags:</Text> {destinationInfo.tags.join(', ')}</Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}