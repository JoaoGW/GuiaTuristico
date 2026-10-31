import type OpenAI from 'openai';
import { createOpenAIClient } from '@/contexts/concierge/infrastructure/openaiClient';
import { creditsForDays, splitIntoBlocks, type CreditUsage, type DayBlock } from '../domain/credits';
import {
  ITINERARY_DAYS_SCHEMA,
  SURPRISE_DESTINATION_SCHEMA,
  itineraryIncomplete,
  validateItineraryDays,
  validateSurpriseDestination,
  type Itinerary,
  type ItineraryDay
} from '../domain/itinerary';
import {
  ITINERARY_SYSTEM_PROMPT,
  SURPRISE_DESTINATION_SYSTEM_PROMPT,
  TRIP_PLAN_SYSTEM_PROMPT,
  buildItineraryBlockPrompt,
  buildItineraryPrompt,
  buildSurpriseDestinationPrompt,
  buildTripPlanPrompt
} from '../domain/itineraryPrompt';
import { TRIP_PLAN_SCHEMA, parseBlockRetry, toTripPlan, type TripPlan } from '../domain/tripPlan';
import { parseTripPreferences, type TripPreferences } from '../domain/tripPreferences';
import { requestStructuredJson } from '../infrastructure/structuredCompletion';

export interface ItineraryGeneration {
  itinerary: Itinerary;
  /** Rota dia a dia usada nos blocos; `null` em roteiros de um bloco só. */
  plan: TripPlan | null;
  credits: CreditUsage;
  /** Dias dos blocos que falharam (não cobrados); vazio quando o roteiro veio completo. */
  missingDays: number[];
}

/**
 * Gera o roteiro e informa os créditos (1 por bloco de até 7 dias gerado com sucesso).
 * Até 7 dias: uma chamada (mais a escolha do destino no Modo Surpresa). Acima disso: um
 * plano da viagem inteira e os blocos em paralelo, para caber no maxDuration da rota.
 * O saldo do usuário fica no RevenueCat; esta função só calcula o consumo.
 */
export async function generateItinerary(body: unknown): Promise<ItineraryGeneration> {
  const preferences = parseTripPreferences(body);
  const allBlocks = splitIntoBlocks(preferences.days);
  const retry = parseBlockRetry(body, preferences.days, allBlocks);
  const required = creditsForDays(preferences.days);
  const openai = createOpenAIClient();

  if (!retry && allBlocks.length === 1) {
    const itinerary = await generateSingleBlock(openai, preferences);
    return { itinerary, plan: null, credits: { required, charged: 1 }, missingDays: [] };
  }

  const plan = retry?.plan ?? await planTrip(openai, preferences);
  const blocks = retry?.blocks ?? allBlocks;

  const results = await Promise.allSettled(blocks.map((block) => generateBlock(openai, preferences, plan, block)));
  const generated = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
  const failures = results.flatMap((result, i) => (result.status === 'rejected' ? [{ block: blocks[i], reason: result.reason }] : []));

  for (const failure of failures) {
    console.error(`Roteiro: bloco ${failure.block.index} falhou:`, failure.reason);
  }

  // Nenhum bloco gerado: nada é cobrado e o erro do primeiro bloco vai para o app (502, 504, 429...).
  if (generated.length === 0) {
    throw failures[0].reason;
  }

  return {
    itinerary: { continent: plan.continent, countries: plan.countries, days: generated.flat() },
    plan,
    credits: { required, charged: generated.length },
    missingDays: failures.flatMap(({ block }) =>
      Array.from({ length: block.lastDay - block.firstDay + 1 }, (_, i) => block.firstDay + i))
  };
}

async function generateSingleBlock(openai: OpenAI, preferences: TripPreferences): Promise<Itinerary> {
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

async function planTrip(openai: OpenAI, preferences: TripPreferences): Promise<TripPlan> {
  const plan = toTripPlan(await requestStructuredJson(openai, {
    systemPrompt: TRIP_PLAN_SYSTEM_PROMPT,
    userPrompt: buildTripPlanPrompt(preferences),
    schemaName: 'trip_plan',
    schema: TRIP_PLAN_SCHEMA,
    timeoutMs: 30_000
  }), preferences.days);

  if (!plan) {
    throw itineraryIncomplete('plano da viagem inválido');
  }

  // Com países informados, o plano não pode trocar o destino escolhido pelo usuário.
  if (preferences.countries.length > 0) {
    return { ...plan, continent: preferences.continent || plan.continent, countries: preferences.countries };
  }
  return plan;
}

async function generateBlock(openai: OpenAI, preferences: TripPreferences, plan: TripPlan, block: DayBlock): Promise<ItineraryDay[]> {
  const blockDays = block.lastDay - block.firstDay + 1;
  const days = validateItineraryDays(await requestStructuredJson(openai, {
    systemPrompt: ITINERARY_SYSTEM_PROMPT,
    userPrompt: buildItineraryBlockPrompt(preferences, plan, block),
    schemaName: 'itinerary',
    schema: ITINERARY_DAYS_SCHEMA,
    // 30 s do plano + 80 s dos blocos em paralelo cabem nos 120 s da rota.
    timeoutMs: 80_000
  }), blockDays);

  // Número, data e cidade vêm do plano, que é a referência comum a todos os blocos.
  return days.map((day, i) => ({
    ...day,
    day: block.firstDay + i,
    date: plan.days[block.firstDay - 1 + i].date,
    location: plan.days[block.firstDay - 1 + i].location
  }));
}
