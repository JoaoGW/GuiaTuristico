import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Configurar o OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Mensagem é obrigatória',
        details: 'Envie o campo "message" no corpo da requisição'
      });
    }

    // Criar prompt contextualizado para Felipe, o guia turístico
    const systemPrompt = context || `Você é Felipe, um guia turístico virtual brasileiro especializado e experiente. Suas características:

- Você é simpático, prestativo e conhece muito sobre turismo no Brasil e no mundo
- Você fala de forma natural e amigável, como um guia humano
- Você fornece informações práticas e úteis sobre destinos, atrações, hospedagem, transporte, gastronomia
- Você sugere roteiros personalizados baseados nos interesses do turista
- Você conhece dicas locais, preços aproximados e melhores épocas para visitar lugares
- Você responde em português brasileiro
- Mantenha suas respostas concisas (máximo 2-3 frases para conversas por voz)
- Seja sempre positivo e entusiasmado sobre viagens

Responda à pergunta do turista de forma útil e prática:`;

    // Fazer chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 150, // Limitar para respostas concisas
      temperature: 0.7, // Um pouco de criatividade
    });

    const response = completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';

    return res.status(200).json({
      success: true,
      response: response,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('Erro ao gerar resposta do chat:', error);

    if (error.status === 401) {
      return res.status(500).json({
        error: 'Erro de autenticação',
        details: 'API key da OpenAI inválida ou expirada'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Limite de taxa excedido',
        details: 'Muitas requisições. Tente novamente em alguns segundos.'
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Falha ao gerar resposta do chat',
      message: error.message || 'Erro desconhecido'
    });
  }
}
