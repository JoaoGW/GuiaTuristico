import { randomUUID } from 'node:crypto';
import type OpenAI from 'openai';
import type { CreditWallet } from '@/contexts/billing/application/creditWallet';
import { createOpenAIClient } from '@/contexts/concierge/infrastructure/openaiClient';
import { creditsForDays, splitIntoBlocks, type CreditUsage, type DayBlock } from '../domain/credits';
import {
  ITINERARY_DAYS_SCHEMA,
  isChargeableFailure,
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
import { badRequest } from '@/shared/errors';
import { buildCalendar, type CalendarDay } from '../domain/tripCalendar';
import { TRIP_PLAN_SCHEMA, alignPlanWithPreferences, parseBlockRetry, toTripPlan, type TripPlan } from '../domain/tripPlan';
import { parseTripPreferences, type TripPreferences } from '../domain/tripPreferences';
import { requestStructuredJson } from '../infrastructure/structuredCompletion';

export interface ItineraryGeneration {
  itinerary: Itinerary;
  /** Rota dia a dia (data, dia da semana, cidade e destaques) que os blocos seguiram. */
  plan: TripPlan;
  /**
   * `charged`: blocos gerados + `forfeited` (blocos recusados pela IA por causa das preferências).
   * `debited`: `true` quando o saldo no RevenueCat ficou com `charged` debitado (reserva menos
   * devolução); `false` se a devolução falhou (fica no log para conciliação); `null` sem cobrança.
   */
  credits: CreditUsage & { forfeited: number; debited: boolean | null };
  /** Dias dos blocos que falharam; vazio quando o roteiro veio completo. */
  missingDays: number[];
}

/**
 * Gera o roteiro e informa os créditos (1 por bloco de até 7 dias gerado com sucesso).
 * Primeiro um plano da viagem inteira (no Modo Surpresa ele também escolhe o destino),
 * depois os blocos em paralelo, para caber no maxDuration da rota. O plano não é cobrado.
 * Com `wallet` (RevenueCat configurado), os créditos dos blocos pedidos são reservados (debitados)
 * antes de chamar a IA. No fim, falhas de infraestrutura ou de formato são devolvidas; respostas
 * cortadas ou recusadas por causa das preferências (ITINERARY_REJECTED) são cobradas.
 */
export async function generateItinerary(body: unknown, wallet: CreditWallet | null): Promise<ItineraryGeneration> {
  const preferences = parseTripPreferences(body);
  // Data reconhecida antes de qualquer custo: o calendário (e o dia da semana) vem sempre do servidor.
  const calendar = buildCalendar(preferences.dateBegin, preferences.days);
  if (!calendar) {
    throw badRequest('O campo "dateBegin" deve estar no formato DD/MM/AAAA.');
  }

  const allBlocks = splitIntoBlocks(preferences.days);
  const retry = parseBlockRetry(body, preferences, calendar, allBlocks);
  const required = creditsForDays(preferences.days);
  const blocks = retry?.blocks ?? allBlocks;
  // O id liga o log do servidor ao `reference` da transação no RevenueCat, sem expor o usuário.
  const reference = `roteiro ${randomUUID().slice(0, 8)}: ${preferences.days} dias, blocos ${blocks.map((block) => block.index).join(',')}`;
  const openai = createOpenAIClient();

  await wallet?.reserve(blocks.length, reference);

  let plan: TripPlan;
  try {
    plan = retry?.plan ?? await planTrip(openai, preferences, calendar);
  } catch (error) {
    // Plano recusado por causa das preferências custa 1 crédito; qualquer outra falha devolve tudo.
    const kept = isChargeableFailure(error) ? 1 : 0;
    await wallet?.refund(blocks.length - kept, `${reference} (devolução: plano falhou)`);
    throw error;
  }

  const results = await Promise.allSettled(blocks.map((block) => generateBlock(openai, preferences, plan, block)));
  const generated = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
  const failures = results.flatMap((result, i) => (result.status === 'rejected' ? [{ block: blocks[i], reason: result.reason }] : []));

  for (const failure of failures) {
    console.error(`Roteiro (${reference}): bloco ${failure.block.index} falhou:`, failure.reason);
  }

  const forfeited = failures.filter(({ reason }) => isChargeableFailure(reason));
  const refundable = failures.filter(({ reason }) => !isChargeableFailure(reason));
  const charged = generated.length + forfeited.length;
  const refunded = wallet && refundable.length > 0
    ? await wallet.refund(refundable.length, `${reference} (devolução dos blocos ${refundable.map(({ block }) => block.index).join(',')})`)
    : true;

  // Nenhum bloco gerado: o erro vai para o app; recusa por preferências tem prioridade, pois foi cobrada.
  if (generated.length === 0) {
    throw (forfeited[0] ?? failures[0]).reason;
  }

  const debited = wallet ? refunded : null;

  return {
    itinerary: { continent: plan.continent, countries: plan.countries, days: generated.flat() },
    plan,
    credits: { required, charged, forfeited: forfeited.length, debited },
    missingDays: failures.flatMap(({ block }) =>
      Array.from({ length: block.lastDay - block.firstDay + 1 }, (_, i) => block.firstDay + i))
  };
}

async function planTrip(openai: OpenAI, preferences: TripPreferences, calendar: CalendarDay[]): Promise<TripPlan> {
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
  return alignPlanWithPreferences(plan, preferences);
}

async function generateBlock(openai: OpenAI, preferences: TripPreferences, plan: TripPlan, block: DayBlock): Promise<ItineraryDay[]> {
  const blockDays = block.lastDay - block.firstDay + 1;
  const days = validateItineraryDays(await requestStructuredJson(openai, {
    systemPrompt: ITINERARY_SYSTEM_PROMPT,
    userPrompt: buildItineraryBlockPrompt(preferences, plan, block),
    schemaName: 'itinerary',
    schema: withExactDayCount(ITINERARY_DAYS_SCHEMA, blockDays),
    // Orçamento de 120 s: token (5) + reserva (2×5) + plano (30) + blocos em paralelo (60)
    // + devolução (2×5) = 115 s. O maior bloco medido com reasoning low levou ~40 s.
    timeoutMs: 60_000
  }), blockDays);

  // Número, data e cidade vêm do plano, que é a referência comum a todos os blocos.
  return days.map((day, i) => ({
    ...day,
    day: block.firstDay + i,
    date: plan.days[block.firstDay - 1 + i].date,
    location: plan.days[block.firstDay - 1 + i].location
  }));
}
