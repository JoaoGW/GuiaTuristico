import { createOpenAIClient } from '@/contexts/concierge/infrastructure/openaiClient';
import {
  ITINERARY_DAYS_SCHEMA,
  SURPRISE_DESTINATION_SCHEMA,
  validateItineraryDays,
  validateSurpriseDestination,
  type Itinerary
} from '../domain/itinerary';
import {
  ITINERARY_SYSTEM_PROMPT,
  SURPRISE_DESTINATION_SYSTEM_PROMPT,
  buildItineraryPrompt,
  buildSurpriseDestinationPrompt
} from '../domain/itineraryPrompt';
import { parseTripPreferences } from '../domain/tripPreferences';
import { requestStructuredJson } from '../infrastructure/structuredCompletion';

/** Gera o roteiro a partir das preferências; sem países, a IA escolhe o destino antes (Modo Surpresa). */
export async function generateItinerary(body: unknown): Promise<Itinerary> {
  const preferences = parseTripPreferences(body);
  const openai = createOpenAIClient();

  let continent = preferences.continent ?? '';
  let countries = preferences.countries;

  if (countries.length === 0) {
    const destination = validateSurpriseDestination(await requestStructuredJson(openai, {
      systemPrompt: SURPRISE_DESTINATION_SYSTEM_PROMPT,
      userPrompt: buildSurpriseDestinationPrompt(preferences),
      schemaName: 'surprise_destination',
      schema: SURPRISE_DESTINATION_SCHEMA
    }));
    continent = destination.continent;
    countries = destination.countries;
  }

  const days = validateItineraryDays(await requestStructuredJson(openai, {
    systemPrompt: ITINERARY_SYSTEM_PROMPT,
    userPrompt: buildItineraryPrompt(preferences, continent, countries),
    schemaName: 'itinerary',
    schema: ITINERARY_DAYS_SCHEMA
  }), preferences.days);

  return { continent, countries, days };
}
