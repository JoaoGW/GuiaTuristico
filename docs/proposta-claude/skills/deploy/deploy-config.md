---
status: local-only
checks:
  expo-app:
    - npm run lint
    - npx tsc --noEmit
    - npm run checkup
  nextjs-api:
    - npm run lint
    - npx tsc --noEmit
    - npm run build
---

# Local Readiness Configuration

Only local validation runs from this skill. Remote release paths exist in the repository but require explicit approval before any command is run.

| Target | Mechanism | Source |
| --- | --- | --- |
| API production | Vercel (`npm run build`, framework `nextjs`), URL `https://guiaturisticoeztripai.vercel.app/api` | `nextjs-api/vercel.json` |
| Android/iOS builds | EAS profiles `development` (dev client, internal), `preview` (APK, internal), `production` (auto-increment); `appVersionSource: remote` | `expo-app/eas.json` |
| Docker images | GHCR `ghcr.io/joaogw/guiaturistico/{expo-app,nextjs-api}` on push to `development`; `deploy.yml` on `master`, `V0.[6-9].*` tags, or manual dispatch | `.github/workflows/` |
| CI | `ci.yml` on push/PR to `master` and `development`: Node 20, `expo-doctor`, and lint/typecheck/test/build only `--if-present` | `.github/workflows/ci.yml` |

`expo-app/Docker/Dockerfile.eas` is not usable as is (invalid base image and `CMD`).

`.claude/hooks/validate-base.sh` blocks `vercel deploy`/`--prod` and `eas build|submit|update` while `status` is `local-only`. To enable a release path, the user must approve it, update `status`, and adjust the hook in the same change. On 30/10/2026 the Vercel deployment was serving an older `master` build (`gpt-3.5-turbo`, discontinued); record the deployed commit when a release is approved.

Never store credentials, tokens, private URLs, or environment values in this file.
