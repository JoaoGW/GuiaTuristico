import { RouteProp, useRoute } from "@react-navigation/native";

import { View } from "@gluestack-ui/themed";

import DestinationData from '@data/destinations.json';

import { ImageCarousel } from "@components/ImageCarousel";

import { GlobalPlaces } from "../../@types/GlobalPlacesTypes";

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
    accommodation: item.accommodation ?? { budget: '', midRange: '', luxury: '' },
    foodSpecialties: item.foodSpecialties ?? [],
    tips: item.tips ?? [],
    safety: item.safety ?? 0,
    familyFriendly: item.familyFriendly ?? false,
    tags: item.tags ?? [],
  };

  return (
    <View>
      <ImageCarousel images={ destinationInfo.imagesUrlCarousel }/>
    </View>
  )
}