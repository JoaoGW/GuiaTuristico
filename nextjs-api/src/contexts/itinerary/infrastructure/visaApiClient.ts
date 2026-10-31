import { AppError } from '@/shared/errors';
import { fetchUpstream } from '@/shared/http';
import { isVisaRequirement, type VisaRequirement } from '../domain/visa';

const VISA_UNAVAILABLE = 'Não foi possível consultar o visto agora.';

// Serviço de terceiros sem SLA; qualquer falha vira 503 VISA_UNAVAILABLE em vez de resposta inventada.
export async function fetchVisaRequirement(origin: string, destination: string): Promise<VisaRequirement> {
  const url = `https://rough-sun-2523.fly.dev/visa/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`;

  let response: Response;
  try {
    response = await fetchUpstream(url, VISA_UNAVAILABLE, 'VISA_UNAVAILABLE');
  } catch (error) {
    throw new AppError(503, VISA_UNAVAILABLE, 'VISA_UNAVAILABLE', { cause: error });
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok || !isVisaRequirement(data)) {
    throw new AppError(503, VISA_UNAVAILABLE, 'VISA_UNAVAILABLE', {
      cause: `Serviço de vistos status=${response.status}`
    });
  }

  return data;
}
