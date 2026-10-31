# Responsabilidades dos agentes

Use este guia ao distribuir trabalho ou escolher uma revisão. Uma tarefa pequena pode ser executada e revisada pelo agente principal; não crie agentes apenas para cumprir um processo. O `settings.json` limita a profundidade de subagentes a 1 e a concorrência a 2.

| Papel | Responsabilidade | Limite |
| --- | --- | --- |
| Agente principal | Entender o pedido, identificar o pacote (`expo-app/`, `nextjs-api/` ou ambos), definir o escopo, implementar ou integrar as mudanças e entregar o resultado ao usuário. | Continua responsável por conferir a entrega e as evidências, mesmo quando delega. |
| Implementador, quando houver delegação | Alterar somente os arquivos e comportamentos atribuídos, verificar a mudança e informar o que ficou pendente. | Não ampliar o escopo, não decidir requisitos de produto ausentes, não trocar modelo ou prompt de IA e não editar arquivos atribuídos a outro agente. |
| [code-reviewer](../agents/code-reviewer.md) | Identificar falhas de comportamento, regressões, quebras de contrato app–API e problemas de navegação, rede e IA no escopo recebido. | Apenas revisão; não implementar a correção. |
| [security-auditor](../agents/security-auditor.md) | Examinar chaves, rotas sem autenticação, abuso de custo da OpenAI, dados do usuário em `AsyncStorage` e permissões do dispositivo, sempre com evidência. | Apenas revisão; não acessar segredos, executar código ou contatar serviços. |
| [test-reviewer](../agents/test-reviewer.md) | Conferir a cobertura de verificação da mudança e distinguir o que foi executado, simulado e não verificado (o projeto não tem testes automatizados). | Apenas revisão; não executar testes nem alterar arquivos. |
| [documentation-reviewer](../agents/documentation-reviewer.md) | Conferir `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `README.md`, `SETUP_LOCAL.md`, `docs/`, `.claude/` e `SwaggerAccordion.tsx` contra o código. | Apenas revisão; não alterar documentos nem executar comandos. |

## Ao delegar

- Delegue somente quando permitido pelas instruções e autorizações vigentes. Este guia não autoriza criar agentes nem ampliar permissões por si só.
- Informe o resultado esperado, o pacote e os arquivos ou limites de atuação, as restrições aplicáveis (sem dependências novas, sem mudança de modelo ou prompt, sem leitura de `.env*`) e a verificação necessária. Compartilhe somente o contexto relevante.
- Evite dois agentes editando o mesmo arquivo ao mesmo tempo. Quando houver dependência (por exemplo, handler da API e consumidor no app), conclua a primeira entrega antes de iniciar a seguinte.
- Se não houver recurso ou autorização para delegação, o agente principal faz a análise necessária e informa que foi uma revisão própria.

## Ao devolver e integrar

O responsável pela tarefa informa o que mudou ou foi encontrado, os arquivos envolvidos, os comandos realmente executados com seus resultados e qualquer pendência. Revisores incluem arquivo/linha, evidência, impacto e correção mínima para cada achado confirmado, com a prioridade P0/P1/P2 do [/review](../commands/review.md).

O agente principal confere a entrega contra o pedido e as evidências, integra somente mudanças pertinentes e resolve falhas atribuíveis à alteração. Não aceite um resumo de sucesso que contradiga os resultados apresentados. Aplique os [critérios de conclusão](completion-criteria.md) antes de responder ao usuário.
