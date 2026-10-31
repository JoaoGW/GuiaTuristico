import { badRequest } from '@/shared/errors';
import { requireText } from '@/shared/validation';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Só as últimas mensagens vão para a OpenAI, para limitar custo por chamada.
export const MAX_HISTORY_MESSAGES = 10;
const MAX_RECEIVED_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_LEGACY_PROMPT_LENGTH = 2000;

/**
 * Aceita `{ messages: [{ role, content }] }` ou o formato antigo `{ prompt }`,
 * mantido até o app migrar (FE-12). A última mensagem precisa ser do usuário.
 */
export function parseConversation(body: unknown): ChatMessage[] {
  const { messages, prompt } = (body ?? {}) as { messages?: unknown; prompt?: unknown };

  if (messages === undefined) {
    return [{ role: 'user', content: requireText(prompt, 'prompt', MAX_LEGACY_PROMPT_LENGTH) }];
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_RECEIVED_MESSAGES) {
    throw badRequest(`O campo "messages" deve ser uma lista com 1 a ${MAX_RECEIVED_MESSAGES} mensagens.`);
  }

  const conversation = messages.slice(-MAX_HISTORY_MESSAGES).map((item: unknown): ChatMessage => {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') {
      throw badRequest('Cada mensagem deve ter role "user" ou "assistant".');
    }
    return { role, content: requireText(content, 'messages[].content', MAX_MESSAGE_LENGTH) };
  });

  if (conversation[conversation.length - 1].role !== 'user') {
    throw badRequest('A última mensagem deve ser do usuário.');
  }

  return conversation;
}
