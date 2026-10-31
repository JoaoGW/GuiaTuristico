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
      schema: SURPRISE_DESTINATION_SCHEMA,
      timeoutMs: 30_000
    }));
    continent = destination.continent;
    countries = destination.countries;
  }

  const days = validateItineraryDays(await requestStructuredJson(openai, {
    systemPrompt: ITINERARY_SYSTEM_PROMPT,
    userPrompt: buildItineraryPrompt(preferences, continent, countries),
    schemaName: 'itinerary',
    schema: ITINERARY_DAYS_SCHEMA,
    // No Modo Surpresa, 30 s já foram reservados para a escolha do destino.
    timeoutMs: preferences.countries.length === 0 ? 80_000 : 110_000
  }), preferences.days);

  return { continent, countries, days };
}
