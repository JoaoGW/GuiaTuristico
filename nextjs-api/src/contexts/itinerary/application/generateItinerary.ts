import type OpenAI from 'openai';
import type { CreditWallet } from '@/contexts/billing/application/creditWallet';
import { createOpenAIClient } from '@/contexts/concierge/infrastructure/openaiClient';
import { creditsForDays, splitIntoBlocks, type CreditUsage, type DayBlock } from '../domain/credits';
import {
  ITINERARY_DAYS_SCHEMA,
  itineraryIncomplete,
  validateItineraryDays,
  withExactDayCount,
  type Itinerary,
  type ItineraryDay
} from '../domain/itinerary';
import {
  ITINERARY_SYSTEM_PROMPT,
  TRIP_PLAN_SYSTEM_PROMPT,
  buildItineraryBlockPrompt,
  buildTripPlanPrompt
} from '../domain/itineraryPrompt';
import { buildCalendar } from '../domain/tripCalendar';
import { TRIP_PLAN_SCHEMA, parseBlockRetry, toTripPlan, type TripPlan } from '../domain/tripPlan';
import { parseTripPreferences, type TripPreferences } from '../domain/tripPreferences';
import { requestStructuredJson } from '../infrastructure/structuredCompletion';

export interface ItineraryGeneration {
  itinerary: Itinerary;
  /** Rota dia a dia (data, dia da semana, cidade e destaques) que os blocos seguiram. */
  plan: TripPlan;
  /** `debited`: débito feito no RevenueCat; `null` com a cobrança desligada. */
  credits: CreditUsage & { debited: boolean | null };
  /** Dias dos blocos que falharam (não cobrados); vazio quando o roteiro veio completo. */
  missingDays: number[];
}

/**
 * Gera o roteiro e informa os créditos (1 por bloco de até 7 dias gerado com sucesso).
 * Primeiro um plano da viagem inteira (no Modo Surpresa ele também escolhe o destino),
 * depois os blocos em paralelo, para caber no maxDuration da rota. O plano não é cobrado.
 * Com `wallet` (RevenueCat configurado), confere o saldo dos blocos pedidos antes de chamar a IA
 * e debita só os blocos gerados.
 */
export async function generateItinerary(body: unknown, wallet: CreditWallet | null): Promise<ItineraryGeneration> {
  const preferences = parseTripPreferences(body);
  const allBlocks = splitIntoBlocks(preferences.days);
  const retry = parseBlockRetry(body, preferences.days, allBlocks);
  const required = creditsForDays(preferences.days);
  const blocks = retry?.blocks ?? allBlocks;

  await wallet?.ensureAvailable(blocks.length);
  const openai = createOpenAIClient();

  const plan = retry?.plan ?? await planTrip(openai, preferences);

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

  const charged = generated.length;
  const generatedBlocks = blocks.filter((_, i) => results[i].status === 'fulfilled').map((block) => block.index);
  const debited = wallet ? await wallet.charge(charged, `roteiro ${preferences.days} dias, blocos ${generatedBlocks.join(',')}`) : null;

  return {
    itinerary: { continent: plan.continent, countries: plan.countries, days: generated.flat() },
    plan,
    credits: { required, charged, debited },
    missingDays: failures.flatMap(({ block }) =>
      Array.from({ length: block.lastDay - block.firstDay + 1 }, (_, i) => block.firstDay + i))
  };
}

async function planTrip(openai: OpenAI, preferences: TripPreferences): Promise<TripPlan> {
  const calendar = buildCalendar(preferences.dateBegin, preferences.days);
  const plan = toTripPlan(await requestStructuredJson(openai, {
    systemPrompt: TRIP_PLAN_SYSTEM_PROMPT,
    userPrompt: buildTripPlanPrompt(preferences, calendar),
    schemaName: 'trip_plan',
    schema: withExactDayCount(TRIP_PLAN_SCHEMA, preferences.days),
    timeoutMs: 30_000
  }), preferences.days, calendar);

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
    schema: withExactDayCount(ITINERARY_DAYS_SCHEMA, blockDays),
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
