import { parseConversation } from '../domain/conversation';
import { FELIPE_TEXT_CHAT_PROMPT } from '../domain/felipePersona';
import { createOpenAIClient, toAiError } from '../infrastructure/openaiClient';

/** Resposta do Felipe no chat de texto, considerando as últimas mensagens da conversa. */
export async function answerConversation(body: unknown): Promise<string> {
  const conversation = parseConversation(body);
  const openai = createOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-6-luna',
      messages: [{ role: 'system', content: FELIPE_TEXT_CHAT_PROMPT }, ...conversation],
      // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
      max_completion_tokens: 1500
    });

    return response.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';
  } catch (error) {
    throw toAiError(error);
  }
}
