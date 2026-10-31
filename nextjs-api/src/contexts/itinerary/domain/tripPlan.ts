import { badRequest } from '@/shared/errors';
import type { DayBlock } from './credits';

/**
 * Rota da viagem inteira (data e cidade de cada dia). Roteiros com mais de um bloco
 * são planejados antes, para que os blocos gerados em paralelo sigam a mesma viagem.
 */
export interface TripPlan {
  continent: string;
  countries: string[];
  days: { date: string; location: string }[];
}

const stringField = { type: 'string' } as const;

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
        required: ['date', 'location'],
        properties: { date: stringField, location: stringField }
      }
    }
  }
};

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

/** Devolve o plano normalizado, ou `null` quando não tem exatamente `expectedDays` dias válidos. */
export function toTripPlan(data: unknown, expectedDays: number): TripPlan | null {
  const plan = (data ?? {}) as Record<string, unknown>;
  const countries = Array.isArray(plan.countries) ? plan.countries.filter(isNonEmptyString).map((c) => c.trim()) : [];
  const days = Array.isArray(plan.days) ? plan.days : [];

  if (!isNonEmptyString(plan.continent) || countries.length < 1 || countries.length > 10 || days.length !== expectedDays) {
    return null;
  }

  const normalizedDays = days.map((value: unknown) => {
    const day = (value ?? {}) as Record<string, unknown>;
    return isNonEmptyString(day.date) && isNonEmptyString(day.location) && day.date.length <= 40 && day.location.length <= 100
      ? { date: day.date.trim(), location: day.location.trim() }
      : null;
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
