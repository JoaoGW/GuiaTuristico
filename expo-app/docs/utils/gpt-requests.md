# GPT Requests

Helpers para acessar endpoints do backend que intermediam chamadas à OpenAI.

- Arquivo: `src/utils/gptRequests.ts`
- Endpoints: `http://SEU-IP-AQUI:3000/api/generateItinerary` e `http://SEU-IP-AQUI:3000/api/justchat`

## API

- `generateItinerary(prompt: string): Promise<string>`
  - Envia `{ prompt }` e retorna `data.message` com o itinerário gerado.
- `generateChatAnswers(prompt: string): Promise<string>`
  - Envia `{ prompt }` e retorna `data.message` com a resposta do chat.

## Exemplo

```ts
import { generateItinerary, generateChatAnswers } from "@utils/gptRequests";

const itinerary = await generateItinerary("3 dias em Salvador focando em cultura e gastronomia");
const answer = await generateChatAnswers("Quais os melhores meses para visitar Floripa?");
```

## Dicas e erros comuns

- Substitua `SEU-IP-AQUI` pelo host da sua API (veja também `src/config.ts` onde há `API_URL` para outros módulos).
- HTTP 429: indica cota da OpenAI atingida; exponha mensagem ao usuário.
- Trate `response.ok` falso como erro de fluxo.
