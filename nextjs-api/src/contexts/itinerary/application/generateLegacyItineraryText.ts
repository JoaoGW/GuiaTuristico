import { createOpenAIClient, toAiError } from '@/contexts/concierge/infrastructure/openaiClient';
import { requireText } from '@/shared/validation';

// O prompt do app antigo (answerPattern + preferências + categorias) fica bem abaixo disso.
const MAX_LEGACY_PROMPT_LENGTH = 10000;

/**
 * Contrato antigo `{ prompt }` → `{ message }` em texto livre (formato DAY->...), mantido só
 * enquanto houver app publicado sem o FE-20. Repete o comportamento anterior: o prompt do app
 * vai como mensagem `assistant`, sem schema. Remover quando os builds antigos saírem de uso.
 */
export async function generateLegacyItineraryText(rawPrompt: unknown): Promise<string | null> {
  const prompt = requireText(rawPrompt, 'prompt', MAX_LEGACY_PROMPT_LENGTH);
  const openai = createOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-6-luna',
      messages: [{ role: 'assistant', content: prompt }],
      // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
      max_completion_tokens: 6000
    }, { timeout: 110_000, maxRetries: 0 });

    return response.choices[0]?.message?.content ?? null;
  } catch (error) {
    throw toAiError(error);
  }
}
