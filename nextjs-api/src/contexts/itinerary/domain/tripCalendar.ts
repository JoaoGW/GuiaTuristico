// Dia da semana calculado no servidor: a IA erra contas de calendário, e as atrações
// costumam ter dia fixo de fechamento (ex.: segunda-feira em muitos museus).
const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

export interface CalendarDay {
  /** YYYY-MM-DD */
  date: string;
  weekday: string;
}

function toUtcDate(year: number, month: number, day: number): Date | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

/** Aceita `DD/MM/AAAA` (o que o app envia) ou `AAAA-MM-DD`; qualquer outro formato devolve `null`. */
function parseDate(value: string): Date | null {
  const br = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (br) return toUtcDate(Number(br[3]), Number(br[2]), Number(br[1]));

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (iso) return toUtcDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  return null;
}

/** Dia da semana em pt-BR de uma data `AAAA-MM-DD`, ou `null` se a data for inválida. */
export function weekdayOf(isoDate: string): string | null {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? parseDate(isoDate) : null;
  return date ? WEEKDAYS[date.getUTCDay()] : null;
}

/** Datas e dias da semana da viagem a partir do início, ou `null` se a data de início não for reconhecida. */
export function buildCalendar(dateBegin: string, days: number): CalendarDay[] | null {
  const start = parseDate(dateBegin);
  if (!start) return null;

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start.getTime() + i * 86_400_000);
    return { date: date.toISOString().slice(0, 10), weekday: WEEKDAYS[date.getUTCDay()] };
  });
}
