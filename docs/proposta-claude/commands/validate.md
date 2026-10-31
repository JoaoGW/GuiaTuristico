---
description: Validar localmente as mudanças do monorepo (expo-app e nextjs-api) com as verificações que realmente existem.
argument-hint: "[pacote ou escopo]"
---

# Validação do monorepo

Leia `.claude/rules/testing.md` e a seção "Validação Local" do `AGENTS.md`. Aplique as [responsabilidades dos agentes](../guides/agent-responsibilities.md) ao distribuir revisões e os [critérios de conclusão](../guides/completion-criteria.md) ao relatar. Para validar o comportamento dos agentes, use [evaluate-agents](evaluate-agents.md).

Confira os scripts no `package.json` de cada pacote antes de rodar comandos; registre os que não puderem ser executados. Os pacotes são independentes: rode cada comando dentro do pacote.

1. Inspecione o diff de `$ARGUMENTS` (ou da árvore de trabalho) e identifique os pacotes afetados.
2. `expo-app`: `npm run lint` e `npx tsc --noEmit` (linha de base: 0 erros e 0 avisos; qualquer erro é novo). Depois, `npm run checkup` (`npx expo-doctor`, precisa de rede; compare com as pendências conhecidas do `AGENTS.md`).
3. `nextjs-api`: `npm run lint`, `npx tsc --noEmit` e `npm run build`. O build usa `next/font/google` e precisa de acesso a `fonts.googleapis.com`. O build também verifica os tipos (`ignoreBuildErrors` foi removido).
4. Endpoints alterados: suba `npm run dev` em `nextjs-api` e chame as rotas afetadas, cobrindo método inválido (405), parâmetro ausente (400) e o caminho feliz quando houver chave local. Para rotas de IA, considere o custo: faça o mínimo de chamadas e nunca contra produção sem autorização.
5. Interface alterada: valide em Android ou iOS quando houver aparelho ou emulador. A web (`react-native-web`) não é alvo e não substitui essa validação.
6. Peça revisão isolada a `code-reviewer`, `security-auditor`, `test-reviewer` e `documentation-reviewer` conforme o escopo. Revisores não implementam correções.
7. Corrija os problemas confirmados atribuíveis à mudança e repita somente as verificações afetadas.
8. Informe comandos, resultados e limitações reais. Não faça commit, push, build EAS ou deploy sem autorização explícita.

Não existem testes automatizados: não invente `npm test` nem cobertura. Não use dados reais, `.env*` pessoais, chaves de produção ou esperas arbitrárias para obter um resultado verde.
