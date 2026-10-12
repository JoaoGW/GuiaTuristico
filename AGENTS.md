# Instruções do Projeto para Claude e Codex

Este é o único `AGENTS.md` do repositório e a fonte compartilhada de contexto para agentes. `CLAUDE.md` acrescenta os fluxos de `.claude/`; `CODEX.md` descreve o uso pelo Codex.

## Contexto do Repositório

**GuiaTuristico — EZ Trip AI** (nome do app: `EzTripAI`) é um guia turístico com Inteligência Artificial, desenvolvido como TCC por João Pedro, Lucas Kenji e Caio Pereira. O usuário vê pontos turísticos próximos em mapa, conversa por texto ou voz com o guia virtual **Felipe** (mascote), gera roteiros personalizados com IA, consulta exigência de visto, controla gastos e salva lugares favoritos.

Repositório: `https://github.com/JoaoGW/GuiaTuristico` (branches `master` e `development`).

O repositório é um monorepo com dois pacotes npm **independentes** (sem workspaces; o `package-lock.json` da raiz é vazio). Instale e execute comandos dentro de cada pacote.

| Pacote | Papel | Stack principal |
| --- | --- | --- |
| `expo-app/` | App mobile Android e iOS (web via `react-native-web`, sem uso ativo) | Expo SDK 57, React Native 0.86 (New Architecture), React 19.2, TypeScript ~6.0 `strict`, React Navigation 7 (native-stack), Gluestack UI v1 (`@gluestack-ui/themed`), Firebase Auth 12 |
| `nextjs-api/` | Backend/proxy que guarda as chaves de OpenAI, Google Places e WeatherAPI; página de documentação dos endpoints | Next.js 16 (API em `pages/api/`, App Router só para a página `/`), SDK `openai` 4.x, `formidable`, Tailwind CSS 4 |

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
    ├── pages/api/            # endpoints (ver tabela abaixo)
    ├── utils/responseCache.ts# cache em memória das respostas do Felipe
    ├── src/app/              # página "Documentação APIs - EZ Trip AI"
    ├── src/components/SwaggerAccordion.tsx
    └── Docker/Dockerfile
```

Aliases do app (em `tsconfig.json` e `babel.config.js`): `@assets`, `@components`, `@routes`, `@screens`, `@storage`, `@theme`, `@utils`, `@data`, `@contexts`, `@services`, `@config`, `@hooks`. Os tipos de `expo-app/@types/` são importados por caminho relativo. Na API, `@/*` aponta para `nextjs-api/src/*`.

## Rotas da API (`nextjs-api/pages/api/`)

| Método e rota | Entrada | Serviço externo | Saída | Consumidor no app |
| --- | --- | --- | --- | --- |
| `GET /api/googlePlacesApi` | `latitude`, `longitude` | Google Places Nearby Search (raio 1500 m, `tourist_attraction`) | `{ results }` com `photos[0].photo_url` | `screens/HomePage/Home.tsx`, `components/Maps/Maps.tsx` |
| `GET /api/googlePhotoProxy` | `photo_reference` | Google Place Photo (`maxwidth=400`) | bytes da imagem | `components/Home/Destinations.tsx` |
| `GET /api/weather` | `latitude`, `longitude` | WeatherAPI.com `current.json` | JSON da WeatherAPI | `screens/AIChat/AIChat.tsx` |
| `GET /api/passportVisa` | `origin`, `destination` | `rough-sun-2523.fly.dev/visa/{origin}/{destination}` | JSON do serviço | `screens/Itinerary/ItineraryVisaCheck.tsx` |
| `POST /api/generateItinerary` | `{ prompt }` | OpenAI Chat Completions | `{ message }` | `utils/gptRequests.ts` → `generateItinerary` |
| `POST /api/justchat` | `{ prompt }` | OpenAI Chat Completions | `{ message }` | `utils/gptRequests.ts` → `generateChatAnswers` |
| `POST /api/chat` | `{ message, context? }` | OpenAI Chat Completions | `{ success, response, usage }` | sem consumidor atual no app |
| `POST /api/voiceChat` | multipart, campo `audio` (≤ 2 MB, ~15 s) | OpenAI Whisper + Chat Completions | `{ success, transcription, response, audioInfo, usage }` | `services/voiceService.ts` |
| `GET` / `DELETE /api/cacheStats` | — | — | estatísticas / limpeza do cache | depuração |

A página `/` (`src/app/page.tsx`) lista e documenta esses endpoints com `SwaggerAccordion`. As rotas não têm autenticação nem limite de taxa.

## Modelos de LLM e Voz

| Uso | Modelo | Parâmetros | Prompt |
| --- | --- | --- | --- |
| `/api/chat` | `gpt-5.6-luna` | `max_tokens` 150, `temperature` 0.7 | `system` = `context` do corpo ou persona Felipe |
| `/api/justchat` | `gpt-5.6-luna` | `max_tokens` 500, `temperature` 0.5 | o `prompt` do app é enviado como mensagem `assistant`, sem `system` |
| `/api/generateItinerary` | `gpt-5.6-luna` | `max_tokens` 3334, `temperature` 0.75 | idem `justchat` |
| `/api/voiceChat` — transcrição | `whisper-1` | `language: 'pt'`, `temperature` 0, `response_format: 'text'` | tenta m4a, mp3, wav e mp4 |
| `/api/voiceChat` — resposta | `gpt-5.6-luna` | `max_tokens` 150, `temperature` 0.7 | persona Felipe para voz (2–3 frases); usa `responseCache` antes de chamar a OpenAI |
| Síntese de voz (app) | `expo-speech` (TTS do dispositivo) | `pt-BR`, voz `pt-br-x-ptd-network`, `pitch` 0.9 | `src/config/voiceConfig.ts` |
| Respostas offline (app) | sem modelo | palavras-chave | `src/services/felipeResponseSystem.ts` |

O modelo foi trocado de `gpt-3.5-turbo` para `gpt-5.6-luna` (commit `388adeb`). O nome do modelo aparece literalmente em cada rota e no campo `usage` de `voiceChat`; não há constante compartilhada. `responseCache` guarda até 100 respostas por 24 h em memória do processo (similaridade ≥ 0,8 por palavras) e tem respostas pré-definidas para saudações, agradecimentos e despedidas.

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
| Nominatim / OpenStreetMap (geocodificação reversa) | `expo-app/src/utils/geoDecoder.ts` | nenhuma |
| Firebase Auth | `expo-app/firebase.ts` | `EXPO_PUBLIC_FIREBASE_*` |
| Google Sign-In | `expo-app/src/services/login/googleLogin.ts` | `EXPO_PUBLIC_WEB_CLIENT_ID`, `EXPO_PUBLIC_IOS_CLIENT_ID` |
| Google AdMob | `expo-app` (`app.json`, `services/admob`) | IDs em `app.json` e `EXPO_PUBLIC_ADMOB_*` |
| Mapas | `expo-maps`, `react-native-maps`, `expo-location` | permissões de localização |
| Hospedagem e build | Vercel (API), EAS (projeto `080ff03d-…`), GHCR (imagens Docker) | segredos fora do repositório |

Variáveis lidas pelo código (somente nomes; nunca leia ou registre valores): API — `OPEN_AI_KEY`, `GOOGLE_PLACES_API_KEY`, `WEATHER`; app — `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_FIREBASE_APP_ID`, `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`, `EXPO_PUBLIC_WEB_CLIENT_ID`, `EXPO_PUBLIC_IOS_CLIENT_ID`, `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID`, `EXPO_PUBLIC_ADMOB_IOS_APP_ID` e `DEV_API_URL` (via `@env`, `react-native-dotenv`, arquivo `.env.local`). Cada pacote lê o próprio `.env.local`.

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

- Siga `docs/DESIGN.md` e `.claude/skills/frontend/design.md`. Não há arquivo de tokens próprio: reutilize os tokens Gluestack e as cores já usadas antes de introduzir novas.
- O app é configurado em modo claro (`userInterfaceStyle: "light"`) e retrato.
- Use rótulos claros, nomes acessíveis, contraste adequado e alvos de toque confortáveis. Não dependa apenas de cor, ícone, animação ou gesto para comunicar estado.
- Cubra estados de pressionado, desabilitado, carregando, vazio, erro, sem conexão e permissão negada (localização, microfone, contatos) quando relevantes.
- Textos da interface em português do Brasil.

## IA, Custos e Dados Externos

- Não troque modelo, `max_tokens`, `temperature`, prompts ou a persona do Felipe sem pedido explícito: isso muda custo e comportamento.
- Chaves de OpenAI, Google e WeatherAPI ficam somente na `nextjs-api`; o app nunca deve chamar esses serviços diretamente.
- Trate respostas da IA e de serviços externos como não confiáveis: valide antes de usar e preveja falha, 429 e tempo esgotado.
- Não invente dados de destinos, preços, clima, exigências de visto ou avaliações apresentados como reais.
- Mudanças de contrato de um endpoint exigem atualizar o consumidor no app e a documentação em `SwaggerAccordion.tsx`.

## Validação Local

| Pacote | Scripts definidos |
| --- | --- |
| `expo-app` | `npm run start` (`expo start --tunnel`), `npm run android`, `npm run ios`, `npm run web`, `npm run checkup` (`expo-doctor`), `npm run lint` (`expo lint`) |
| `nextjs-api` | `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run clean` |
| raiz | `docker-compose up --build` |

- Lint: `npm run lint` em cada pacote (ESLint 9, flat config): `expo-app/eslint.config.js` com `eslint-config-expo` e `nextjs-api/eslint.config.mjs` com `eslint-config-next` (`core-web-vitals` + `typescript`).
- Verificação de tipos: `npx tsc --noEmit` em cada pacote.
- Linha de base em 12/10/2026, toda em código preexistente: app 72 erros e 186 avisos de lint (a maioria regras de React Hooks/Compiler, como acesso a `ref` e `setState` durante render) e 1 erro de tipos (`TS5101`); API 10 erros e 2 avisos de lint (`no-explicit-any`, `prefer-const`) e 0 erros de tipos. Relate erros novos separadamente dessa linha de base; não corrija os antigos sem pedido.
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

1. Os dois pacotes têm erros de lint preexistentes (ver Validação Local); o app falha em `npx tsc --noEmit` com `TS5101` (`baseUrl` obsoleto no TypeScript 6). `next.config.ts` usa `typescript.ignoreBuildErrors: true`.
2. Não há testes automatizados em nenhum pacote.
3. `nextjs-api`: `npm run clean` usa `rimraf`, que não está nas dependências.
4. `googlePlacesApi` devolve `photo_url` com a chave do Google embutida; `googlePhotoProxy` já existe como alternativa. As rotas não têm autenticação, e `DELETE /api/cacheStats` é público.
5. `expo-app` declara `next` e `openai` como dependências, mas o código de `src/` não os importa. `config/gluestack-ui.config.ts` não é usado (o App importa `@gluestack-ui/config`).
6. `app.json` → `extra` contém placeholders `${FIREBASE_*}` que não são interpolados; o código usa `process.env.EXPO_PUBLIC_*`.
7. `expo-app/Docker/Dockerfile.eas` usa a imagem inexistente `node20:slim` e um `CMD` inválido.

## Regras de Revisão de Código

Ao revisar mudanças, reporte apenas problemas concretos e acionáveis. Verifique correção, regressões, navegação, contratos entre app e API, tratamento de erros de rede e de IA, segurança de chaves, acessibilidade e estados de UI. Para cada problema, informe prioridade, arquivo e linha, evidência, impacto e a menor correção recomendada. Não reporte preferências puramente estilísticas.

Se não houver um problema concreto, responda: `No actionable findings found.`
