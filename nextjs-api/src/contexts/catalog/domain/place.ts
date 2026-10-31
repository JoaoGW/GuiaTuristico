import { badRequest } from '@/shared/errors';

/**
 * Lugar devolvido ao app. Os nomes dos campos seguem os que o app já lê
 * (`name`, `vicinity`, `geometry.location`, `opening_hours.open_now`), mas só
 * estes campos saem da API: nada do payload bruto do Google, nem URL com chave.
 * A foto é montada pelo app com `/api/googlePhotoProxy?photo_reference=...`.
 */
export interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number | null;
  icon: string | null;
  geometry: { location: { lat: number; lng: number } };
  opening_hours: { open_now: boolean } | null;
  photos: { photo_reference: string }[];
}

// Referências de foto do Places são base64url longas; o limite evita repassar lixo ao Google.
const PHOTO_REFERENCE_PATTERN = /^[A-Za-z0-9_-]{10,2000}$/;

export function parsePhotoReference(value: string | undefined): string {
  if (!value || !PHOTO_REFERENCE_PATTERN.test(value)) {
    throw badRequest('photo_reference ausente ou inválido.');
  }
  return value;
}
