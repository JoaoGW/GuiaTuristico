// Regra do Produto (01/11/2026): cada bloco de até 7 dias de roteiro consome 1 crédito de IA.
// O roteiro é gerado bloco a bloco, então o crédito corresponde ao que a IA realmente produz.
export const DAYS_PER_CREDIT = 7;
export const MAX_TRIP_DAYS = 28;

export interface DayBlock {
  /** Número do bloco, a partir de 1. */
  index: number;
  firstDay: number;
  lastDay: number;
}

export interface CreditUsage {
  /** Créditos do roteiro inteiro. */
  required: number;
  /** Créditos dos blocos efetivamente gerados nesta requisição. */
  charged: number;
}

export function creditsForDays(days: number): number {
  return Math.ceil(days / DAYS_PER_CREDIT);
}

export function splitIntoBlocks(days: number): DayBlock[] {
  return Array.from({ length: creditsForDays(days) }, (_, i) => ({
    index: i + 1,
    firstDay: i * DAYS_PER_CREDIT + 1,
    lastDay: Math.min((i + 1) * DAYS_PER_CREDIT, days)
  }));
}
