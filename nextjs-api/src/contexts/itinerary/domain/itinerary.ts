import { AppError } from '@/shared/errors';

// Mesmas categorias que o app usava no prompt (ItineraryMapMenu.tsx).
export const ACTIVITY_CATEGORIES = [
  'Ponto Turístico', 'Gastronomia', 'Hospedagem', 'Vida Noturna', 'Parques', 'Shopping', 'Cultura', 'Viagens'
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  coordinates: { latitude: number; longitude: number };
  category: ActivityCategory;
}

export interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  timeline: ItineraryActivity[];
  suggestedActivities: string[];
  pixabayTags: string;
}

export interface Itinerary {
  continent: string;
  countries: string[];
  days: ItineraryDay[];
}

export interface SurpriseDestination {
  continent: string;
  countries: string[];
}

export function itineraryIncomplete(cause: string): AppError {
  return new AppError(502, 'O roteiro gerado veio incompleto. Tente gerar novamente.', 'ITINERARY_INCOMPLETE', { cause });
}

const stringField = { type: 'string' } as const;

// Schemas no modo `strict` da OpenAI: todos os campos obrigatórios e sem propriedades extras.
export const ITINERARY_DAYS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['days'],
  properties: {
    days: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['day', 'date', 'location', 'timeline', 'suggestedActivities', 'pixabayTags'],
        properties: {
          day: { type: 'integer' },
          date: stringField,
          location: stringField,
          timeline: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['time', 'title', 'description', 'coordinates', 'category'],
              properties: {
                time: stringField,
                title: stringField,
                description: stringField,
                coordinates: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['latitude', 'longitude'],
                  properties: { latitude: { type: 'number' }, longitude: { type: 'number' } }
                },
                category: { type: 'string', enum: [...ACTIVITY_CATEGORIES] }
              }
            }
          },
          suggestedActivities: { type: 'array', items: stringField },
          pixabayTags: stringField
        }
      }
    }
  }
};

export const SURPRISE_DESTINATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['continent', 'countries'],
  properties: {
    continent: stringField,
    countries: { type: 'array', items: stringField }
  }
};

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isStringList = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');

function toActivity(value: unknown): ItineraryActivity | null {
  const activity = (value ?? {}) as Record<string, unknown>;
  const coordinates = (activity.coordinates ?? {}) as Record<string, unknown>;
  const { latitude, longitude } = coordinates;

  if (
    typeof activity.time !== 'string' || !/^\d{1,2}:\d{2}$/.test(activity.time) ||
    !isNonEmptyString(activity.title) ||
    typeof activity.description !== 'string' ||
    typeof latitude !== 'number' || latitude < -90 || latitude > 90 ||
    typeof longitude !== 'number' || longitude < -180 || longitude > 180 ||
    !ACTIVITY_CATEGORIES.includes(activity.category as ActivityCategory)
  ) {
    return null;
  }

  return {
    time: activity.time,
    title: activity.title.trim(),
    description: activity.description.trim() || activity.title.trim(),
    coordinates: { latitude, longitude },
    category: activity.category as ActivityCategory
  };
}

/**
 * Confere o JSON devolvido pela IA. Qualquer dia faltando, sem atividades ou com
 * atividade malformada invalida o roteiro inteiro: nada é descartado em silêncio.
 */
export function validateItineraryDays(data: unknown, expectedDays: number): ItineraryDay[] {
  const days = (data as { days?: unknown } | null)?.days;
  if (!Array.isArray(days) || days.length !== expectedDays) {
    throw itineraryIncomplete(`esperados ${expectedDays} dias, recebidos ${Array.isArray(days) ? days.length : 'nenhum'}`);
  }

  return days.map((value: unknown, index): ItineraryDay => {
    const day = (value ?? {}) as Record<string, unknown>;
    const timeline = Array.isArray(day.timeline) ? day.timeline.map(toActivity) : [];

    if (
      !isNonEmptyString(day.date) || !isNonEmptyString(day.location) ||
      timeline.length === 0 || timeline.some((activity) => activity === null) ||
      !isStringList(day.suggestedActivities) || typeof day.pixabayTags !== 'string'
    ) {
      throw itineraryIncomplete(`dia ${index + 1} inválido`);
    }

    return {
      day: index + 1,
      date: day.date.trim(),
      location: day.location.trim(),
      timeline: timeline as ItineraryActivity[],
      suggestedActivities: day.suggestedActivities,
      pixabayTags: day.pixabayTags
    };
  });
}

export function validateSurpriseDestination(data: unknown): SurpriseDestination {
  const destination = (data ?? {}) as Record<string, unknown>;
  const countries = isStringList(destination.countries) ? destination.countries.map((c) => c.trim()).filter(Boolean) : [];

  if (!isNonEmptyString(destination.continent) || countries.length < 1 || countries.length > 3) {
    throw itineraryIncomplete('destino surpresa inválido');
  }

  return { continent: destination.continent.trim(), countries };
}
