import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export default async function generateItineraryHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const prompt = `Gere recomendações de um roteiro turístico, leve em consideração os seguintes 
                    interesses do usuário: Vida Noturna, Restaurantes de Alto Escalão e Locais com muito movimento. 
                    Além disso, o usuário está localizado em: São Paulo, Capital e seu orçamento é de 15.000 reais para 5 dias.`
    // Parâmetros a serem adicionados em nosso prompt (substituir onde temos params fixos): 
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