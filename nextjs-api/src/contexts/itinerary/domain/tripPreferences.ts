import { badRequest } from '@/shared/errors';
import { requireText } from '@/shared/validation';

/** Preferências estruturadas que o app envia para gerar o roteiro. */
export interface TripPreferences {
  dateBegin: string;
  dateEnd: string;
  days: number;
  continent?: string;
  /** Lista vazia ativa o Modo Surpresa: a IA escolhe continente e países. */
  countries: string[];
  originCountry: string;
  budget: number;
  peopleQuantity: number;
  accompanying: string;
  tripStyles: string[];
  locomotionMethods: string[];
  specialWish: string;
  userPreferences: string[];
}

// Com max_completion_tokens 6000 (sem aprovação para mudar), roteiros maiores tendem a ser truncados
// e a chamada é paga mesmo assim. 7 dias é o maior caso do aceite do BE-09; revisar após medir em preview.
export const MAX_TRIP_DAYS = 7;
const MAX_TEXT_LENGTH = 100;
const MAX_SPECIAL_WISH_LENGTH = 300;

function requireInteger(value: unknown, field: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw badRequest(`O campo "${field}" deve ser um número inteiro entre ${min} e ${max}.`);
  }
  return value;
}

function textList(value: unknown, field: string, minItems: number, maxItems: number): string[] {
  if (value === undefined && minItems === 0) return [];
  if (!Array.isArray(value) || value.length < minItems || value.length > maxItems) {
    throw badRequest(`O campo "${field}" deve ser uma lista com ${minItems} a ${maxItems} itens.`);
  }
  return value.map((item) => requireText(item, `${field}[]`, MAX_TEXT_LENGTH));
}

function optionalText(value: unknown, field: string, maxLength: number): string {
  return value === undefined || value === '' ? '' : requireText(value, field, maxLength);
}

export function parseTripPreferences(body: unknown): TripPreferences {
  const input = (body ?? {}) as Record<string, unknown>;

  if (typeof input.budget !== 'number' || !Number.isFinite(input.budget) || input.budget < 0) {
    throw badRequest('O campo "budget" deve ser um número maior ou igual a zero.');
  }

  const continent = optionalText(input.continent, 'continent', MAX_TEXT_LENGTH);

  return {
    dateBegin: requireText(input.dateBegin, 'dateBegin', MAX_TEXT_LENGTH),
    dateEnd: requireText(input.dateEnd, 'dateEnd', MAX_TEXT_LENGTH),
    days: requireInteger(input.days, 'days', 1, MAX_TRIP_DAYS),
    continent: continent || undefined,
    countries: textList(input.countries, 'countries', 0, 10),
    originCountry: requireText(input.originCountry, 'originCountry', MAX_TEXT_LENGTH),
    budget: input.budget,
    peopleQuantity: requireInteger(input.peopleQuantity, 'peopleQuantity', 1, 50),
    accompanying: requireText(input.accompanying, 'accompanying', MAX_TEXT_LENGTH),
    tripStyles: textList(input.tripStyles, 'tripStyles', 1, 10),
    locomotionMethods: textList(input.locomotionMethods, 'locomotionMethods', 1, 10),
    specialWish: optionalText(input.specialWish, 'specialWish', MAX_SPECIAL_WISH_LENGTH),
    userPreferences: textList(input.userPreferences, 'userPreferences', 0, 30)
  };
}
