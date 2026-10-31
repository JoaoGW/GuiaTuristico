# Critérios de conclusão

Antes de editar, traduza o pedido em um resultado observável. Para uma tarefa simples, uma frase basta. Use as [responsabilidades dos agentes](agent-responsibilities.md) quando houver distribuição de trabalho.

## Conferência antes da entrega

- **Pedido atendido:** o comportamento ou documento solicitado está entregue no pacote certo (`expo-app/`, `nextjs-api/` ou ambos), incluindo os casos relevantes descritos pelo usuário.
- **Escopo preservado:** confira o diff final. Não pode haver mudança alheia ao pedido, perda de trabalho existente, dependência não aprovada, troca de modelo, prompt, `max_completion_tokens` ou `reasoning_effort` sem pedido, nem alteração de chaves de `AsyncStorage` ou de permissões do dispositivo.
- **Contrato coerente:** se um endpoint mudou, o consumidor em `expo-app` e a documentação em `nextjs-api/src/components/SwaggerAccordion.tsx` mudaram na mesma tarefa.
- **Design coerente:** mudança de interface segue `docs/DESIGN.md`, e `docs/DesignIA_Regras.md` prevalece em qualquer conflito. Só o azul `#2752B7` e seus derivados, sem emoji como ícone, sem dado fictício apresentado como real e com textos em pt-BR.
- **Verificação adequada:** execute só as verificações existentes e pertinentes. Hoje são `npm run lint` e `npx tsc --noEmit` no pacote afetado, `npm run checkup` no app e `npm run build` na API. Não há testes: não invente scripts nem resultados.
- **Evidência real:** diferencie verificações aprovadas, com falha, não executadas e não aplicáveis. Um build não prova uma interação no aparelho. Uma resposta simulada não prova a integração com OpenAI, Google, WeatherAPI ou Firebase. Teste na web (`react-native-web`) não substitui Android ou iOS.
- **Revisão proporcional:** releia o resultado e examine regressões prováveis. Use revisão especializada quando exigida ou útil; não exija todos os revisores para toda tarefa.
- **Referências atualizadas:** se criar ou mover instruções, comandos, agentes ou skills, atualize o mapa em `CLAUDE.md`, o `AGENTS.md`/`CODEX.md` quando aplicável e os arquivos que os citam. Confira os novos caminhos.

Mudanças só em documentação ou configuração podem ser verificadas por leitura, consistência, referências e sintaxe aplicável. Não exigem rodar o app sem uma razão concreta. Não repita verificações aprovadas sem novas mudanças ou dúvidas relevantes.

## Como informar o resultado

- **Concluído:** o resultado pedido e as verificações necessárias ao escopo foram atendidos. Uma revisão pode estar concluída mesmo quando encontra defeitos, desde que relate os achados e o alcance inspecionado.
- **Implementado, com validação parcial:** a mudança existe, mas uma verificação necessária não pôde ser executada (por exemplo, sem aparelho, sem rede ou sem chave). Informe o que foi comprovado, a limitação e como concluir a verificação; não declare aprovação total.
- **Pendente:** parte do pedido não foi implementada ou existe uma falha atribuível à mudança. Corrija o que estiver ao alcance antes de entregar; se depender do usuário ou do ambiente (aprovação de dependência, deploy, credencial), identifique a dependência exata.

Relate falhas preexistentes (por exemplo, as Pendências Conhecidas do `AGENTS.md`) sem apresentá-las como sucesso nem ampliar automaticamente a tarefa para corrigi-las. Não enfraqueça critérios nem execute ações não autorizadas (commit, push, build EAS, deploy na Vercel) para obter aprovação.

A resposta final deve dizer, de forma breve: o que foi entregue, por que a mudança atende ao pedido, o que foi verificado e o que permanece pendente, se houver. Não é necessário reproduzir este checklist inteiro.
