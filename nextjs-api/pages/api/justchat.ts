import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export default async function JustChatHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-6-luna',
        messages: [{ role: 'assistant', content: prompt }],
        // O GPT-6 conta tokens de raciocínio neste limite e rejeita `temperature` com raciocínio ativo.
        max_completion_tokens: 1500
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