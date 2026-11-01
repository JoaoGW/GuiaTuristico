import { badRequest } from '@/shared/errors';
import type { DayBlock } from './credits';
import { weekdayOf, type CalendarDay } from './tripCalendar';

/**
 * Rota da viagem inteira, gerada antes dos blocos: data, dia da semana, cidade e as atrações
 * principais de cada dia. Os blocos seguem o plano, o que evita repetir atrações entre blocos
 * gerados em paralelo e dias sem lugares definidos.
 */
export interface TripPlan {
  continent: string;
  countries: string[];
  days: { date: string; weekday: string; location: string; highlights: string[] }[];
}

const stringField = { type: 'string' } as const;

// O dia da semana não entra no schema: o servidor calcula a partir da data.
export const TRIP_PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['continent', 'countries', 'days'],
  properties: {
    continent: stringField,
    countries: { type: 'array', items: stringField },
    days: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['date', 'location', 'highlights'],
        properties: {
          date: stringField,
          location: stringField,
          highlights: { type: 'array', minItems: 1, maxItems: 4, items: stringField }
        }
      }
    }
  }
};

const MAX_HIGHLIGHTS = 4;
const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

/**
 * Devolve o plano normalizado, ou `null` quando não tem exatamente `expectedDays` dias válidos.
 * Com `calendar`, as datas do servidor substituem as da IA; o dia da semana é sempre recalculado.
 */
export function toTripPlan(data: unknown, expectedDays: number, calendar?: CalendarDay[] | null): TripPlan | null {
  const plan = (data ?? {}) as Record<string, unknown>;
  const countries = Array.isArray(plan.countries) ? plan.countries.filter(isNonEmptyString).map((c) => c.trim()) : [];
  const days = Array.isArray(plan.days) ? plan.days : [];

  if (!isNonEmptyString(plan.continent) || countries.length < 1 || countries.length > 10 || days.length !== expectedDays) {
    return null;
  }

  const normalizedDays = days.map((value: unknown, i) => {
    const day = (value ?? {}) as Record<string, unknown>;
    const date = calendar?.[i]?.date ?? (typeof day.date === 'string' ? day.date.trim() : '');
    const weekday = weekdayOf(date);
    const highlights = Array.isArray(day.highlights)
      ? day.highlights.filter(isNonEmptyString).map((h) => h.trim()).filter((h) => h.length <= 100).slice(0, MAX_HIGHLIGHTS)
      : [];

    if (!weekday || !isNonEmptyString(day.location) || day.location.length > 100 || highlights.length === 0) {
      return null;
    }
    return { date, weekday, location: day.location.trim(), highlights };
  });

  if (normalizedDays.some((day) => day === null)) return null;

  return { continent: plan.continent.trim(), countries, days: normalizedDays as TripPlan['days'] };
}

/**
 * Pedido de nova tentativa: o app reenvia o `plan` recebido e os números dos blocos que
 * faltaram (`blocks`). Sem `plan`, o roteiro é gerado do zero.
 */
export function parseBlockRetry(body: unknown, days: number, blocks: DayBlock[]): { plan: TripPlan; blocks: DayBlock[] } | null {
  const input = (body ?? {}) as { plan?: unknown; blocks?: unknown };
  if (input.plan === undefined && input.blocks === undefined) return null;

  const plan = toTripPlan(input.plan, days);
  if (!plan) {
    throw badRequest('O campo "plan" deve ser o plano devolvido pela API para este mesmo número de dias.');
  }

  const requested = input.blocks;
  if (
    !Array.isArray(requested) || requested.length === 0 ||
    requested.some((n) => !Number.isInteger(n) || n < 1 || n > blocks.length) ||
    new Set(requested).size !== requested.length
  ) {
    throw badRequest(`O campo "blocks" deve listar números de bloco distintos entre 1 e ${blocks.length}.`);
  }

  return { plan, blocks: blocks.filter((block) => requested.includes(block.index)) };
}
