---
name: local-readiness
description: Verify the local readiness of the EZ Trip AI Expo app and Next.js API without publishing, building remotely, or creating remote resources.
disable-model-invocation: true
---

# Local Readiness Workflow

Read `deploy-config.md` before doing anything else.

## Current Scope

This skill verifies local quality and startup readiness of `expo-app` and `nextjs-api`. It does not run EAS builds, deploy to Vercel, push Docker images, or trigger GitHub workflows; those require explicit approval and are only described here for context.

## Readiness Checks

Run only checks relevant to the changed package:

1. `expo-app`: `npm run lint` (baseline: 72 errors, 186 warnings), `npx tsc --noEmit` (baseline: 1 error, `TS5101`), then `npm run checkup` (`expo-doctor`).
2. `nextjs-api`: `npm run lint` (baseline: 10 errors, 2 warnings), `npx tsc --noEmit` (baseline: clean), then `npm run build`.
3. Startup, when a local target is available: `npm run dev` in `nextjs-api` (port 3000, docs at `/`), `npm run start` in `expo-app` (tunnel), or `docker-compose up --build` at the root.
4. Confirm that each package's `.env.local` defines the variable names listed in `AGENTS.md`, without reading or printing values (for example, `grep -o '^[A-Z_]*=' .env.local`).

There are no test scripts. Do not invent them. Lint is informative until the pre-existing errors are fixed; report only new findings as blockers.

## Output Contract

Report:

- each command and its result, separating new errors from the known baseline;
- skipped commands and why;
- local blockers (missing variable names, failing build, unavailable device);
- whether the changed path is locally ready to validate.

If a release is requested, list the remote steps from `deploy-config.md` that would follow and wait for approval.
