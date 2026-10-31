import type { DayBlock } from './credits';
import { ACTIVITY_CATEGORIES } from './itinerary';
import type { TripPlan } from './tripPlan';
import type { TripPreferences } from './tripPreferences';

// Instruções trazidas de ItineraryMapMenu.tsx (generateDetailed/generateSurprise), agora no
// servidor e com saída em JSON pelo schema em vez do formato textual DAY->...

export const ITINERARY_SYSTEM_PROMPT = `Gere um itinerário turístico completo e detalhado para uma viagem, respondendo no formato JSON pedido.
Para cada dia informe: day (número do dia), date (YYYY-MM-DD), location (Cidade, País), timeline (atividades do dia), suggestedActivities (atividades extras recomendadas) e pixabayTags (tags relevantes para encontrar uma imagem na API do Pixabay, separadas por vírgula).
Para cada atividade informe: time (HH:MM), title (descrição da atividade), description (detalhes adicionais), coordinates (latitude e longitude do local) e category.
Use apenas os dados fornecidos do usuário. Seja específico nos nomes dos locais.
IMPORTANTE: Cada dia DEVE ter NO MÍNIMO 3 atividades e NO MÁXIMO 8 atividades na timeline. NUNCA gere menos de 3 atividades por dia.
Retorne descrições ricas em detalhes com no mínimo 10 palavras.
As opções de categorias são (retorne apenas 1 por atividade): ${ACTIVITY_CATEGORIES.join(', ')}.`;

export const SURPRISE_DESTINATION_SYSTEM_PROMPT = `Você é um especialista em viagens. Baseado nas preferências do viajante, escolha UM continente específico e de 1 a 3 países que sejam perfeitos para esta viagem surpresa.
Escolha destinos que combinem com o orçamento, estilo de viagem e preferências mencionadas. Seja específico e criativo na escolha.`;

export const TRIP_PLAN_SYSTEM_PROMPT = `Você é um especialista em viagens. Planeje a rota de uma viagem dia a dia, respondendo no formato JSON pedido.
Para cada dia informe date (YYYY-MM-DD, a partir da data de início) e location (Cidade, País onde o viajante estará naquele dia).
Distribua as cidades de forma realista, considerando deslocamentos, o meio de locomoção e o ritmo da viagem.
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

export function buildSurpriseDestinationPrompt(preferences: TripPreferences): string {
  return `Preferências do viajante: ${tripDates(preferences)} ${travellerProfile(preferences)}`;
}

export function buildItineraryPrompt(preferences: TripPreferences, continent: string, countries: string[]): string {
  const destination = continent
    ? `Iremos para ${continent} e aos países ${countries.join(', ')} (Não acrescente outros locais).`
    : `Iremos aos países ${countries.join(', ')} (Não acrescente outros locais).`;

  return `${tripDates(preferences)} ${destination} ${travellerProfile(preferences)} ` +
    `Gere exatamente ${preferences.days} dias.`;
}

export function buildTripPlanPrompt(preferences: TripPreferences): string {
  const destination = preferences.countries.length > 0
    ? `Iremos ${preferences.continent ? `para ${preferences.continent} e ` : ''}aos países ${preferences.countries.join(', ')}.`
    : 'Destino surpresa: escolha o continente e os países.';

  return `${tripDates(preferences)} ${destination} ${travellerProfile(preferences)} Planeje exatamente ${preferences.days} dias.`;
}

/** Prompt de um bloco de dias, preso à rota já planejada para a viagem inteira. */
export function buildItineraryBlockPrompt(preferences: TripPreferences, plan: TripPlan, block: DayBlock): string {
  const route = plan.days
    .slice(block.firstDay - 1, block.lastDay)
    .map((day, i) => `Dia ${block.firstDay + i} (${day.date}): ${day.location}`)
    .join('; ');
  const blockDays = block.lastDay - block.firstDay + 1;

  return `${tripDates(preferences)} Viagem por ${plan.continent}, países ${plan.countries.join(', ')}. ${travellerProfile(preferences)} ` +
    `Gere somente os dias ${block.firstDay} a ${block.lastDay} desta viagem, seguindo exatamente esta rota: ${route}. ` +
    `Gere exatamente ${blockDays} dias, numerados de ${block.firstDay} a ${block.lastDay}.`;
}
