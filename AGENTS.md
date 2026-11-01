# Instruções do Projeto para Claude e Codex

Este é o único `AGENTS.md` do repositório e a fonte compartilhada de contexto para agentes. `CLAUDE.md` acrescenta os fluxos de `.claude/`; `CODEX.md` descreve o uso pelo Codex.

## Contexto do Repositório

**GuiaTuristico — EZ Trip AI** (nome do app: `EzTripAI`) é um guia turístico com Inteligência Artificial, desenvolvido como TCC por João Pedro, Lucas Kenji e Caio Pereira. O usuário vê pontos turísticos próximos em mapa, conversa por texto ou voz com o guia virtual **Felipe** (mascote), gera roteiros personalizados com IA, consulta exigência de visto, controla gastos e salva lugares favoritos.

Repositório: `https://github.com/JoaoGW/GuiaTuristico` (branches `master` e `development`).

O repositório é um monorepo com dois pacotes npm **independentes** (sem workspaces; o `package-lock.json` da raiz é vazio). Instale e execute comandos dentro de cada pacote.

| Pacote | Papel | Stack principal |
| --- | --- | --- |
| `expo-app/` | App mobile Android e iOS (web via `react-native-web`, sem uso ativo) | Expo SDK 57, React Native 0.86 (New Architecture), React 19.2, TypeScript ~6.0 `strict`, React Navigation 7 (native-stack), Gluestack UI v1 (`@gluestack-ui/themed`), Firebase Auth 12 |
| `nextjs-api/` | Backend/proxy que guarda as chaves de OpenAI, Google Places e WeatherAPI; página de documentação dos endpoints | Next.js 16 (API em `pages/api/`, App Router só para a página `/`), SDK `openai` 7.x (exige Node 22+), `formidable`, Tailwind CSS 4 |

A API de produção está na Vercel: `https://guiaturisticoeztripai.vercel.app/api`. O app escolhe a URL em `expo-app/src/config.ts`: no Expo Go com `DEV_API_URL` definido usa a API local; em qualquer build standalone usa a Vercel.

## Estrutura de Diretórios

```
GuiaTuristico/
├── docker-compose.yml        # nextjs-api (3000) + expo-app (19000-19002)
├── README.md, SETUP_LOCAL.md # visão geral e setup com Docker
├── .github/workflows/        # ci.yml, deploy.yml, docker-publish.yml
├── AGENTS.md, CLAUDE.md, CODEX.md, CLAUDE.local.md  # instruções para agentes
├── docs/                     # DESIGN.md e DesignIA_Regras.md
├── .claude/                  # regras, skills, comandos, agentes e permissões do Claude Code
├── expo-app/
│   ├── App.tsx, index.ts     # bootstrap: fontes, splash, AdMob/ATT, providers
│   ├── firebase.ts           # initializeApp + getAuth
│   ├── app.json, eas.json    # config Expo e perfis EAS
│   ├── @types/               # tipos de domínio (Places, Itinerary, Chat, Voice, Visa...)
│   ├── config/               # tema Gluestack local (não importado pelo App)
│   ├── docs/                 # documentação técnica de services, utils e config
│   ├── Docker/               # Dockerfile.dev e Dockerfile.eas
│   └── src/
│       ├── assets/           # imagens, ilustrações (Storyset), mascote Felipe (SVG)
│       ├── components/       # UI por domínio: Buttons, Cards, Chat, Dialogs, Errors, Home, Itinerary, Maps, Modals, Profile...
│       ├── config.ts         # seleção da URL da API (dev/prod)
│       ├── config/voiceConfig.ts
│       ├── contexts/         # AuthContext, NetInfo, requestDeviceLocation
│       ├── data/             # dados estáticos/ilustrativos (destinos, roteiros, tags, países)
│       ├── hooks/            # useAuthForm, useExpenseControl, useFavoritePlaces, useVoiceChat
│       ├── routes/           # index, auth.routes, noauth.routes
│       ├── screens/          # AIChat, Credentials, HomePage, Itinerary, Premium, Presentations, UserProfile
│       ├── services/         # login/*, voiceService, storageManager, felipeResponseSystem, admob, AppPreloader
│       └── utils/            # gptRequests, geoDecoder, stores Zustand, validators, loaders
└── nextjs-api/
    ├── pages/api/            # endpoints (ver tabela abaixo): adaptadores HTTP finos
    ├── src/contexts/         # Bounded Contexts (DDD): catalog, concierge, itinerary, profile, cada um com domain/application/infrastructure
    ├── src/shared/           # núcleo compartilhado: AppError, respostas de erro, validação, guarda das rotas de IA
    ├── utils/responseCache.ts# cache em memória das respostas do Felipe
    ├── app/                  # página "Documentação APIs - EZ Trip AI" (mesmo nível de pages/, exigido pelo Next 16)
    ├── src/components/SwaggerAccordion.tsx
    └── Docker/Dockerfile
```

Aliases do app (em `tsconfig.json` e `babel.config.js`): `@assets`, `@components`, `@routes`, `@screens`, `@storage`, `@theme`, `@utils`, `@data`, `@contexts`, `@services`, `@config`, `@hooks`. Os tipos de `expo-app/@types/` são importados por caminho relativo. Na API, `@/*` aponta para `nextjs-api/src/*`.

## Rotas da API (`nextjs-api/pages/api/`)

| Método e rota | Entrada | Serviço externo | Saída | Consumidor no app |
| --- | --- | --- | --- | --- |
| `GET /api/googlePlacesApi` | `latitude`, `longitude` (validados) | Google Places Nearby Search (raio 1500 m, `tourist_attraction`) | `{ results }` com DTO próprio (`place_id`, `name`, `vicinity`, `rating`, `icon`, `geometry.location`, `opening_hours.open_now`, `photos[0].photo_reference`); sem `photo_url` | `screens/HomePage/Home.tsx`, `components/Maps/Maps.tsx` (Home ainda lê `photo_url`: migração FE-10) |
| `GET /api/googlePhotoProxy` | `photo_reference` | Google Place Photo (`maxwidth=400`) | bytes da imagem | `components/Home/Destinations.tsx` |
| `GET /api/weather` | `latitude`, `longitude` (validados) | WeatherAPI.com `current.json` (HTTPS) | JSON da WeatherAPI | `screens/AIChat/AIChat.tsx` |
| `GET /api/passportVisa` | `origin`, `destination` (ISO alfa-2) | `rough-sun-2523.fly.dev/visa/{origin}/{destination}` | JSON do serviço com `category.code` validado; falha → 503 `VISA_UNAVAILABLE` | `screens/Itinerary/ItineraryVisaCheck.tsx` |
| `POST /api/generateItinerary` | preferências estruturadas (`dateBegin`, `dateEnd`, `days`, `continent?`, `countries?`, `originCountry`, `budget`, `peopleQuantity`, `accompanying`, `tripStyles`, `locomotionMethods`, `specialWish?`, `userPreferences?`) | OpenAI Chat Completions com JSON Schema | `{ itinerary: { continent, countries, days[] }, plan, credits: { required, charged }, missingDays }`; nada gerado → 502 `ITINERARY_INCOMPLETE`. Nova tentativa de blocos: mesmas preferências + `plan` + `blocks`. `peopleQuantity` é o total de viajantes, incluindo quem cria o roteiro. Transição: `{ prompt }` (app anterior ao FE-20) ainda devolve `{ message }` em texto | `utils/gptRequests.ts` → `generateItinerary` |
| `POST /api/justchat` | `{ messages: [{ role, content }] }` ou `{ prompt }` (legado) | OpenAI Chat Completions | `{ message }` | `utils/gptRequests.ts` → `generateChatAnswers` (histórico: migração FE-12) |
| `POST /api/chat` | `{ message }` | OpenAI Chat Completions | `{ success, response, usage }` | sem consumidor atual no app |
| `POST /api/voiceChat` | multipart, campo `audio` com mimetype `audio/*` (≤ 2 MB, ~15 s) | OpenAI Whisper + Chat Completions | `{ success, transcription, response, audioInfo, usage }` | `services/voiceService.ts` |
| `GET` / `DELETE /api/cacheStats` | — | — | estatísticas / limpeza do cache (DELETE só fora de produção; 403 em produção) | depuração |
| `GET /api/itineraryQuote` | `days` (1 a 28) | — | `{ days, credits, daysPerCredit, maxDays }` | tela de preferências do roteiro (FE) |
| `GET /api/version` | — | — | `{ commit, branch, environment }` (variáveis de sistema da Vercel) | verificação de deploy |

A página `/` (`app/page.tsx`) lista e documenta esses endpoints com `SwaggerAccordion`.

Contrato comum: método errado → 405 com `Allow`; entrada inválida → 400; erros sempre em JSON `{ error: "Mensagem em pt-BR.", code? }`, sem `message`/`details` internos. Chave ausente → 503; falha do provedor externo → 502 (visto: 503 `VISA_UNAVAILABLE`); OpenAI 401 → 500 `AI_AUTH_ERROR`, 429 → 429, tempo limite → 504 `AI_TIMEOUT`, conta sem saldo → 503 `AI_QUOTA_EXCEEDED`.

Tempo máximo na Vercel (`export const config.maxDuration`): `generateItinerary` 120 s; `chat`, `justchat` e `voiceChat` 60 s. Cada chamada à OpenAI tem timeout menor que o da rota (roteiro: 110 s em um bloco, ou 30 s do destino/plano + 80 s dos blocos em paralelo, sem retentativa; chat: 25 s com 1 retentativa; voz: 15 s de transcrição + 25 s de resposta, sem retentativa), para que a falha saia em JSON. Os 120 s exigem Fluid compute ou plano Pro na Vercel.

### Créditos de IA no roteiro

Regra do Produto (01/11/2026): cada bloco de até 7 dias consome 1 crédito (1–7 dias = 1, 8–14 = 2, 15–21 = 3, 22–28 = 4); o máximo é 28 dias. A regra fica em `src/contexts/itinerary/domain/credits.ts`.

- Toda geração começa por um plano da viagem (`plan`): data, dia da semana, cidade e 2 a 3 atrações principais (`highlights`) por dia. No Modo Surpresa, o plano também escolhe continente e países. Datas e dias da semana são calculados no servidor a partir de `dateBegin` (`DD/MM/AAAA` ou `AAAA-MM-DD`, em `domain/tripCalendar.ts`); a IA não faz contas de calendário.
- Depois, os blocos de até 7 dias são gerados em paralelo. Cada bloco recebe a rota com dia da semana e destaques dos seus dias e a lista de destaques dos outros dias, para não repetir atrações. Número, data e cidade de cada dia vêm do plano.
- As chamadas estruturadas (plano e blocos) usam `reasoning_effort: 'low'` e `max_completion_tokens` 8000, aprovados pelo Produto em 01/11/2026, e o schema fixa a quantidade exata de dias (`minItems`/`maxItems`). Medição real: 7 dias em ~42 s e 28 dias em ~62 s; ~US$ 0,002 por crédito mais ~US$ 0,001 do plano.
- Só os blocos gerados com sucesso são cobrados (`credits.charged`); os dias dos blocos que falharam vêm em `missingDays`. Se nenhum bloco sair, a resposta é um erro e nada é cobrado. O plano não consome crédito.
- Nova tentativa: o app reenvia as preferências com o `plan` recebido e `blocks` (números dos blocos que faltaram); cada bloco gerado consome 1 crédito.
- `GET /api/itineraryQuote?days=N` informa o custo antes da geração. O formato antigo `{ prompt }` não calcula créditos.
- Saldo e débito ficam no RevenueCat (moeda virtual), pelo contexto `src/contexts/billing` (Developer API v2, chave secreta, só no servidor). A cobrança fica desligada até existirem `REVENUECAT_SECRET_API_KEY` (chave v2 com `customer_information:purchases:read_write`), `REVENUECAT_PROJECT_ID` e `REVENUECAT_CREDITS_CURRENCY` (código da moeda criada no painel). `REVENUECAT_API_BASE_URL` só serve para testes locais com servidor simulado.
- Com a cobrança ligada: o cliente no RevenueCat é o uid do Firebase (o app precisa chamar `Purchases.logIn(uid)`), então `AI_AUTH_REQUIRED=true` é obrigatório; sem uid a rota responde 503 `BILLING_MISCONFIGURED`. Antes da IA, a API confere o saldo dos blocos pedidos (402 `INSUFFICIENT_CREDITS`; cliente inexistente conta como saldo zero). Depois, debita só os blocos gerados com `Idempotency-Key` (uma nova tentativa com a mesma chave em falha temporária) e informa `credits.debited`. Se o débito falhar após a geração (por exemplo, dois roteiros simultâneos esgotando o saldo), o roteiro é entregue com `debited: false` e o caso fica no log para conciliação. O formato antigo `{ prompt }` responde 426 `APP_UPDATE_REQUIRED`.
- Ajustes de saldo pela API do RevenueCat não geram webhooks; o app deve recarregar o saldo do SDK (`Purchases.getVirtualCurrencies()`, SDK 9.1.0+) depois de gerar um roteiro.
- Cada chamada estruturada registra no log `Uso da IA (<schema>)` com tokens de entrada, saída e raciocínio e a duração, sem dados do usuário, para acompanhar o custo por crédito.

As rotas de IA (`chat`, `justchat`, `generateItinerary`, `voiceChat`) passam por `src/shared/aiRouteGuard.ts`: limite de 20 requisições por minuto por usuário (ou IP), em memória de cada instância, e, com `AI_AUTH_REQUIRED=true` + `FIREBASE_PROJECT_ID`, exigem `Authorization: Bearer <ID token do Firebase>` (401 `UNAUTHENTICATED`). A verificação do token usa `node:crypto` e os certificados públicos do Google, sem `firebase-admin`. A autenticação fica desligada até o app enviar o token (FE-10).

## Modelos de LLM e Voz

| Uso | Modelo | Parâmetros | Prompt |
| --- | --- | --- | --- |
| `/api/chat` | `gpt-6-luna` | `max_completion_tokens` 600, sem `temperature` | `system` = persona Felipe (o `context` do corpo não é mais aceito) |
| `/api/justchat` | `gpt-6-luna` | `max_completion_tokens` 1500, sem `temperature` | `system` = regra de turismo + persona Felipe (no servidor); últimas 10 mensagens como `user`/`assistant`; `{ prompt }` legado vira uma mensagem `user` |
| `/api/generateItinerary` | `gpt-6-luna` | `max_completion_tokens` 6000 por chamada, sem `temperature`, `response_format` JSON Schema `strict` | prompts `system`/`user` montados em `src/contexts/itinerary/domain/itineraryPrompt.ts`; Modo Surpresa faz 2 chamadas (destino e roteiro) |
| `/api/voiceChat` — transcrição | `whisper-1` | `language: 'pt'`, `temperature` 0, `response_format: 'text'` | começa por m4a; tenta mp3, wav e mp4 só quando a OpenAI recusa o formato |
| `/api/voiceChat` — resposta | `gpt-6-luna` | `max_completion_tokens` 600, sem `temperature` | persona Felipe para voz (2–3 frases); usa `responseCache` antes de chamar a OpenAI |
| Síntese de voz (app) | `expo-speech` (TTS do dispositivo) | `pt-BR`, voz `pt-br-x-ptd-network`, `pitch` 0.9 | `src/config/voiceConfig.ts` |
| Respostas offline (app) | sem modelo | palavras-chave | `src/services/felipeResponseSystem.ts` |

O modelo foi trocado de `gpt-3.5-turbo` para `gpt-5.6-luna` (commit `388adeb`) e, em 30/10/2026, para `gpt-6-luna`. O GPT-6 usa raciocínio (esforço padrão `medium`), conta esses tokens em `max_completion_tokens` (o `max_tokens` está obsoleto no SDK e não é compatível com modelos de raciocínio) e rejeita `temperature` com raciocínio ativo; por isso os limites foram ampliados e `temperature` foi removida. O SDK foi atualizado para `openai` 7.x em 30/10/2026 (tipo de `reasoning_effort` já aceita `none`); a escolha de `reasoning_effort` por rota ainda depende do responsável. A versão em produção na Vercel ainda usava `gpt-3.5-turbo` (descontinuado) em 30/10/2026; o deploy depende de autorização. O nome do modelo aparece literalmente em cada caso de uso (`src/contexts/concierge/application/*`, `src/contexts/itinerary/infrastructure/structuredCompletion.ts`) e no campo `usage` de `voiceChat`; não há constante compartilhada. A persona do Felipe fica em `src/contexts/concierge/domain/felipePersona.ts`. `responseCache` guarda até 100 respostas por 24 h em memória do processo (similaridade ≥ 0,8 por palavras) e tem respostas pré-definidas para saudações, agradecimentos e despedidas.

## Navegação do App

React Navigation 7 com `NavigationContainer` em `src/routes/index.tsx`, que alterna as pilhas conforme `useAuth().isAuthenticated`.

- **Sem autenticação** (`noauth.routes.tsx`): `Introduction`, `Login`, `SignUp`, `ForgotPassword`.
- **Autenticado** (`auth.routes.tsx`, tipo `AuthNavigationProp`): `Home`, `Profile`, `EditProfile`, `UserPreferences`, `GenerateItineraryFeaturesIntroduction`, `GenerateItineraryMenu`, `GenerateItineraryPreferences`, `ItineraryVisaCheck`, `ItineraryMapMenu`, `FavoritePlaces`, `ExpenseControl`, `AIMascotIntroduction`, `AIChatMenu`, `AIChat`, `AIVoiceChat`, `MapsExpanded`, `Notifications`, `DestinationDetail`, `RecommendedDestinations`, `PremiumPlans`, `WelcomePremium`, `ManagePremiumPlan`, `OptionsManagePremiumPlan`, `CancelPremiumPlan`.
- `NavigationBar` (barra inferior flutuante) aparece nas telas embrulhadas por `ScreenWrapper` e tem 5 itens: Roteiros, Chat IA, Início, Gaming (sem tela; só muda o item ativo) e Perfil.
- Fluxo de roteiro: `GenerateItineraryMenu` → `GenerateItineraryPreferences` → `ItineraryVisaCheck` → `ItineraryMapMenu` (exportação em PDF via `expo-print`/`expo-sharing`).

## Dados, Estado e Persistência

- Autenticação: Firebase Auth (e-mail/senha, redefinição de senha e Google Sign-In via `@react-native-google-signin/google-signin`). Não há Firestore nem banco próprio.
- Persistência local: `AsyncStorage` com chaves `@eztripai_chatHistory_{chatId}`, `@eztripai_allChatsHistory` e `@eztripai_allUserTripItineraries`.
- Estado global: contexts (`AuthContext`, `NetInfo`, `requestDeviceLocation`) e Zustand (`notificationStore`, `selectedTagsStore`).
- `src/data/` contém dados estáticos e ilustrativos (destinos, roteiros de exemplo, tags, códigos de país); não são contrato de dados.
- Planos Premium são apenas telas: não há biblioteca ou integração de pagamento.
- Anúncios: `react-native-google-mobile-ads` + `expo-tracking-transparency`, ignorados no Expo Go.

## Dependências Externas

| Serviço | Onde | Credencial |
| --- | --- | --- |
| OpenAI (Chat Completions, Whisper) | `nextjs-api` | `OPEN_AI_KEY` |
| Google Places (Nearby Search, Place Photo) | `nextjs-api` | `GOOGLE_PLACES_API_KEY` |
| WeatherAPI.com | `nextjs-api` | `WEATHER` |
| Serviço de vistos `rough-sun-2523.fly.dev` | `nextjs-api` | nenhuma |
| RevenueCat (moeda virtual dos créditos de IA, Developer API v2) | `nextjs-api` (`src/contexts/billing`) | `REVENUECAT_SECRET_API_KEY`, `REVENUECAT_PROJECT_ID`, `REVENUECAT_CREDITS_CURRENCY` |
| Nominatim / OpenStreetMap (geocodificação reversa) | `expo-app/src/utils/geoDecoder.ts` | nenhuma |
| Firebase Auth | `expo-app/firebase.ts` | `EXPO_PUBLIC_FIREBASE_*` |
| Google Sign-In | `expo-app/src/services/login/googleLogin.ts` | `EXPO_PUBLIC_WEB_CLIENT_ID`, `EXPO_PUBLIC_IOS_CLIENT_ID` |
| Google AdMob | `expo-app` (`app.json`, `services/admob`) | IDs em `app.json` e `EXPO_PUBLIC_ADMOB_*` |
| Mapas | `expo-maps`, `react-native-maps`, `expo-location` | permissões de localização |
| Hospedagem e build | Vercel (API), EAS (projeto `080ff03d-…`), GHCR (imagens Docker) | segredos fora do repositório |

Variáveis lidas pelo código (somente nomes; nunca leia ou registre valores): API — `OPEN_AI_KEY`, `GOOGLE_PLACES_API_KEY`, `WEATHER`, `AI_AUTH_REQUIRED`, `FIREBASE_PROJECT_ID`, `REVENUECAT_SECRET_API_KEY`, `REVENUECAT_PROJECT_ID`, `REVENUECAT_CREDITS_CURRENCY` e as de sistema da Vercel `VERCEL_GIT_COMMIT_SHA`, `VERCEL_GIT_COMMIT_REF`, `VERCEL_ENV`; app — `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_FIREBASE_APP_ID`, `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`, `EXPO_PUBLIC_WEB_CLIENT_ID`, `EXPO_PUBLIC_IOS_CLIENT_ID`, `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID`, `EXPO_PUBLIC_ADMOB_IOS_APP_ID` e `DEV_API_URL` (via `@env`, `react-native-dotenv`, arquivo `.env.local`). Cada pacote lê o próprio `.env.local`.

## Prioridade e Escopo

Em caso de conflito, siga esta ordem:

1. Pedido explícito do usuário e requisitos aprovados.
2. Código, `package.json`, `app.json`, `eas.json`, `tsconfig.json`, `next.config.ts` e documentação deste repositório.
3. Estas instruções.
4. Convenções gerais.

Não escolha silenciosamente entre requisitos conflitantes. Explique o conflito e peça direção. Antes de editar, inspecione o menor conjunto relevante de telas, componentes, serviços, rotas da API e configurações. Para uma tarefa com várias etapas, defina critérios observáveis de sucesso e mantenha o plano curto.

Altere apenas os arquivos necessários. Não refatore, reformate ou remova código adjacente sem relação direta com o pedido. Remova somente o que a própria alteração tiver tornado obsoleto. Não crie abstrações para um único uso, funcionalidades especulativas, dependências ou configurações sem aprovação.

## Convenções de Código

- App: telas em `src/screens/<Domínio>/`, componentes em `src/components/<Domínio>/`, hooks em `src/hooks/`, chamadas de rede em `src/services/` ou `src/utils/gptRequests.ts`, tipos de domínio em `expo-app/@types/`.
- Registre telas novas na pilha correta (`auth.routes.tsx` ou `noauth.routes.tsx`) e no tipo de parâmetros correspondente; use `useNavigation<AuthNavigationProp>()`.
- Use os aliases (`@components/...`, `@services/...`) já adotados; use `API_URL` de `src/config.ts` para chamar a API, nunca uma URL fixa.
- UI com componentes de `@gluestack-ui/themed` e ícones `lucide-react-native`, como no restante do app.
- API: um arquivo por endpoint em `pages/api/`, validação de método (405) e de parâmetros (400) no início, chaves só via `process.env`, mensagens de erro sem segredos.
- Tipos explícitos nas fronteiras (props, parâmetros de rota, payloads da API e de serviços externos). Evite novos `any`, supressões de tipo e casts amplos.
- Mantenha tipos próximos do único consumidor; mova-os para `@types/` somente após uma segunda reutilização real.
- Comente decisões, restrições ou comportamento não óbvio. Não documente o que o código já deixa claro e não adicione comentários `TODO`.

## Interface e Acessibilidade

- `docs/DesignIA_Regras.md` é sempre a regra superior de design. Depois, siga `docs/DESIGN.md` (v2.0, com referência visual em `docs/EZTripAI_Design_System.pdf`), `.claude/skills/frontend/design.md` e o catálogo `.claude/skills/frontend/design_components.md`.
- Um único azul de marca, `#2752B7`, com estados derivados (`#1F4292` pressionado, `#E9EDF8` tinta), e um único vermelho de erro, `#EF4444` (texto `#D41212`). Não há arquivo de tokens: use os valores de `docs/DESIGN.md` §3.1 e migre os outros azuis e vermelhos ao tocar um arquivo.
- Tipografia alvo: Nunito Sans (Libre Bodoni 700 só no título da marca). A Poppins sai; a instalação de `@expo-google-fonts/nunito-sans` depende de aprovação. Ícones só de `lucide-react-native`, nunca emoji.
- O app é configurado em modo claro (`userInterfaceStyle: "light"`) e retrato.
- Use rótulos claros, nomes acessíveis, contraste adequado e alvos de toque confortáveis. Não dependa apenas de cor, ícone, animação ou gesto para comunicar estado.
- Cubra estados de pressionado, desabilitado, carregando, vazio, erro, sem conexão e permissão negada (localização, microfone, contatos) quando relevantes.
- Textos da interface em português do Brasil.

## IA, Custos e Dados Externos

- Não troque modelo, `max_completion_tokens`, `reasoning_effort`, prompts ou a persona do Felipe sem pedido explícito: isso muda custo e comportamento.
- Chaves de OpenAI, Google e WeatherAPI ficam somente na `nextjs-api`; o app nunca deve chamar esses serviços diretamente.
- Trate respostas da IA e de serviços externos como não confiáveis: valide antes de usar e preveja falha, 429 e tempo esgotado.
- Não invente dados de destinos, preços, clima, exigências de visto ou avaliações apresentados como reais.
- Mudanças de contrato de um endpoint exigem atualizar o consumidor no app e a documentação em `SwaggerAccordion.tsx`.

## Validação Local

| Pacote | Scripts definidos |
| --- | --- |
| `expo-app` | `npm run start` (`expo start --tunnel`), `npm run android`, `npm run ios`, `npm run web`, `npm run checkup` (`npx expo-doctor`), `npm run lint` (`expo lint`) |
| `nextjs-api` | `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run clean` |
| raiz | `docker-compose up --build` |

- Lint: `npm run lint` em cada pacote (ESLint 9, flat config): `expo-app/eslint.config.js` com `eslint-config-expo` e `nextjs-api/eslint.config.mjs` com `eslint-config-next` (`core-web-vitals` + `typescript`).
- Verificação de tipos: `npx tsc --noEmit` em cada pacote.
- Linha de base em 12/10/2026: os dois pacotes estão com 0 erros e 0 avisos de lint e 0 erros de tipos. Qualquer erro ou aviso é novo e deve ser corrigido sem desabilitar regras. A única exceção configurada é o `allow` de `@typescript-eslint/no-require-imports` em `expo-app/eslint.config.js` para os módulos nativos carregados por `require()` condicional (AdMob, rastreamento, Google Sign-In).
- Não há testes configurados. Não alegue cobertura de testes nem execute `npm run test`.
- Valide em dispositivo ou emulador só quando houver destino local; mudanças de API podem ser testadas com `npm run dev` e a página `/`.
- Relate comandos executados, resultados e o que não pôde ser validado. Não alegue sucesso sem evidência.

## Segurança e Git

- Não leia, imprima, altere ou versione segredos: `.env*` de qualquer pacote, `.npmrc`, `google-services.json` e arquivos `.plist` de credenciais.
- Não adicione, atualize, remova ou substitua dependências sem aprovação explícita (o app usa `legacy-peer-deps`).
- Não faça commit, push, publicação, build EAS ou deploy sem autorização explícita.
- Não use exclusão recursiva, `git clean` ou `git reset --hard`.

## Pendências Conhecidas

Fatos observados no código em 12/10/2026; não os corrija sem pedido.

1. Resolvida em 30/10/2026 (BE-11): `ignoreBuildErrors` removido, `turbopack.root` definido e sem avisos de rastreamento no `voiceChat`. A página de documentação ainda usa `next/font/google` (Geist), que exige rede na build.
2. Não há testes automatizados em nenhum pacote.
3. Resolvida em 30/10/2026: `npm run clean` usa `fs.rmSync` via `node -e`.
4. Parcialmente resolvida em 30/10/2026: `googlePlacesApi` não devolve mais `photo_url` (a chave exposta ainda precisa ser rotacionada), `DELETE /api/cacheStats` é bloqueado em produção e as rotas de IA têm limite por instância e autenticação opcional (`AI_AUTH_REQUIRED`). Falta o limite global (armazenamento externo, sem aprovação) e ligar a autenticação depois do FE-10.
5. `expo-app` declara `next` e `openai` como dependências, mas o código de `src/` não os importa. `config/gluestack-ui.config.ts` não é usado (o App importa `@gluestack-ui/config`).
6. `app.json` → `extra` contém placeholders `${FIREBASE_*}` que não são interpolados; o código usa `process.env.EXPO_PUBLIC_*`.
7. `expo-app/Docker/Dockerfile.eas` usa a imagem inexistente `node20:slim` e um `CMD` inválido.
8. `expo-doctor` aponta: dependências de pares ausentes (`expo-font` para `@expo/vector-icons`, `expo-asset` para `expo-audio`), `react-native-safe-area-context` duplicado (4.5.0 dentro de `react-native-calendars`) e `@expo/config-plugins` instalado diretamente.
9. `EditProfile` exibe "Informações salvas com sucesso!" sem persistir os dados do formulário.

## Regras de Revisão de Código

Ao revisar mudanças, reporte apenas problemas concretos e acionáveis. Verifique correção, regressões, navegação, contratos entre app e API, tratamento de erros de rede e de IA, segurança de chaves, acessibilidade e estados de UI. Para cada problema, informe prioridade, arquivo e linha, evidência, impacto e a menor correção recomendada. Não reporte preferências puramente estilísticas.

Se não houver um problema concreto, responda: `No actionable findings found.`
