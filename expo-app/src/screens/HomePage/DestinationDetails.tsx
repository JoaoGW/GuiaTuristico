import { SafeAreaView, StatusBar, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import CountryFlag from "react-native-country-flag";

import { View, Text, Box } from "@gluestack-ui/themed";

import { CarouselImages } from "@components/CarouselImages";
import { IconButton } from "@components/Buttons/IconButton";
import { CategoryBadges } from "@components/Badges/CategoryBadges";

import { 
  Car, 
  Cloud, 
  Home, 
  Info, 
  Map, 
  Shield, 
  Tag, 
  Utensils, 
  Star, 
  ArrowLeft, 
  Heart, 
  Share
} from "lucide-react-native";

import DestinationData from '@data/destinations.json';

import { AuthNavigationProp } from "@routes/auth.routes";

import { GlobalPlaces } from "../../../@types/GlobalPlacesTypes";

type DestinationRouteProp = RouteProp<{ params: { destinationId: number } }, 'params'>;

export function DestinationDetails(){
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<DestinationRouteProp>();
  const { destinationId } = route.params;

  const item = DestinationData.find((item: any) => String(item.id) === String(destinationId));
  if (!item) {
    navigation.goBack();
    return null;
  }
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
      <View position="relative">
        <CarouselImages images={ destinationInfo.imagesUrlCarousel } />
        <View 
          position="absolute" 
          top="$16" 
          left="$4" 
          right="$4" 
          flexDirection="row" 
          justifyContent="space-between"
          zIndex={10}
        >
          <View>
            <IconButton 
              icon={ ArrowLeft }
              iconColor="black" 
              iconSize="xl"
              buttonBgColor="#ffffffee"
              buttonFunctionality={ () => navigation.goBack() }
              styles={{ width: 40, borderRadius: '100%' }}
            />
          </View>
          <View flexDirection="row" gap="$2">
            <IconButton 
              icon={ Heart }
              iconColor="red" 
              iconSize="xl"
              buttonBgColor="#e8e8e89c"
              buttonFunctionality={ () => navigation.goBack() }
              styles={{ width: 40, borderRadius: '100%', marginRight: 10 }}
            />
            <IconButton 
              icon={ Share }
              iconColor="white" 
              iconSize="xl"
              buttonBgColor="#e8e8e89c"
              buttonFunctionality={ () => navigation.goBack() }
              styles={{ width: 40, borderRadius: '100%' }}
            />
          </View>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ marginBottom: 30 }}>
          <Box p="$6" w={"100%"}>
            <View flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text fontSize="$3xl" fontWeight="bold" color="#2752B7" mb="$6">{ destinationInfo.title }</Text>
              <CountryFlag isoCode={ destinationInfo.countryCode } size={25} style={{ marginBottom: 20 }}/>
            </View>
            <Text fontSize="$md" fontWeight="$bold" color="#000" mb="$6">{ destinationInfo.description }</Text>
            <View flexDirection="column">
              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Info size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="bold" color="#2752B7" ml="$4">Informações Gerais</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">País:</Text> { destinationInfo.country }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Continente:</Text> { destinationInfo.continent }</Text>
                  <View flexDirection="row" alignContent="center">
                    <Text fontSize="$lg"><Text fontWeight="$bold">Classificação:</Text>
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={18}
                          color="#FFD700"
                          fill={index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0"}
                          stroke={index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0"}
                        />
                      ))}
                      ({ destinationInfo.rating })
                    </Text>
                  </View>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Custo médio:</Text> { destinationInfo.averageCost }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Moeda:</Text> { destinationInfo.currency }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Idioma:</Text> { destinationInfo.language }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Fuso horário:</Text> { destinationInfo.timeZone }</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Cloud size={40} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Clima</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Melhor época para visitar:</Text> {destinationInfo.bestTimeToVisit}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Clima:</Text> {destinationInfo.climate}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Temperatura máxima:</Text> {destinationInfo.temperature.max}°C</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Map size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Atrações e Atividades</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Atrações:</Text> {destinationInfo.attractions.join(', ')}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Atividades:</Text> {destinationInfo.activities.join(', ')}</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Car size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Transporte</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Transportes:</Text> {destinationInfo.transportation.join(', ')}</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Home size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Acomodações</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações Simples:</Text> {destinationInfo.accommodation.simples}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações de Semi-Luxo:</Text> {destinationInfo.accommodation.semiLuxo}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações de Luxo:</Text> {destinationInfo.accommodation.luxo}</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Acomodações AirBnB:</Text> {destinationInfo.accommodation.airbnb}</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Utensils size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Gastronomia</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Especialidades culinárias:</Text> { destinationInfo.foodSpecialties.join(', ') }</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Shield size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Dicas e Segurança</Text>
                </View>
                <View flexDirection="column">
                  <Text fontSize="$lg"><Text fontWeight="$bold">Dicas:</Text> { destinationInfo.tips.join(', ') }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Segurança:</Text> { destinationInfo.safety }</Text>
                  <Text fontSize="$lg"><Text fontWeight="$bold">Amigável para famílias:</Text> { destinationInfo.familyFriendly ? 'Sim' : 'Não' }</Text>
                </View>
              </Box>

              <Box mb="$8">
                <View flexDirection="row" alignItems="center" mb="$4">
                  <Tag size={35} color="#2752B7" style={{ marginRight: -10 }} />
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7" ml="$4">Tags</Text>
                </View>
                <View flexDirection="row" flexWrap="wrap" gap={8}>
                  { destinationInfo.tags.map((data, index) => (
                    <CategoryBadges key={ index } iconSize={22} text={ data } />
                  )) }
                </View>
              </Box>
            </View>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}