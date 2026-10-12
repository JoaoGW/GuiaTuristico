# Guia Operacional do Projeto

## Contexto do Repositório

**GuiaTuristico — EZ Trip AI** é um guia turístico com IA (TCC), organizado em dois pacotes npm independentes:

- `expo-app/`: app Android/iOS em Expo SDK 57, React Native 0.86, React 19.2, TypeScript ~6.0 `strict`, React Navigation 7, Gluestack UI v1 e Firebase Auth.
- `nextjs-api/`: API em Next.js 16 (`pages/api/`) que intermedia OpenAI (`gpt-5.6-luna` e `whisper-1`), Google Places, WeatherAPI e um serviço de vistos; produção na Vercel (`https://guiaturisticoeztripai.vercel.app/api`).

O guia virtual se chama **Felipe**. As principais jornadas são: pontos turísticos próximos no mapa, chat por texto e por voz, geração de roteiros com verificação de visto e exportação em PDF, favoritos, controle de gastos, perfil e telas Premium (sem pagamento integrado).

Use `AGENTS.md` (raiz) como o guia compartilhado: ele contém estrutura de diretórios, rotas da API, modelos de LLM, navegação, dependências externas, variáveis de ambiente e pendências conhecidas. Este arquivo adiciona os fluxos específicos de `.claude/`.

## Mapa de Instruções

| Necessidade | Fonte |
| --- | --- |
| Contexto, rotas, modelos e regras compartilhadas | `AGENTS.md` |
| Sistema visual e padrões de interface | `docs/DESIGN.md` e `.claude/skills/frontend/design.md` |
| Sinais de interface genérica gerada por IA | `docs/DesignIA_Regras.md` e `.claude/skills/frontend/ai-design-rules.md` |
| Convenções de TypeScript, React Native e Next.js | `.claude/rules/code-style.md` |
| Contratos da API, serviços externos e LLM | `.claude/rules/api-conventions.md` |
| Validação local e testes | `.claude/rules/testing.md` |
| Revisão de código | `.claude/commands/review.md` |
| Investigação e correção de defeitos | `.claude/commands/fix-issue.md` |
| Implementação de interface | `.claude/skills/frontend/SKILL.md` |
| Prontidão local, builds e deploy | `.claude/skills/deploy/SKILL.md` |
| Revisões isoladas | `.claude/agents/` |
| Permissões e comandos destrutivos | `.claude/settings.json` e `.claude/hooks/validate-base.sh` |

Leia apenas as instruções aplicáveis à tarefa atual.

## Fontes de Verdade

Em caso de conflito, use esta ordem:

1. Pedido explícito do usuário e requisitos aprovados.
2. Código e configuração: `package.json` de cada pacote, `app.json`, `eas.json`, `tsconfig.json`, `babel.config.js`, `next.config.ts`, `docker-compose.yml` e workflows em `.github/`.
3. `AGENTS.md` e regras do projeto em `.claude/`.
4. Convenções gerais.

Em caso de divergência entre `README.md`/`SETUP_LOCAL.md` e o código, prefira o código. Não escolha silenciosamente entre requisitos conflitantes: explique o conflito e peça direção.

## Regras de Trabalho

- Identifique primeiro o pacote afetado e execute comandos dentro dele (`expo-app/` ou `nextjs-api/`).
- Inspecione telas, componentes, serviços, rotas da API e configuração afetados antes de editar.
- Prefira a menor mudança completa, sem abstrações, dependências, configurações ou funcionalidades especulativas.
- Ao mudar o contrato de um endpoint, atualize na mesma tarefa o consumidor em `expo-app` e a documentação em `nextjs-api/src/components/SwaggerAccordion.tsx`.
- Não remova ou reformate código adjacente que não tenha sido afetado pela alteração solicitada.
- Relate o que foi verificado e o que permaneceu sem validação.

## IA, Dados Externos e Segurança

- Não altere modelo, prompts, `max_tokens`, `temperature`, persona do Felipe ou o `responseCache` sem pedido explícito; isso altera custo e comportamento.
- Mantenha as chaves de OpenAI, Google Places e WeatherAPI somente na `nextjs-api`.
- Não invente destinos, preços, clima, vistos, avaliações ou respostas da IA apresentados como dados reais.
- Trate permissões (localização, microfone, contatos, rastreamento de anúncios), autenticação e dados do usuário como mudanças que exigem revisão cuidadosa.

## Desenvolvimento e Validação

| Objetivo | Comando |
| --- | --- |
| App no Expo (túnel) | `cd expo-app && npm run start` |
| App nativo Android / iOS | `npm run android` / `npm run ios` |
| Diagnóstico do Expo | `cd expo-app && npm run checkup` |
| API local | `cd nextjs-api && npm run dev` (porta 3000; documentação em `/`) |
| Build da API | `cd nextjs-api && npm run build` |
| Tudo via Docker | `docker-compose up --build` (raiz) |
| Lint | `npm run lint` em cada pacote |
| Verificação de tipos | `npx tsc --noEmit` em cada pacote |

Não há testes. Lint e verificação de tipos já acusam erros preexistentes (linha de base em `AGENTS.md`, Validação Local); compare com ela e relate apenas o que mudou. Builds EAS e deploys não são validação local e exigem autorização.

## Dependências, Git e Dados Sensíveis

- Não adicione, atualize, remova ou substitua dependências sem aprovação explícita.
- Não leia, imprima, altere ou versione segredos, credenciais, arquivos `.env*` (em qualquer pacote) ou `.npmrc`.
- Não faça commit, push, publicação, build EAS ou deploy sem autorização explícita.
- Não use comandos destrutivos, como exclusão recursiva, `git clean` ou `git reset --hard`.

As preferências locais complementares estão em `CLAUDE.local.md`.
