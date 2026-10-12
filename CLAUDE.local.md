# Preferências Locais para Este Repositório

Estas preferências complementam `CLAUDE.md` somente neste projeto.

## Antes de Implementar

- Baseie a decisão no código e na configuração existentes, não em suposições sobre o produto.
- Declare uma suposição somente quando ela afetar o resultado. Se a escolha alterar escopo, contrato da API, modelo ou prompt de IA, custo, permissões do dispositivo ou dados do usuário, peça direção antes de seguir.
- Para uma tarefa com várias etapas, defina critérios observáveis de sucesso e mantenha o plano curto.

## Mudanças Enxutas

- Altere somente os arquivos necessários para cumprir o pedido.
- Não refatore, reformate ou remova código vizinho apenas para deixá-lo mais parecido com uma preferência pessoal.
- Remova somente imports, variáveis, funções ou arquivos que a própria alteração tenha tornado obsoletos.
- Não crie abstrações para um único uso nem opções de configuração sem uma necessidade real.

## Padrões de Implementação

- Siga os padrões já presentes: React Navigation (pilhas `auth`/`noauth`), componentes `@gluestack-ui/themed`, ícones `lucide-react-native`, aliases `@components`, `@screens`, `@services` etc., e um arquivo por endpoint em `nextjs-api/pages/api/`.
- Mantenha tipos próximos de um único consumidor; compartilhe-os em `expo-app/@types/` apenas quando houver reutilização real.
- Use comentários para decisões, restrições e comportamento não óbvio. Não documente o que o código já torna evidente e não adicione comentários `TODO`.
- Quando documentação de uma função for solicitada, mantenha-a curta: propósito, parâmetros relevantes e retorno quando isso ajudar a entender o contrato.

## Interface

- Antes de criar uma tela ou componente, analise o percurso afetado, os componentes reutilizáveis de `src/components/` e `docs/DESIGN.md`.
- Reutilize os tokens Gluestack e as cores já adotadas; não introduza uma biblioteca ou sistema visual novo sem aprovação.
- Prefira uma interface limpa, legível e orientada à tarefa, com estados de pressionado, desabilitado, carregamento, vazio, erro e sem conexão quando aplicáveis.
- Preserve acessibilidade: rótulos claros, contraste suficiente e alvos de toque confortáveis.
- Não use conteúdo fictício apresentado como real (destinos, preços, clima, vistos, avaliações). Solicite o requisito de produto que estiver faltando.

## Verificação e Entrega

- Execute a validação local proporcional à mudança: `npm run lint` e `npx tsc --noEmit` no pacote afetado (comparando com a linha de base de erros conhecida em `AGENTS.md`), `npm run checkup` no app e `npm run build` na API quando fizer sentido. Não há testes.
- Informe comandos executados, resultados, limitações e plataformas que não puderam ser verificadas.
- Não afirme que uma alteração funciona sem evidência da validação correspondente.
