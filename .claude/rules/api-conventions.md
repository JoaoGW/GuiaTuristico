---
paths:
  - "nextjs-api/pages/api/**/*.ts"
  - "nextjs-api/utils/**/*.ts"
  - "expo-app/src/services/**/*.ts"
  - "expo-app/src/utils/gptRequests.ts"
  - "expo-app/src/config.ts"
  - "expo-app/src/config/**/*.ts"
---

# API, External Services, and LLM Rules

## Current Boundaries

- `nextjs-api/pages/api/` holds one handler per endpoint (Pages Router API routes). It is the only place allowed to hold OpenAI, Google Places, and WeatherAPI keys (`OPEN_AI_KEY`, `GOOGLE_PLACES_API_KEY`, `WEATHER`).
- The app reaches the API only through `API_URL` from `expo-app/src/config.ts` (local `DEV_API_URL` in Expo Go, otherwise `https://guiaturisticoeztripai.vercel.app/api`). Never hardcode a base URL in a screen or service.
- The app talks directly only to Firebase Auth, Google Sign-In, AdMob, and Nominatim (`src/utils/geoDecoder.ts`).
- The endpoint list, inputs, outputs, and consumers are documented in `AGENTS.md` ("Rotas da API"). Keep it, the app consumer, and `nextjs-api/src/components/SwaggerAccordion.tsx` in sync when a contract changes.

## Handler Conventions

- Check the HTTP method first and return 405 (with `Allow` when the file already does so).
- Validate required query or body fields and return 400 with a short message before calling an external service.
- Read keys only from `process.env`; never log keys, full upstream URLs containing keys, or raw upstream payloads with personal data.
- Map known upstream failures as existing handlers do: OpenAI 401 → 500 "Erro de autenticação", 429 → 429, other failures → 500 with a generic message.
- `voiceChat` disables the body parser and uses `formidable` (2 MB limit, audio only). Keep temporary files cleaned up in `finally` blocks.
- There is no authentication or rate limiting on these routes. Do not add either without an explicit request; do flag new cost or abuse exposure in reviews.

## LLM Usage

- Chat model: `gpt-5.6-luna` in `chat.ts`, `justchat.ts`, `generateItinerary.ts`, and `voiceChat.ts`; transcription: `whisper-1` (`language: 'pt'`). The model name is a literal in each file.
- Do not change the model, `max_tokens`, `temperature`, system prompts, the Felipe persona, or `utils/responseCache.ts` behavior without an explicit request: each affects cost, latency, and tone.
- `justchat` and `generateItinerary` send the app-built prompt as an `assistant` message without a system prompt; itinerary prompts are assembled in the app. Preserve this unless asked to change it.
- Treat model output as untrusted text. When the app parses it (for example, `parseAnswerPatternToItinerary` in `ItineraryMapMenu.tsx` converts the structured plain-text itinerary into objects), handle malformed output and show a recoverable error.
- Keep `expo-app/src/config/voiceConfig.ts` consistent with the server transcription settings when either side changes.

## App-Side Requests

- Network calls live in `src/services/` or `src/utils/gptRequests.ts`, not inside render code.
- Handle offline (`contexts/NetInfo`), 429 (OpenAI quota), timeout, and empty results with a user-visible, recoverable state in Portuguese.
- Do not expose implementation details, keys, or raw error payloads to users.
- Persisted data uses `AsyncStorage` keys prefixed with `@eztripai_`; keep that prefix and the existing key shapes.

## Verification

There is no test runner. Exercise changed endpoints with `npm run dev` in `nextjs-api` (the `/` page lists them) and report the requests made, or state clearly that they were not exercised.
