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

- `nextjs-api/pages/api/` holds one handler per endpoint (Pages Router API routes). It is the only place allowed to hold OpenAI, Google Places, and WeatherAPI keys (`OPEN_AI_KEY`, `GOOGLE_PLACES_API_KEY`, `WEATHER`) and the RevenueCat secret key (`REVENUECAT_SECRET_API_KEY`).
- The app reaches the API only through `API_URL` from `expo-app/src/config.ts` (local `DEV_API_URL` in Expo Go, otherwise `https://guiaturisticoeztripai.vercel.app/api`). Never hardcode a base URL in a screen or service.
- The app talks directly only to Firebase Auth, Google Sign-In, AdMob, and Nominatim (`src/utils/geoDecoder.ts`).
- The endpoint list, inputs, outputs, and consumers are documented in `AGENTS.md` ("Rotas da API"). Keep it, the app consumer, and `nextjs-api/src/components/SwaggerAccordion.tsx` in sync when a contract changes.

## Handler Conventions

- Check the HTTP method first and return 405 (with `Allow` when the file already does so).
- Validate required query or body fields and return 400 with a short message before calling an external service.
- Read keys only from `process.env`; never log keys, full upstream URLs containing keys, or raw upstream payloads with personal data.
- Map known upstream failures as `toAiError` does: OpenAI 401 → 500 `AI_AUTH_ERROR`, 429 → 429, per-call timeout → 504 `AI_TIMEOUT`, `insufficient_quota` → 503 `AI_QUOTA_EXCEEDED`, connection or 5xx → 502, missing key → 503; keep each OpenAI call's `timeout` below the route's `maxDuration` (120 s itinerary, 60 s chat and voice); other providers: missing key → 503, upstream failure → 502 (visa → 503 `VISA_UNAVAILABLE`).
- `voiceChat` disables the body parser and uses `formidable` (2 MB limit, `audio/*` mimetype only), reads the upload into memory and removes the temporary file in `finally`. Another transcription format is tried only when the OpenAI rejects the format.
- Handlers are thin adapters: check the method with `ensureMethod` (405 + `Allow`), call one use case from `src/contexts/<context>/application/`, and answer failures with `sendError` (`src/shared/http.ts`). Errors are always JSON `{ error: "pt-BR message", code? }`; throw `AppError` for expected failures and keep provider details in `cause` (log only).
- Bounded Contexts live in `src/contexts/{catalog,concierge,itinerary,profile}/{domain,application,infrastructure}`. Domain code never imports an external SDK; external payloads are mapped in `infrastructure/` (for example, the Google Places DTO).
- AI routes (`chat`, `justchat`, `generateItinerary`, `voiceChat`) call `guardAiRoute` before validation: in-memory rate limit per user or IP (per serverless instance only) and Firebase ID token verification when `AI_AUTH_REQUIRED=true` with `FIREBASE_PROJECT_ID`. A global limit needs external storage (not approved); flag new cost or abuse exposure in reviews.

## LLM Usage

- Chat model: `gpt-6-luna`, a literal in each use case (`src/contexts/concierge/application/*`, `src/contexts/itinerary/infrastructure/structuredCompletion.ts`) and in the `usage` field of `voiceChat.ts`; transcription: `whisper-1` (`language: 'pt'`).
- GPT-6 is a reasoning model (default effort `medium`): send `max_completion_tokens` (reasoning tokens count against it; `max_tokens` is deprecated and incompatible with reasoning models) and do not send `temperature`, which is rejected while reasoning is active. The `openai` SDK is 7.x (Node 22+); choosing a `reasoning_effort` per route still needs approval.
- Do not change the model, `max_completion_tokens`, `reasoning_effort`, system prompts, the Felipe persona, or `utils/responseCache.ts` behavior without an explicit request: each affects cost, latency, and tone.
- Prompts live on the server: the Felipe persona and tourism rule in `src/contexts/concierge/domain/felipePersona.ts`, itinerary prompts in `src/contexts/itinerary/domain/itineraryPrompt.ts`. `justchat` accepts `{ messages }` (last 10 sent) or the legacy `{ prompt }`; `generateItinerary` receives structured preferences and returns JSON validated by a `strict` JSON Schema, answering 502 `ITINERARY_INCOMPLETE` when nothing usable is generated. Itinerary credits: 1 per block of up to 7 days (max 28 days, rule in `src/contexts/itinerary/domain/credits.ts`); every trip gets a trip plan first (server-computed dates and weekdays, daily highlights) and parallel blocks that follow it; plan and block calls use `reasoning_effort: 'low'` and `max_completion_tokens` 8000 (approved 01/11/2026) with exact day counts in the schema; only generated blocks are charged. Balance checks and debits go through `src/contexts/billing` (RevenueCat Developer API v2, secret key, server-side only, `Idempotency-Key`), enabled only when the `REVENUECAT_*` variables exist and requiring `AI_AUTH_REQUIRED=true`; never let the client set the amount to debit.
- Treat model output as untrusted text. When the app parses it (for example, `parseAnswerPatternToItinerary` in `ItineraryMapMenu.tsx` converts the structured plain-text itinerary into objects), handle malformed output and show a recoverable error.
- Keep `expo-app/src/config/voiceConfig.ts` consistent with the server transcription settings when either side changes.

## App-Side Requests

- Network calls live in `src/services/` or `src/utils/gptRequests.ts`, not inside render code.
- Handle offline (`contexts/NetInfo`), 429 (OpenAI quota), timeout, and empty results with a user-visible, recoverable state in Portuguese.
- Do not expose implementation details, keys, or raw error payloads to users.
- Persisted data uses `AsyncStorage` keys prefixed with `@eztripai_`; keep that prefix and the existing key shapes.

## Verification

There is no test runner. Exercise changed endpoints with `npm run dev` in `nextjs-api` (the `/` page lists them) and report the requests made, or state clearly that they were not exercised.
