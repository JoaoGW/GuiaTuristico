---
paths:
  - "**/*.{test,spec}.{ts,tsx}"
  - "**/__tests__/**/*.{ts,tsx}"
---

# Testing Rules

## General

- Test observable behavior and public contracts, not implementation details.
- Add or update tests whenever behavior changes, once a test runner exists.
- For a reproducible bug, add a failing regression test before or with the fix when a runner is available.
- Keep tests deterministic, independent, and readable.
- Do not weaken assertions, delete coverage, increase arbitrary timeouts, or skip tests to make a change pass.

## Project Status

Neither `expo-app` nor `nextjs-api` defines a `test` script or a test dependency (the CI workflow runs tests only `--if-present`). Do not claim Jest, end-to-end, or API test coverage exists, and do not add a test dependency without approval.

When a test framework is explicitly introduced, cover API handlers (method, validation, upstream failure mapping), app services (`voiceService`, `storageManager`, `gptRequests`), and failure recovery for offline and quota errors.

## Local Validation

Run the narrowest available check in the affected package:

| Check | Command | Current baseline |
| --- | --- | --- |
| Lint (app) | `cd expo-app && npm run lint` | `expo lint` (ESLint 9, `eslint-config-expo`): 72 errors, 186 warnings |
| Lint (API) | `cd nextjs-api && npm run lint` | ESLint 9, `eslint-config-next`: 10 errors, 2 warnings |
| Type check (app) | `cd expo-app && npx tsc --noEmit` | fails with 1 error: `TS5101` (`baseUrl` deprecated in TypeScript 6) |
| Type check (API) | `cd nextjs-api && npx tsc --noEmit` | passes |
| Expo diagnostics | `cd expo-app && npm run checkup` | `expo-doctor` |
| API build | `cd nextjs-api && npm run build` | type errors ignored by `ignoreBuildErrors` |
| API manual check | `cd nextjs-api && npm run dev` | endpoints listed at `/` |

All baseline lint and type errors are pre-existing (measured on 2026-10-12). Report new errors separately from the baseline and do not fix old ones unless asked; never disable rules to make lint pass. Use `npm run android` or `npm run ios` only when the changed platform and a local target are available. If a command is unavailable, fails because of unrelated existing work, or cannot run locally, say so and state what remains unverified.
