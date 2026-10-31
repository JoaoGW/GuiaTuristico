import type OpenAI from 'openai';
import { toAiError } from '@/contexts/concierge/infrastructure/openaiClient';
import { itineraryIncomplete } from '../domain/itinerary';

interface StructuredRequest {
  systemPrompt: string;
  userPrompt: string;
  schemaName: string;
  schema: Record<string, unknown>;
  /** Sem retentativas: a soma das chamadas precisa caber no maxDuration de 120 s da rota. */
  timeoutMs: number;
}

/**
 * Pede JSON validado pelo schema (`strict`). Truncamento (`finish_reason = length`),
 * recusa ou JSON inválido viram 502 ITINERARY_INCOMPLETE.
 */
export async function requestStructuredJson(openai: OpenAI, request: StructuredRequest): Promise<unknown> {
  let completion: OpenAI.Chat.Completions.ChatCompletion;
  const startedAt = Date.now();
  try {
    completion = await openai.chat.completions.create({
      model: 'gpt-6-luna',
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: request.schemaName, strict: true, schema: request.schema }
      },
      // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
      max_completion_tokens: 6000
    }, { timeout: request.timeoutMs, maxRetries: 0 });
  } catch (error) {
    throw toAiError(error);
  }

  // Sem dados do usuário: só tokens e tempo, para acompanhar o custo por crédito.
  const usage = completion.usage;
  console.info(
    `Uso da IA (${request.schemaName}): finish=${completion.choices[0]?.finish_reason} ` +
    `entrada=${usage?.prompt_tokens ?? 0} saída=${usage?.completion_tokens ?? 0} ` +
    `raciocínio=${usage?.completion_tokens_details?.reasoning_tokens ?? 0} duração=${Date.now() - startedAt}ms`
  );

  const choice = completion.choices[0];
  if (!choice || choice.finish_reason === 'length') {
    throw itineraryIncomplete(`finish_reason=${choice?.finish_reason ?? 'ausente'} usage=${JSON.stringify(completion.usage)}`);
  }
  if (choice.message.refusal || !choice.message.content) {
    throw itineraryIncomplete('resposta vazia ou recusada pela IA');
  }

  try {
    return JSON.parse(choice.message.content);
  } catch {
    throw itineraryIncomplete('JSON inválido');
  }
}
