# Guia do Codex

As instruções operacionais compartilhadas estão em `AGENTS.md`, na raiz, o único `AGENTS.md` do repositório. Ele contém o contexto do projeto, estrutura de diretórios, rotas da API, modelos de LLM, dependências externas, regras de implementação, validação, revisão e segurança.

Por estar na raiz, o `AGENTS.md` é carregado automaticamente pelo Codex. Não há `.codex/` nem `.agents/` neste repositório.

## Contexto Aplicado

- **GuiaTuristico — EZ Trip AI**: guia turístico com IA (TCC), com o guia virtual Felipe.
- `expo-app/`: Expo SDK 57, React Native 0.86, React 19.2, TypeScript ~6.0, React Navigation 7, Gluestack UI v1, Firebase Auth.
- `nextjs-api/`: Next.js 16 com rotas em `pages/api/`, OpenAI (`gpt-5.6-luna`, `whisper-1`), Google Places, WeatherAPI e serviço de vistos; produção na Vercel.
- Pacotes npm independentes: instale e execute comandos dentro de cada um.

## Convenções Ativas

O `AGENTS.md` orienta o agente a:

- realizar mudanças enxutas, baseadas no código existente e no pedido explícito;
- preservar as pilhas de navegação, os componentes Gluestack e os padrões visuais atuais;
- manter chaves de serviços externos somente na API e não alterar modelo, prompts ou parâmetros de IA sem pedido;
- manter app, API e `SwaggerAccordion.tsx` coerentes quando um endpoint mudar;
- validar com `npm run lint`, `npx tsc --noEmit`, `npm run checkup` (app) e `npm run build` (API), comparando com a linha de base de erros preexistentes e sabendo que não há testes;
- solicitar aprovação para dependências, commits, pushes, builds EAS e deploys;
- informar verificações executadas e limitações de validação.

## Proteções de Comandos

Não há configuração do Codex versionada. As proteções equivalentes do Claude ficam em `.claude/settings.json` e `.claude/hooks/validate-base.sh` (bloqueiam `git reset --hard`, `git clean`, exclusão recursiva, force push, push direto para `main`/`master` e `npm publish`). Siga as mesmas restrições descritas em `AGENTS.md`.

## Workflows Reutilizáveis

Os workflows de interface, prontidão local, revisão de código, auditoria de segurança e correção de defeitos estão em `.claude/skills/`, `.claude/commands/` e `.claude/agents/`. Eles podem ser lidos como procedimento pelo Codex.

Não há conectores ou serviços remotos configurados para agentes neste repositório.
