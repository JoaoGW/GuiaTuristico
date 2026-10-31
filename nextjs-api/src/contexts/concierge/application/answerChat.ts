import { requireText } from '@/shared/validation';
import { FELIPE_CHAT_PROMPT } from '../domain/felipePersona';
import { createOpenAIClient, toAiError } from '../infrastructure/openaiClient';

const MAX_MESSAGE_LENGTH = 2000;

/** Resposta única do Felipe para `/api/chat`; o system prompt é sempre o do servidor. */
export async function answerChat(rawMessage: unknown) {
  const message = requireText(rawMessage, 'message', MAX_MESSAGE_LENGTH);
  const openai = createOpenAIClient();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-6-luna',
      messages: [
        { role: 'system', content: FELIPE_CHAT_PROMPT },
        { role: 'user', content: message }
      ],
      // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
      max_completion_tokens: 600,
    });

    return {
      response: completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.',
      usage: completion.usage
    };
  } catch (error) {
    throw toAiError(error);
  }
}
