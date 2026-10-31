import { parseCoordinates } from '../domain/coordinates';
import type { Place } from '../domain/place';
import { searchNearbyTouristAttractions } from '../infrastructure/googlePlacesClient';

export async function findNearbyPlaces(latitude?: string, longitude?: string): Promise<Place[]> {
  return searchNearbyTouristAttractions(parseCoordinates(latitude, longitude));
}
