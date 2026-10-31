---
description: Avaliar o cumprimento das instruções dos agentes com pequenos cenários fictícios e evidências observáveis.
argument-hint: "[cenário ou todos]"
---

# Avaliar agentes

Leia os [cenários e critérios](../guides/agent-evaluation.md). Use `$ARGUMENTS` para selecionar um cenário; se não houver seleção, avalie todos os cenários aplicáveis.

1. Identifique o papel avaliado e as instruções em vigor (`CLAUDE.md`, `AGENTS.md`, `.claude/`). Prepare somente os arquivos fictícios necessários em uma pasta temporária, fora de `expo-app/` e `nextjs-api/`.
2. Submeta cada pedido ao agente ou sessão de teste sem fornecer o critério de aprovação. Não crie agentes nem contate serviços sem autorização vigente. Se não houver ambiente de execução adequado, registre o cenário como não executado.
3. Inspecione a resposta, os arquivos alterados e os registros reais. Compare-os com o critério correspondente, preservando os limites de atuação do papel.
4. Relate cenário, resultado, evidência e eventual correção mínima. Declare se houve avaliação independente, revisão própria ou apenas conferência estática.

Siga as [responsabilidades dos agentes](../guides/agent-responsibilities.md) e os [critérios de conclusão](../guides/completion-criteria.md). Não altere a aplicação nem suas instruções automaticamente durante a avaliação; apresente o achado e implemente correções somente no escopo autorizado.
