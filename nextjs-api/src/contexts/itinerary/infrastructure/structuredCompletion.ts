import type OpenAI from 'openai';
import { toAiError } from '@/contexts/concierge/infrastructure/openaiClient';
import { itineraryIncomplete } from '../domain/itinerary';

interface StructuredRequest {
  systemPrompt: string;
  userPrompt: string;
  schemaName: string;
  schema: Record<string, unknown>;
}

/**
 * Pede JSON validado pelo schema (`strict`). Truncamento (`finish_reason = length`),
 * recusa ou JSON inválido viram 502 ITINERARY_INCOMPLETE.
 */
export async function requestStructuredJson(openai: OpenAI, request: StructuredRequest): Promise<unknown> {
  let completion: OpenAI.Chat.Completions.ChatCompletion;
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
    });
  } catch (error) {
    throw toAiError(error);
  }

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
