import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { generateItinerary } from '@/contexts/itinerary/application/generateItinerary';
import { generateLegacyItineraryText } from '@/contexts/itinerary/application/generateLegacyItineraryText';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { ensureMethod, sendError } from '@/shared/http';

// O app espera até 120 s; as chamadas à OpenAI têm timeout menor para a resposta sair em JSON.
export const config: PageConfig = { maxDuration: 120 };

export default async function generateItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    await guardAiRoute(req, res);

    // Período de transição: builds publicados antes do FE-20 ainda enviam `{ prompt }`.
    if (req.body?.prompt !== undefined) {
      const message = await generateLegacyItineraryText(req.body.prompt);
      return res.status(200).json({ message });
    }

    const itinerary = await generateItinerary(req.body);
    return res.status(200).json({ itinerary });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar roteiro');
  }
}
