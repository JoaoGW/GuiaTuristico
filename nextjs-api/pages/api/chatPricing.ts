import type { NextApiRequest, NextApiResponse } from 'next';
import { TEXT_MESSAGE_COST, VOICE_MESSAGE_COST } from '@/contexts/concierge/domain/messagePricing';
import { ensureMethod } from '@/shared/http';

// Custo em "mensagens" (ganhas com anúncios recompensados) para o app mostrar antes do envio.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureMethod(req, res, ['GET'])) return;
  return res.status(200).json({ textMessage: TEXT_MESSAGE_COST, voiceMessage: VOICE_MESSAGE_COST });
}
