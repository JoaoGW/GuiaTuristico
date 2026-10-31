import { parsePhotoReference } from '../domain/place';
import { fetchPlacePhoto } from '../infrastructure/googlePlacesClient';

export async function getPlacePhoto(photoReference?: string) {
  return fetchPlacePhoto(parsePhotoReference(photoReference));
}
