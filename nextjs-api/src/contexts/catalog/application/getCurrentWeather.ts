import { parseCoordinates } from '../domain/coordinates';
import { fetchCurrentWeather } from '../infrastructure/weatherApiClient';

export async function getCurrentWeather(latitude?: string, longitude?: string) {
  return fetchCurrentWeather(parseCoordinates(latitude, longitude));
}
