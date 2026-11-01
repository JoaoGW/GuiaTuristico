import type { DayBlock } from './credits';
import { ACTIVITY_CATEGORIES } from './itinerary';
import type { CalendarDay } from './tripCalendar';
import type { TripPlan } from './tripPlan';
import type { TripPreferences } from './tripPreferences';

// Instruções trazidas de ItineraryMapMenu.tsx (generateDetailed/generateSurprise), agora no
// servidor, com saída em JSON pelo schema e reforçadas após a avaliação de 01/11/2026
// (atividades genéricas, atrações repetidas entre blocos e atrações em dia de fechamento).

export const ITINERARY_SYSTEM_PROMPT = `Gere um itinerário turístico completo e detalhado para uma viagem, respondendo no formato JSON pedido.
Para cada dia informe: day (número do dia), date (YYYY-MM-DD), location (Cidade, País), timeline (atividades do dia), suggestedActivities (atividades extras recomendadas) e pixabayTags (tags relevantes para encontrar uma imagem na API do Pixabay, separadas por vírgula).
Para cada atividade informe: time (HH:MM), title (descrição da atividade), description (detalhes adicionais), coordinates (latitude e longitude do local) e category.
Use apenas os dados fornecidos do usuário. Seja específico nos nomes dos locais.
Cada atividade deve citar um lugar real e nomeado (atração, museu, bairro, mercado, parque ou restaurante). Não use atividades genéricas, como "caminhada pela cidade" ou "almoço local", sem dizer onde.
Nas refeições, indique o prato típico ou o mercado/bairro gastronômico da região.
Inclua os destaques previstos para cada dia na rota e não repita atrações programadas em outros dias.
Respeite o dia da semana de cada data: evite atrações que costumam fechar nesse dia.
IMPORTANTE: Cada dia DEVE ter NO MÍNIMO 3 atividades e NO MÁXIMO 8 atividades na timeline. NUNCA gere menos de 3 atividades por dia.
Retorne descrições ricas em detalhes com no mínimo 10 palavras.
As opções de categorias são (retorne apenas 1 por atividade): ${ACTIVITY_CATEGORIES.join(', ')}.`;

export const TRIP_PLAN_SYSTEM_PROMPT = `Você é um especialista em viagens. Planeje a rota de uma viagem dia a dia, respondendo no formato JSON pedido.
Para cada dia informe date (YYYY-MM-DD), location (Cidade, País onde o viajante estará naquele dia) e highlights (de 2 a 3 atrações reais e nomeadas para visitar naquele dia).
Use exatamente as datas do calendário informado, quando houver. Distribua as cidades de forma realista, considerando deslocamentos, o meio de locomoção e o ritmo da viagem.
Não repita a mesma atração em dias diferentes. Respeite o dia da semana de cada data: não coloque como destaque uma atração que costuma fechar nesse dia.
Se os países forem informados, use somente eles (não acrescente outros locais) e repita em continent o continente informado.
Se nenhum país for informado, escolha UM continente específico e de 1 a 3 países que combinem com o orçamento, o estilo de viagem e as preferências (viagem surpresa).`;

function travellerProfile(preferences: TripPreferences): string {
  const wish = preferences.specialWish ? ` e temos um desejo para a viagem: ${preferences.specialWish}` : '';
  const likes = preferences.userPreferences.length > 0 ? ` Gostamos de ${preferences.userPreferences.join(', ')}.` : '';

  return `Somos ${preferences.accompanying} com ${preferences.peopleQuantity} pessoas e de ${preferences.originCountry}. ` +
    `Temos um orçamento de ${preferences.budget}. Viagem com foco em ${preferences.tripStyles.join(' e ')}, ` +
    `utilizaremos ${preferences.locomotionMethods.join(', ')}${wish}.${likes}`;
}

function tripDates(preferences: TripPreferences): string {
  return `Início da viagem em ${preferences.dateBegin} e o fim em ${preferences.dateEnd}, possuindo ${preferences.days} dias de viagem.`;
}

export function buildTripPlanPrompt(preferences: TripPreferences, calendar: CalendarDay[] | null): string {
  const destination = preferences.countries.length > 0
    ? `Iremos ${preferences.continent ? `para ${preferences.continent} e ` : ''}aos países ${preferences.countries.join(', ')}.`
    : 'Destino surpresa: escolha o continente e os países.';
  const calendarText = calendar
    ? ` Calendário: ${calendar.map((day, i) => `Dia ${i + 1}: ${day.date} (${day.weekday})`).join('; ')}.`
    : '';

  return `${tripDates(preferences)} ${destination} ${travellerProfile(preferences)}${calendarText} Planeje exatamente ${preferences.days} dias.`;
}

/** Prompt de um bloco de dias, preso à rota planejada e às atrações dos outros dias. */
export function buildItineraryBlockPrompt(preferences: TripPreferences, plan: TripPlan, block: DayBlock): string {
  const blockDays = plan.days.slice(block.firstDay - 1, block.lastDay);
  const route = blockDays
    .map((day, i) => `Dia ${block.firstDay + i} (${day.date}, ${day.weekday}): ${day.location}; destaques: ${day.highlights.join(', ')}`)
    .join(' | ');
  const elsewhere = plan.days
    .filter((_, i) => i < block.firstDay - 1 || i >= block.lastDay)
    .flatMap((day) => day.highlights);
  const avoid = elsewhere.length > 0 ? ` Atrações já programadas em outros dias (não repita): ${elsewhere.join(', ')}.` : '';

  return `${tripDates(preferences)} Viagem por ${plan.continent}, países ${plan.countries.join(', ')}. ${travellerProfile(preferences)} ` +
    `Gere somente os dias ${block.firstDay} a ${block.lastDay} desta viagem, seguindo exatamente esta rota: ${route}.${avoid} ` +
    `Gere exatamente ${blockDays.length} dias, numerados de ${block.firstDay} a ${block.lastDay}.`;
}
