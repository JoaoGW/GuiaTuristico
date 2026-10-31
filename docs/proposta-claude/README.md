# Proposta de `.claude/` — molde JoaoGW/Agents adaptado ao EZ Trip AI

Esta pasta espelha a estrutura de `.claude/`. Ela existe porque as ferramentas remotas do Claude não podem gravar dentro de `.claude/`: copie o conteúdo para a pasta `.claude/` da raiz do projeto, substituindo os arquivos de mesmo nome. No Finder, use Cmd+Shift+. para ver pastas ocultas. Depois da cópia, esta pasta pode ser apagada.

O `CLAUDE.md`, o `AGENTS.md`, o `CODEX.md` e o `CLAUDE.local.md` da raiz já foram atualizados e citam estes arquivos.

## Novos (vindos do molde, adaptados)

- `guides/completion-criteria.md`, `guides/agent-responsibilities.md`, `guides/agent-evaluation.md`
- `commands/validate.md`, `commands/evaluate-agents.md`
- `agents/test-reviewer.md`, `agents/documentation-reviewer.md`
- `skills/frontend/design_components.md` (catálogo de componentes; no molde ficava em `hooks/`)
- `skills/web-artifacts-builder/` (scripts e LICENSE inalterados)

## Atualizados

- `agents/code-reviewer.md`, `agents/security-auditor.md`, `commands/review.md`, `commands/fix-issue.md`: referências aos guias.
- `rules/code-style.md`, `skills/frontend/SKILL.md`, `skills/frontend/ai-design-rules.md`, `skills/frontend/design.md`: Design System v2.0, com `DesignIA_Regras.md` como regra superior.
- `rules/testing.md`, `skills/deploy/*`: ligação com `/validate` e linha de base corrigida.
- `settings.json`: `$schema`, MCP de projeto desativado por padrão e `npm run build` liberado.
- `hooks/validate-base.sh`: bloqueia `vercel deploy`/`--prod` e `eas build|submit|update` enquanto o `deploy-config.md` estiver em `local-only`.

## Do molde que não foi trazido (conflita com o projeto atual)

NestJS/TypeORM/PostgreSQL, `scripts/test.sh` e `docs/VALIDACAO.md`; rotas em `app/api/` com `lib/api-route.ts`; proibição de Zustand; prefixo `I` e sufixo `Types`; JSDoc obrigatório em toda função; Tailwind/`cursor-pointer`; `.prettierrc` (o projeto não tem Prettier); `.mcp.json` vazio.
