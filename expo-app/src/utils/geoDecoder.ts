/**
 * Performs reverse geocoding using the Nominatim API to retrieve location details
 * such as city and neighborhood based on latitude and longitude coordinates.
 *
 * @param latitude - The latitude of the location to reverse geocode.
 * @param longitude - The longitude of the location to reverse geocode.
 * @returns A promise that resolves to an object containing the city and neighborhood.
 *          If the city or neighborhood cannot be determined, default values are provided.
 * @throws An error if the request to the Nominatim API fails or if the response is invalid.
 *
 * @example
 * ```typescript
 * const { city, neighborhood } = await reverseGeocodeWithNominatim(40.7128, -74.0060);
 * console.log(city); // e.g., "New York"
 * console.log(neighborhood); // e.g., "Manhattan"
 * ```
 */
export async function reverseGeocodeWithNominatim(latitude: number, longitude: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    const city = data.address?.city || data.address?.town || data.address?.village || 'Cidade desconhecida';
    const neighborhood = data.address?.suburb || data.address?.neighbourhood || 'Bairro desconhecido';

    return { city, neighborhood };
  } catch (error) {
    console.error('Erro na geocodificação reversa:', error);
    throw error;
  }
}