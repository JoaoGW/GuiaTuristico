import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const prompt = `Gere recomendações de roteiro turístico, leve em consideração que sou uma pessoa que gosta de ${params.preferencias} e que esteja localizado em: ${params.localizacao}`
    // Parâmetros a serem adicionados em nosso prompt: 
    // 1 - Questionário de gostos pessoais (preferencias do usuário) 
    // 2 - Localização atual e/ou desejada
    // 3 - Horários de abertura conforme o dia atual
    // 4 - Tipo de viagem atual (amigos, família, sozinho) e considerar o budget (limite financeiro)

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      });

      const message = response.choices[0].message.content;
      res.status(200).json({ message });
    } catch (error) {
      console.error('Error generating response:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}