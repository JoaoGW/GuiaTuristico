import { AppError } from '@/shared/errors';
import { fetchUpstream } from '@/shared/http';
import type { Coordinates } from '../domain/coordinates';

const WEATHER_UNAVAILABLE = 'Não foi possível consultar o clima agora.';

/** Devolve o JSON de `current.json` da WeatherAPI sem alterações (contrato atual do app). */
export async function fetchCurrentWeather({ latitude, longitude }: Coordinates): Promise<unknown> {
  const apiKey = process.env.WEATHER;
  if (!apiKey) {
    throw new AppError(503, 'Serviço de clima indisponível.', 'WEATHER_UNAVAILABLE', {
      cause: 'WEATHER não configurada'
    });
  }

  const params = new URLSearchParams({ key: apiKey, q: `${latitude},${longitude}`, aqi: 'no' });
  const response = await fetchUpstream(
    `https://api.weatherapi.com/v1/current.json?${params.toString()}`,
    WEATHER_UNAVAILABLE,
    'WEATHER_UNAVAILABLE'
  );

  if (!response.ok) {
    throw new AppError(502, WEATHER_UNAVAILABLE, 'WEATHER_UNAVAILABLE', {
      cause: `WeatherAPI status=${response.status}`
    });
  }

  return response.json();
}
