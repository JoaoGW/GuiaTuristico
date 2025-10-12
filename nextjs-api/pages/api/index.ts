import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../handler'; 
import { initializeFirebaseApp } from '../../firebase';

require('dotenv').config();

initializeFirebaseApp(); 

// Define a tipagem correta para a função handler do Next.js
export default async function apiHandler(

  req: NextApiRequest,
  res: NextApiResponse

) {

  try {
    // Loga as informações da requisição para debug
    console.log(`[REQUEST] ${req.method} ${req.url}`);

    // Determina o método da requisição para repassar ao seu handler original
    const method = req.method as "GET" | "POST" | undefined; 

    if (!method) {
      res.status(400).send('Método de requisição inválido.');
      return;
    }

    if(req.method === 'GET' || req.method === 'POST') {
      // chamar o handler 
      handler(req, res);
    }else{
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).send(`Método ${req.method} não permitido`);
    }

  }catch (error) {
    console.error("ERRO CRÍTICO NO HANDLER DA API:", error);
    res.status(500).send('Erro Interno do Servidor. Verifique os logs.');
  }

}
