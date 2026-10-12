---
description: Investigate and fix a described defect with scoped implementation and verification.
argument-hint: "<issue description>"
---

# Fix Issue Workflow

Treat `$ARGUMENTS` as the issue scope.

## Process

1. Read the reported behavior, relevant code, `AGENTS.md`, and related contracts. Identify whether the defect is in `expo-app`, `nextjs-api`, or the contract between them.
2. Define observable success criteria before editing.
3. Reproduce the problem when practical (for API defects, call the endpoint with `npm run dev` in `nextjs-api`; there is no test runner).
4. Explain the smallest implementation plan if the change spans multiple files, layers, or both packages.
5. Implement only the requested correction.
6. Run `npm run lint` and `npx tsc --noEmit` in the affected package (compare with the known baseline in `AGENTS.md`), `npm run checkup` for the app, or `npm run build` for the API, as applicable.
7. Report the result and unresolved limitations.

## Constraints

- Do not add dependencies, migrations, integrations, or unrelated refactors without approval.
- Do not create a pull request, commit, or push without explicit approval.
- Do not change LLM models, prompts, or generation parameters unless the issue is about them and the change is approved.
- Stop and ask for direction when the issue requires a product, security, cost, permission, or data-model decision not already established.
