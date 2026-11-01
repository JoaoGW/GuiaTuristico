import type OpenAI from 'openai';
import { logAiUsage, toAiError } from '@/contexts/concierge/infrastructure/openaiClient';
import { itineraryIncomplete, itineraryRejected } from '../domain/itinerary';

interface StructuredRequest {
  systemPrompt: string;
  userPrompt: string;
  schemaName: string;
  schema: Record<string, unknown>;
  /** Sem retentativas: a soma das chamadas precisa caber no maxDuration de 120 s da rota. */
  timeoutMs: number;
}

/**
 * Pede JSON validado pelo schema (`strict`). Truncamento (`finish_reason = length`) ou recusa
 * viram 422 ITINERARY_REJECTED (cobrado); resposta vazia ou JSON inválido, 502 ITINERARY_INCOMPLETE.
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
      // Aprovado pelo Produto em 01/11/2026: com o prompt mais exigente, o esforço padrão (medium)
      // estourava o tempo da rota e chegava a 89% do teto anterior (6000). O teto só limita: a
      // cobrança é pelo que a IA escreve. O GPT-6 rejeita `temperature` com raciocínio ativo.
      reasoning_effort: 'low',
      max_completion_tokens: 8000
    }, { timeout: request.timeoutMs, maxRetries: 0 });
  } catch (error) {
    throw toAiError(error);
  }

  logAiUsage(request.schemaName, completion, startedAt);

  const choice = completion.choices[0];
  if (!choice) {
    throw itineraryIncomplete('resposta sem choices');
  }
  // Corte só é cobrado quando o texto gerado ocupou o limite (indício de preferências forçando a IA);
  // se o raciocínio consumiu a maior parte, o corte é do modelo e o bloco é devolvido.
  const reasoning = completion.usage?.completion_tokens_details?.reasoning_tokens ?? 0;
  const output = completion.usage?.completion_tokens ?? 0;
  if (choice.finish_reason === 'length' && reasoning >= output / 2) {
    throw itineraryIncomplete(`finish_reason=length dominado por raciocínio usage=${JSON.stringify(completion.usage)}`);
  }
  if (choice.finish_reason === 'length' || choice.message.refusal) {
    throw itineraryRejected(`finish_reason=${choice.finish_reason} recusa=${Boolean(choice.message.refusal)} usage=${JSON.stringify(completion.usage)}`);
  }
  if (!choice.message.content) {
    throw itineraryIncomplete('resposta vazia');
  }

  try {
    return JSON.parse(choice.message.content);
  } catch {
    throw itineraryIncomplete('JSON inválido');
  }
}
