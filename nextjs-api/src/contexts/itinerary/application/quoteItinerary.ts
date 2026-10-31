import { badRequest } from '@/shared/errors';
import { DAYS_PER_CREDIT, MAX_TRIP_DAYS, creditsForDays } from '../domain/credits';

/** Créditos de um roteiro antes de gerá-lo, para o app mostrar o custo e conferir o saldo no RevenueCat. */
export function quoteItinerary(rawDays?: string) {
  const days = Number(rawDays);
  if (!rawDays || !Number.isInteger(days) || days < 1 || days > MAX_TRIP_DAYS) {
    throw badRequest(`O parâmetro "days" deve ser um número inteiro entre 1 e ${MAX_TRIP_DAYS}.`);
  }
  return { days, credits: creditsForDays(days), daysPerCredit: DAYS_PER_CREDIT, maxDays: MAX_TRIP_DAYS };
}
