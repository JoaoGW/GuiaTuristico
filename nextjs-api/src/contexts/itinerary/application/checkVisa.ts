import { parseCountryCode } from '../domain/visa';
import { fetchVisaRequirement } from '../infrastructure/visaApiClient';

export async function checkVisa(origin?: string, destination?: string) {
  return fetchVisaRequirement(parseCountryCode(origin, 'origin'), parseCountryCode(destination, 'destination'));
}
