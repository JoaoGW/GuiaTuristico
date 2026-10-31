import { badRequest } from './errors';

/** Exige texto não vazio e dentro do limite antes de qualquer chamada à OpenAI. */
export function requireText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw badRequest(`O campo "${field}" é obrigatório e deve ser um texto.`);
  }
  if (value.length > maxLength) {
    throw badRequest(`O campo "${field}" deve ter no máximo ${maxLength} caracteres.`);
  }
  return value.trim();
}
