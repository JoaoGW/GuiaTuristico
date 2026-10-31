import { badRequest } from '@/shared/errors';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Valida latitude e longitude recebidas como texto da query string. */
export function parseCoordinates(latitude: string | undefined, longitude: string | undefined): Coordinates {
  if (!latitude || !longitude) {
    throw badRequest('Latitude e longitude são obrigatórias.');
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw badRequest('Latitude deve estar entre -90 e 90 e longitude entre -180 e 180.');
  }

  return { latitude: lat, longitude: lng };
}
