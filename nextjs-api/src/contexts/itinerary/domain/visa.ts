import { badRequest } from '@/shared/errors';

export interface VisaRequirement {
  category: { code: string; name?: string };
  [key: string]: unknown;
}

/** Código de país ISO 3166-1 alfa-2, normalizado em maiúsculas. */
export function parseCountryCode(value: string | undefined, field: 'origin' | 'destination'): string {
  const code = value?.trim().toUpperCase();
  if (!code || !/^[A-Z]{2}$/.test(code)) {
    throw badRequest(`${field} deve ser um código de país ISO com 2 letras (ex.: BR).`);
  }
  return code;
}

/** Só aceita respostas que trazem `category.code`, que é o que o app usa para decidir. */
export function isVisaRequirement(data: unknown): data is VisaRequirement {
  if (!data || typeof data !== 'object') return false;
  const category = (data as { category?: unknown }).category;
  if (!category || typeof category !== 'object') return false;
  const code = (category as { code?: unknown }).code;
  return typeof code === 'string' && /^[A-Z]{1,5}$/.test(code);
}
