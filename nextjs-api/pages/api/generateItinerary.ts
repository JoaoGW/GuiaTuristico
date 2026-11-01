import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { generateItinerary } from '@/contexts/itinerary/application/generateItinerary';
import { MAX_TRIP_DAYS, creditsForDays } from '@/contexts/itinerary/domain/credits';
import { creditWalletFor } from '@/contexts/billing/application/creditWallet';
import { generateLegacyItineraryText } from '@/contexts/itinerary/application/generateLegacyItineraryText';
import { guardAiRoute } from '@/shared/aiRouteGuard';
import { AppError } from '@/shared/errors';
import { ensureMethod, sendError } from '@/shared/http';

// O app espera até 120 s; as chamadas à OpenAI têm timeout menor para a resposta sair em JSON.
// 64 KB cobrem o prompt antigo e um plano de 28 dias reenviado; corpos maiores só serviriam para inflar o custo.
export const config: PageConfig = { maxDuration: 120, api: { bodyParser: { sizeLimit: '64kb' } } };

export default async function generateItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['POST'])) return;

  try {
    // Peso no limite de uso: o plano mais uma chamada por bloco de 7 dias.
    const days = Number(req.body?.days);
    const weight = Number.isInteger(days) && days >= 1 && days <= MAX_TRIP_DAYS ? creditsForDays(days) + 1 : 1;
    const user = await guardAiRoute(req, res, weight);
    const wallet = creditWalletFor(user?.uid ?? null);

    // Período de transição: builds publicados antes do FE-20 ainda enviam `{ prompt }`.
    if (req.body?.prompt !== undefined) {
      // O formato antigo não calcula créditos; com a cobrança ligada, ele daria roteiros sem débito.
      if (wallet) {
        throw new AppError(426, 'Atualize o app para gerar novos roteiros.', 'APP_UPDATE_REQUIRED');
      }
      const message = await generateLegacyItineraryText(req.body.prompt);
      return res.status(200).json({ message });
    }

    const { itinerary, plan, credits, missingDays } = await generateItinerary(req.body, wallet);
    return res.status(200).json({ itinerary, plan, credits, missingDays });
  } catch (error) {
    return sendError(res, error, 'Erro ao gerar roteiro');
  }
}
