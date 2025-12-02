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
    <View flex={1} bg="#F9FAFB">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View position="relative">
        <CarouselImages images={ destinationInfo.imagesUrlCarousel } />
        <View 
          position="absolute" 
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)"
        />
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
              iconColor="white" 
              iconSize="xl"
              buttonBgColor="rgba(0, 0, 0, 0.4)"
              buttonFunctionality={ () => navigation.goBack() }
              styles={{ width: 45, height: 45, borderRadius: '100%' }}
            />
          </View>
          <View flexDirection="row" gap="$3">
            <IconButton 
              icon={ Heart }
              iconColor="white" 
              iconSize="xl"
              buttonBgColor="rgba(0, 0, 0, 0.4)"
              buttonFunctionality={ () => navigation.goBack() }
              styles={{ width: 45, height: 45, borderRadius: '100%' }}
            />
            <IconButton 
              icon={ Share }
              iconColor="white" 
              iconSize="xl"
              buttonBgColor="rgba(0, 0, 0, 0.4)"
              buttonFunctionality={ () => navigation.goBack() }
              styles={{ width: 45, height: 45, borderRadius: '100%' }}
            />
          </View>
        </View>
        <View 
          position="absolute" 
          bottom="$10" 
          left="$6" 
          right="$6"
          zIndex={10}
        >
          <View flexDirection="row" alignItems="center" justifyContent="space-between" mb="$2">
            <Text fontSize="$3xl" fontWeight="$bold" color="#fff" style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 10 }}>{ destinationInfo.title }</Text>
            <CountryFlag isoCode={ destinationInfo.countryCode } size={32} />
          </View>
          <View flexDirection="row" alignItems="center" gap="$2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={18}
                color="#FFD700"
                fill={index < Math.floor(item.rating) ? "#FFD700" : "transparent"}
                stroke="#FFD700"
              />
            ))}
            <Text fontSize="$md" color="#fff" fontWeight="$semibold" ml="$1">({ destinationInfo.rating })</Text>
          </View>
        </View>
      </View>
      <View bg="#F9FAFB" flex={1}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box px="$4" pt="$6" pb="$20">
          <View 
            bg="#fff" 
            borderRadius="$2xl" 
            p="$5" 
            mb="$4"
            shadowColor="#000"
            shadowOpacity={0.08}
            shadowRadius={12}
            elevation={3}
          >
            <Text fontSize="$lg" color="#374151" lineHeight="$xl">{ destinationInfo.description }</Text>
          </View>
            <View flexDirection="column">
              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#EEF2FF" borderRadius="$full" p="$3" mr="$3">
                    <Info size={24} color="#2752B7" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Informações Gerais</Text>
                </View>
                <View flexDirection="column" gap="$3">
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">País</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{ destinationInfo.country }</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Continente</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{ destinationInfo.continent }</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Custo médio</Text>
                    <Text fontSize="$md" color="#2752B7" fontWeight="$bold">{ destinationInfo.averageCost }</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Moeda</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{ destinationInfo.currency }</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Idioma</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{ destinationInfo.language }</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Fuso horário</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{ destinationInfo.timeZone }</Text>
                  </View>
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#DBEAFE" borderRadius="$full" p="$3" mr="$3">
                    <Cloud size={24} color="#2752B7" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Clima</Text>
                </View>
                <View flexDirection="column" gap="$3">
                  <View py="$2">
                    <Text fontSize="$sm" color="#6B7280" fontWeight="$medium" mb="$1">Melhor época para visitar</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{destinationInfo.bestTimeToVisit}</Text>
                  </View>
                  <View py="$2">
                    <Text fontSize="$sm" color="#6B7280" fontWeight="$medium" mb="$1">Tipo de clima</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{destinationInfo.climate}</Text>
                  </View>
                  <View py="$2">
                    <Text fontSize="$sm" color="#6B7280" fontWeight="$medium" mb="$1">Temperatura máxima</Text>
                    <Text fontSize="$2xl" color="#2752B7" fontWeight="$bold">{destinationInfo.temperature.max}°C</Text>
                  </View>
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#FEF3C7" borderRadius="$full" p="$3" mr="$3">
                    <Map size={24} color="#D97706" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Atrações e Atividades</Text>
                </View>
                <View flexDirection="column" gap="$3">
                  <View>
                    <Text fontSize="$sm" color="#6B7280" fontWeight="$medium" mb="$2">Principais atrações</Text>
                    <View flexDirection="row" flexWrap="wrap" gap="$2">
                      {destinationInfo.attractions.map((attraction, idx) => (
                        <View key={idx} bg="#F3F4F6" borderRadius="$lg" px="$3" py="$2">
                          <Text fontSize="$sm" color="#374151" fontWeight="$medium">{attraction}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View>
                    <Text fontSize="$sm" color="#6B7280" fontWeight="$medium" mb="$2">Atividades disponíveis</Text>
                    <View flexDirection="row" flexWrap="wrap" gap="$2">
                      {destinationInfo.activities.map((activity, idx) => (
                        <View key={idx} bg="#EEF2FF" borderRadius="$lg" px="$3" py="$2">
                          <Text fontSize="$sm" color="#4F46E5" fontWeight="$medium">{activity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#DCFCE7" borderRadius="$full" p="$3" mr="$3">
                    <Car size={24} color="#16A34A" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Transporte</Text>
                </View>
                <View flexDirection="row" flexWrap="wrap" gap="$2">
                  {destinationInfo.transportation.map((transport, idx) => (
                    <View key={idx} bg="#F0FDF4" borderRadius="$lg" px="$4" py="$2" borderWidth={1} borderColor="#BBF7D0">
                      <Text fontSize="$md" color="#16A34A" fontWeight="$semibold">{transport}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#FCE7F3" borderRadius="$full" p="$3" mr="$3">
                    <Home size={24} color="#DB2777" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Acomodações</Text>
                </View>
                <View flexDirection="column" gap="$3">
                  <View flexDirection="row" justifyContent="space-between" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Simples</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{destinationInfo.accommodation.simples}</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Semi-Luxo</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{destinationInfo.accommodation.semiLuxo}</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" py="$2" borderBottomWidth={1} borderBottomColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Luxo</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{destinationInfo.accommodation.luxo}</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" py="$2">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">AirBnB</Text>
                    <Text fontSize="$md" color="#1F2937" fontWeight="$semibold">{destinationInfo.accommodation.airbnb}</Text>
                  </View>
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#FED7AA" borderRadius="$full" p="$3" mr="$3">
                    <Utensils size={24} color="#EA580C" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Gastronomia</Text>
                </View>
                <View flexDirection="row" flexWrap="wrap" gap="$2">
                  {destinationInfo.foodSpecialties.map((food, idx) => (
                    <View key={idx} bg="#FFF7ED" borderRadius="$lg" px="$3" py="$2" borderWidth={1} borderColor="#FED7AA">
                      <Text fontSize="$sm" color="#EA580C" fontWeight="$medium">{food}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#DBEAFE" borderRadius="$full" p="$3" mr="$3">
                    <Shield size={24} color="#0284C7" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Dicas e Segurança</Text>
                </View>
                <View flexDirection="column" gap="$3">
                  <View>
                    <Text fontSize="$sm" color="#6B7280" fontWeight="$medium" mb="$2">Dicas importantes</Text>
                    <View flexDirection="column" gap="$2">
                      {destinationInfo.tips.map((tip, idx) => (
                        <View key={idx} flexDirection="row" alignItems="flex-start">
                          <Text fontSize="$md" color="#2752B7" mr="$2">•</Text>
                          <Text fontSize="$md" color="#374151" flex={1}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$3" borderTopWidth={1} borderTopColor="#F3F4F6">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Nível de segurança</Text>
                    <Text fontSize="$lg" color="#2752B7" fontWeight="$bold">{ destinationInfo.safety }/5</Text>
                  </View>
                  <View flexDirection="row" justifyContent="space-between" alignItems="center" py="$2">
                    <Text fontSize="$md" color="#6B7280" fontWeight="$medium">Amigável para famílias</Text>
                    <View bg={destinationInfo.familyFriendly ? "#DCFCE7" : "#FEE2E2"} borderRadius="$full" px="$3" py="$1">
                      <Text fontSize="$sm" color={destinationInfo.familyFriendly ? "#16A34A" : "#DC2626"} fontWeight="$semibold">
                        { destinationInfo.familyFriendly ? 'Sim' : 'Não' }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View 
                bg="#fff" 
                borderRadius="$2xl" 
                p="$5" 
                mb="$4"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={3}
              >
                <View flexDirection="row" alignItems="center" mb="$5">
                  <View bg="#FEF3C7" borderRadius="$full" p="$3" mr="$3">
                    <Tag size={24} color="#CA8A04" />
                  </View>
                  <Text fontSize="$xl" fontWeight="$bold" color="#1F2937">Categorias</Text>
                </View>
                <View flexDirection="row" flexWrap="wrap" gap="$2">
                  { destinationInfo.tags.map((data, index) => (
                    <CategoryBadges key={ index } iconSize={20} text={ data } />
                  )) }
                </View>
              </View>
            </View>
          </Box>
        </ScrollView>
      </View>
    </View>
  );
}