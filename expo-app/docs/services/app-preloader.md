# AppPreloader

Serviço responsável por preparar o app antes do uso: checar disponibilidade da API, pré-carregar dados críticos e aquecer endpoints para respostas rápidas.

- Arquivo: `src/services/AppPreloader.ts`
- Exporta: `appPreloader` (singleton) e a classe `AppPreloader`

## Funcionalidades

- `checkApiAvailability(): Promise<boolean>`
  - Faz um health-check na API (`GET /weather` com timeout de 5s).
  - Retorna `true` se ok; `false` em erro/timeout.
- `preloadCriticalResources(): Promise<void>`
  - Executa tarefas de pré-carregamento não bloqueantes (ex.: `preloadCriticalData`).
- `warmUpApis(): Promise<void>`
  - Realiza chamadas leves para aquecer as APIs: weather, Google Places e chat.

## Endpoints envolvidos

- `GET ${API_URL}/weather?latitude=...&longitude=...`
- `GET ${API_URL}/googlePlacesApi?latitude=...&longitude=...`
- `POST ${API_URL}/justchat` (corpo: `{ prompt: string }`)

## Exemplo de uso

```ts
import { appPreloader } from "@services/AppPreloader";

async function bootstrap() {
  const apiOk = await appPreloader.checkApiAvailability();
  if (!apiOk) {
    // Exiba uma UI de manutenção/aviso
  }

  await appPreloader.preloadCriticalResources();
  // Opcional: await appPreloader.warmUpApis();
}
```

## Erros comuns e dicas

- API_URL incorreta: valide `src/config.ts`.
- Timeouts em redes lentas: ajuste o timeout ou trate `false` como estado degradado.
- Warm-up falha parcialmente: o método já usa `Promise.allSettled`; registre logs e siga.
