import { AppError } from '@/shared/errors';
import { fetchUpstream } from '@/shared/http';
import type { Coordinates } from '../domain/coordinates';
import type { Place } from '../domain/place';

// Camada anticorrupção: só este arquivo conhece o formato da Places API (legada) e a chave.
interface GooglePlace {
  place_id?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  icon?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  opening_hours?: { open_now?: boolean };
  photos?: { photo_reference?: string }[];
}

interface GoogleNearbySearchResponse {
  status?: string;
  results?: GooglePlace[];
  error_message?: string;
}

const PLACES_UNAVAILABLE = 'Não foi possível buscar lugares próximos agora.';
const PHOTO_UNAVAILABLE = 'Não foi possível carregar a foto agora.';

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new AppError(503, 'Serviço de lugares indisponível.', 'PLACES_UNAVAILABLE', {
      cause: 'GOOGLE_PLACES_API_KEY não configurada'
    });
  }
  return apiKey;
}

function toPlace(place: GooglePlace): Place | null {
  const lat = place.geometry?.location?.lat;
  const lng = place.geometry?.location?.lng;
  if (!place.name || typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  const photoReference = place.photos?.[0]?.photo_reference;

  return {
    place_id: place.place_id ?? '',
    name: place.name,
    vicinity: place.vicinity ?? '',
    rating: typeof place.rating === 'number' ? place.rating : null,
    icon: place.icon ?? null,
    geometry: { location: { lat, lng } },
    opening_hours: typeof place.opening_hours?.open_now === 'boolean' ? { open_now: place.opening_hours.open_now } : null,
    photos: photoReference ? [{ photo_reference: photoReference }] : []
  };
}

export async function searchNearbyTouristAttractions({ latitude, longitude }: Coordinates): Promise<Place[]> {
  const params = new URLSearchParams({
    location: `${latitude},${longitude}`,
    radius: '1500',
    type: 'tourist_attraction',
    key: getApiKey()
  });

  const response = await fetchUpstream(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`,
    PLACES_UNAVAILABLE,
    'PLACES_UNAVAILABLE'
  );
  const data = (await response.json().catch(() => ({}))) as GoogleNearbySearchResponse;

  if (data.status === 'ZERO_RESULTS') {
    return [];
  }

  if (!response.ok || data.status !== 'OK' || !Array.isArray(data.results)) {
    throw new AppError(502, PLACES_UNAVAILABLE, 'PLACES_UNAVAILABLE', {
      cause: `Google Places status=${data.status ?? response.status} ${data.error_message ?? ''}`
    });
  }

  return data.results.map(toPlace).filter((place): place is Place => place !== null);
}

export async function fetchPlacePhoto(photoReference: string): Promise<{ contentType: string; body: Buffer }> {
  const params = new URLSearchParams({
    maxwidth: '400',
    photoreference: photoReference,
    key: getApiKey()
  });

  // O fetch segue o redirecionamento do Google até a imagem final.
  const response = await fetchUpstream(
    `https://maps.googleapis.com/maps/api/place/photo?${params.toString()}`,
    PHOTO_UNAVAILABLE,
    'PHOTO_UNAVAILABLE'
  );
  const contentType = response.headers.get('content-type') ?? '';

  if (!response.ok || !contentType.startsWith('image/')) {
    throw new AppError(502, PHOTO_UNAVAILABLE, 'PHOTO_UNAVAILABLE', {
      cause: `Google Place Photo status=${response.status} content-type=${contentType}`
    });
  }

  return { contentType, body: Buffer.from(await response.arrayBuffer()) };
}
