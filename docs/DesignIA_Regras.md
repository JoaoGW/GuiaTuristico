# Como identificar se um design Web/Mobile foi feito por IA

## 1. Sinais de cor

- Gradiente roxo-azul (“vibecode purple”), sobretudo como destaque sem ligação clara com a marca.
- Uso recorrente de índigo/violeta padrão, como `#4F46E5` ou `#5E6AD2`, sem justificativa de identidade visual.
- Paleta tímida, sem uma cor dominante, contraste ou hierarquia claros.
- Faixa lateral colorida de 3–4 px em cards (_left-border strip_).
- “Rainbow status list”: cada linha de lista ou tabela recebe um badge de cor diferente, inclusive estados que deveriam ser neutros.
- Modo escuro automático com bordas de cards em neon ciano ou violeta.
- Em páginas compostas como imagem: glassmorphism excessivo, orbes 3D, ilustrações plásticas e pessoas 3D sem rosto.

## 2. Sinais de tipografia

- Uso quase automático de Inter, Poppins, Space Grotesk, Geist ou Roboto, sem que a escolha pareça pertencer à marca.
- Uma palavra em itálico serifado no meio de um título sans-serif, como sotaque decorativo repetido.
- Texto pequeno demais em telas grandes, ou o oposto: título gigantesco centralizado com selo de ✨ acima.
- Hierarquia fraca, com título, subtítulo e corpo em pesos muito semelhantes.
- Rótulos em CAIXA ALTA acima de todas as seções (_overlines_) sem uma função informacional real.

## 3. Ícones e ilustrações

- Ícone dentro de um chip pastel arredondado, repetido em todos os cards de funcionalidade.
- Ícones genéricos de bibliotecas como Lucide ou Heroicons, sem adaptação à linguagem do produto.
- Emojis usados como ícones de interface, introduzindo cores e estilos fora da paleta.
- Em imagens geradas: pesos de traço inconsistentes, proporções estranhas e cores que parecem vazar entre elementos.
- Ilustrações 3D abstratas com pessoas sem rosto em poses improváveis, segurando formas geométricas ou orbes.

## 4. Layout e estrutura repetitivos

Este costuma ser o sinal mais forte, por ser estrutural e não apenas decorativo:

- Hero centralizado com selo pequeno, título com gradiente, subtítulo e CTA em gradiente.
- Exatamente três cards de funcionalidades em linha, cada um com ícone no topo e texto centralizado.
- Exatamente três planos de preço, com o plano central em destaque.
- Faixa de logos “confiado por” logo depois do hero e FAQ em acordeão perto do rodapé.
- _Cardocalypse_: cards dentro de cards, todos com sombra, borda e padding próprios.
- Passos numerados “1 · 2 · 3” ou índices “01 · 02 · 03” substituindo ícones sem necessidade.
- Hero com texto à esquerda, imagem à direita e dois CTAs em pílula.
- A sequência hero → cards → logos → preços → FAQ → rodapé entregue como página inteira, sem conteúdo específico do negócio.

## 5. Copy e microcopy

- Palavras como “empower”, “unlock”, “seamless”, “elevate”, “supercharge”, “game-changer”, “unleash” e “revolutionize”.
- Frases genéricas como “Built for modern teams” ou “Empower your team to unlock productivity”.
- Uso excessivo de travessões e da estrutura “não é só X, é Y”.
- Conteúdo de exemplo pouco plausível: “Lorem ipsum”, “User Name” ou “Item 1” em uma tela apresentada como final.
- Depoimentos com nomes, fotos ou afirmações genéricas, sem traço de contexto real.

## 6. Sinais específicos de apps mobile

- Mistura de convenções de iOS e Android, como tab bar de iOS junto a FAB de Android.
- Botão de voltar em local ou com comportamento incompatível com a plataforma.
- Alvos de toque inferiores a 44 × 44 pt no iOS ou 48 × 48 dp no Android.
- Gestos inventados, sem correspondência a padrões conhecidos de _swipe_ ou _long press_.
- Ações importantes no topo, ignorando as zonas de alcance do polegar.
- Ausência de estados vazios, de carregamento, erro ou permissão negada: existe apenas o caminho feliz.
- Onboarding genérico de três a cinco telas com a mesma estrutura, ilustração, título e parágrafo curto.

## 7. Sinais específicos de sites e apps web

- Grid responsivo de manual, sem pontos de quebra ou comportamentos adaptados ao conteúdo.
- Microinterações sem propósito: _fade-in_ idêntico em todos os elementos, ícones balançando ou texto com gradiente animado apenas para chamar atenção.
- Estados de hover que não comunicam ação, ou que escondem informação crítica.
- Inconsistência entre telas geradas separadamente: a cor primária, fonte ou estilo mudam sem razão no mesmo produto.

## 8. Quando o “design” é uma imagem gerada, e não uma interface real

Em plataformas como Pinterest e Dribbble, muitas peças apresentadas como UI são imagens estáticas geradas por Midjourney, DALL·E ou Stable Diffusion. Nesse caso, procure por:

- Texto ilegível ou pseudo-texto em botões e barras de navegação.
- Elementos sem sentido funcional: botões duplicados, ícones que não correspondem aos rótulos ou gráficos sem relação com os dados.
- Sombras e profundidade sem fonte de luz coerente.
- Colunas, margens e alinhamentos levemente desalinhados, sem uma grade real.
- Componentes sem variação de estado: tudo é uma imagem congelada.

## 9. Clichês mudam com o tempo

Os sinais não formam uma checklist fixa. À medida que certos clichês se tornam evidentes — como índigo, chip de ícone ou lista arco-íris — os modelos passam a reproduzir outros padrões, como cartões KPI idênticos, números-índice e CTAs em pílula. Por isso, é mais útil observar repetições entre produtos e a falta de decisão contextual do que decorar uma lista de estilos.

---

## 10. Design system: o maior indicador de autoria humana

Interfaces produzidas apenas por IA tendem a apresentar inconsistências entre telas: alturas diferentes de botões, paddings variáveis, sombras, bordas e espaçamentos sem padrão claro. Projetos maduros usam _design tokens_, componentes reutilizáveis e escalas consistentes de tipografia, espaçamento, elevação e raio de borda.

## 11. Estados dos componentes

Designs gerados por IA frequentemente mostram apenas o estado perfeito. Verifique a existência de:

- Hover, focus, pressed e disabled;
- Loading e skeleton;
- Estado vazio e erro;
- Offline e timeout;
- Permission denied.

## 12. Fluxo de navegação

Uma IA pode gerar telas isoladas. Um designer projeta jornadas completas, considerando continuidade, prevenção e recuperação de erros, confirmação, retorno e possibilidade de desfazer ações.

## 13. Arquitetura da informação

Procure por categorias redundantes, nomenclatura inconsistente, excesso de menus e agrupamentos pouco intuitivos. Esses problemas revelam falta de entendimento do domínio e da tarefa do usuário.

## 14. Consistência entre telas

Compare várias telas do mesmo produto: altura de inputs, espaçamentos, ícones, tipografia e componentes reutilizados devem se manter coerentes. Pequenas divergências repetidas são um sinal importante de geração sem uma fonte única de verdade.

## 15. Densidade de informação

A IA pode produzir telas muito vazias, com poucos dados úteis. Produtos reais equilibram produtividade, escaneabilidade e densidade de informação conforme o contexto e a frequência de uso.

## 16. Dados irreais

Dados extremamente genéricos indicam baixa curadoria. Prefira exemplos plausíveis, contextualizados, com nomes, valores, datas e estados que façam sentido para o produto.

## 17. Acessibilidade

Verifique contraste, foco visível, tamanho dos alvos de toque, conformidade com WCAG, navegação por teclado e semântica. Acessibilidade tratada como parte do sistema é um forte sinal de refinamento humano.

## 18. Microinterações

Animações devem comunicar mudança de estado, continuidade e causalidade — não apenas decorar a interface. Pergunte o que cada movimento informa ao usuário.

## 19. Personalidade da marca

Pergunta-chave: **se eu trocar o logotipo, este produto continua parecendo igual?** Quanto maior a identidade visual própria, menor a dependência de padrões genéricos.

## 20. Refinamento humano

Em equipes maduras, a IA pode ser apenas uma etapa inicial:

IA → Figma → Design system → Revisão de UX → Pesquisa → Testes → Refinamentos → Produto

O indicador principal não é o uso de IA, mas a quantidade e a qualidade das decisões humanas posteriores.

---

## Como usar Gluestack UI neste projeto

O documento de implementação complementar é o [DESIGN.md](DESIGN.md). Ele é a fonte de verdade para identidade, cores, acessibilidade e comportamento do produto; Gluestack deve acelerar a construção, não substituir essas decisões.

> **Versão em uso no EZ Trip AI:** o `expo-app` usa **Gluestack UI v1** (`@gluestack-ui/themed` 1.1 com `@gluestack-ui/config`), em que os componentes são importados do pacote e estilizados por props e tokens (`$darkBlue600`, `$xl`…). O modelo "copiar a primitiva para o projeto" e o NativeWind descritos abaixo pertencem às versões mais novas; adotá-los é uma migração que exige aprovação.

### O que está disponível

Na edição gratuita atual, o Gluestack UI disponibiliza mais de 30 primitivas copiáveis e customizáveis, agrupadas em layout, tipografia, formulários, feedback, dados, sobreposições, disclosure e mídia. Entre elas estão `Button`, `FormControl`, `Input`, `Card`, `Badge`, `Progress`, `Toast`, `Skeleton`, `Accordion`, `AlertDialog`, `Modal`, `Table`, `Tabs`, `Image` e `Icon`. A abordagem é de copiar apenas o componente necessário para o código do projeto e adaptar seus estilos — não de importar um tema fechado. [Catálogo de componentes](https://gluestack.io/ui/docs/components/all-components) · [Filosofia da biblioteca](https://gluestack.io/ui/docs/home/overview/introduction)

O Gluestack UI Pro acrescenta uma biblioteca de mais de 50 telas React Native/Expo prontas para adaptação. As categorias publicamente indicadas incluem autenticação, dashboard, e-commerce, social, chat, finanças e fitness. Cada template é independente e pode trazer `data.ts`, tipos e subcomponentes; os componentes primitivos usados por ele devem ser copiados junto. [Visão geral do Pro](https://pro.gluestack.io/docs) · [Estrutura dos templates](https://pro.gluestack.io/docs/project-structure)

### Mapa de aproveitamento para qualquer produto

| Necessidade do produto             | Edição / elementos Gluestack                                                   | Aplicação conforme `DESIGN.md`                                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Entrada ou identificação           | Gratuita: `FormControl`, `Input`, `Button`, `Alert`, `Spinner`                 | Campo legível, rótulo e erro textual; CTA na área de alcance do polegar. Nunca validar só pela cor.                                                                                        |
| Catálogo e seleção de item         | Gratuita: `Card`, `Pressable`, `Heading`, `Text`, `Image`, `Badge`, `Skeleton` | Escolher lista ou grade conforme a tarefa, preservar ilustração própria quando houver e indicar seleção com mais de um sinal. O _Card_ é contêiner, não motivo para criar cards aninhados. |
| Acompanhamento de fluxo            | Gratuita: `Badge`, `Progress`, `Toast`, `Alert`, `Skeleton`                    | Estados devem ser semânticos e consistentes; _toast_ confirma ações, mas não substitui informação persistente.                                                                             |
| Cancelamento e ações irreversíveis | Gratuita: `AlertDialog`, `Button`                                              | Confirmação explícita, texto contextual e botão destrutivo distinto. Não usar modal como decoração.                                                                                        |
| Conteúdo detalhado ou instruções   | Gratuita: `Accordion`, `Divider`, `Text`                                       | Expansão progressiva, leitura escaneável e nenhuma informação operacional crítica escondida.                                                                                               |
| Operação administrativa            | Gratuita: `Card`, `Badge`, `Button`, `Switch`, `Table`                         | Priorizar lista densa no mobile. `Table` é complemento em viewport ampla, não substituto da lista de uma mão.                                                                              |
| Configurações pontuais             | Gratuita: `Select`, `Checkbox`, `Radio`, `Switch`, `Modal`                     | Usar somente quando a escolha exigir esses controles; preservar alvo de toque mínimo definido pelo projeto.                                                                                |
| Estrutura visual de telas          | Pro: referência de templates de autenticação, e-commerce e dashboard           | Adaptar para os fluxos equivalentes do produto. Copiar a estrutura útil, nunca a paleta, a copy, os dados fictícios ou a navegação genérica do template.                                   |

### Regras para os templates Pro

1. Use o template de **autenticação** como ponto de partida estrutural para identificação, acesso ou entrada curta, mas retire campos e passos que não pertencem ao fluxo.
2. Use o template de **e-commerce** apenas para organização de itens, carregamento e detalhes; escolha lista ou grade conforme a necessidade, sem importar carrinho, preços ou recomendações que não existam no produto.
3. Use o template de **dashboard** para hierarquia e estados operacionais, preservando a densidade de informação, as ações rápidas e o tema definidos no `DESIGN.md`.
4. Não introduza templates de chat, social, finanças ou fitness sem uma necessidade de produto explícita. Eles aumentariam a superfície visual e tenderiam a criar uma interface genérica.
5. Ao copiar uma tela, converta os dados de demonstração em dados plausíveis do domínio antes de ela aparecer em qualquer ambiente de revisão.

### Limites de plataforma e integração

Este repositório tem dois pacotes. O `expo-app` (Expo SDK 57, React Native, React Navigation) é onde Gluestack é usado; a `nextjs-api` (Next.js 16 + Tailwind CSS 4) só tem a página de documentação dos endpoints e não deve receber componentes Gluestack.

As telas Pro são distribuídas para React Native/Expo com NativeWind e Expo Router. O app não usa NativeWind nem Expo Router, portanto essas telas servem apenas como referência de composição: copie a estrutura útil e reescreva com `@gluestack-ui/themed`, React Navigation e os componentes de `expo-app/src/components/`. Verifique a compatibilidade de cada primitiva e teste toque, foco e responsividade antes de adotá-la. [Componentes e plataformas](https://gluestack.io/ui/docs/components/all-components) · [Roadmap](https://gluestack.io/ui/docs/guides/more/roadmap)

Para o projeto atual, a integração ocorre pelos componentes locais em `expo-app/src/components/` (por exemplo, `Buttons/Button.tsx`, `InputItems/Input.tsx` e os badges em `Badges/`), que já expressam parte do contrato visual. Ao incorporar uma primitiva, use a paleta de `DESIGN.md` §3; não deixe telas diferentes criarem seus próprios hexadecimais, raios, fontes ou alturas.

### Barreiras contra aparência genérica

- O gradiente de CTA é exclusivo de ações positivas e deve permanecer sutil; não transformar todo título, card ou fundo em gradiente.
- Não usar `LiquidGlass`, orbes, chips de ícone pastel repetidos, nem _glassmorphism_ como estilo padrão, salvo se forem escolhas deliberadas da identidade visual.
- `Fab`, `Drawer`, `Tabs`, `ActionSheet` e `BottomSheet` não devem formar a navegação principal sem uma necessidade comprovada. Introduza esses elementos somente quando reduzirem etapas reais.
- `Icon` serve aos controles utilitários. Ilustrações próprias devem preservar a linguagem visual da marca, para não parecer uma combinação de ícones genéricos.
- Todo componente adotado precisa prever: normal, foco, pressionado, desabilitado, carregando, vazio, erro e offline quando aplicável.

Assim, Gluestack reduz trabalho repetitivo e melhora a consistência, enquanto o `DESIGN.md` preserva o contexto, a personalidade e as decisões de UX que evitam os sinais de uma interface gerada sem curadoria.

## Checklist rápido

1. Este layout aparece em vários produtos de nichos diferentes?
2. A paleta tem uma cor de marca clara ou apenas o “índigo seguro”?
3. Ícones, tipografia, espaçamentos e componentes seguem o mesmo sistema?
4. A linguagem dos títulos e botões parece escrita para este produto ou é genérica?
5. Há estados de vazio, erro, carregamento, permissão e offline?
6. No mobile, a navegação respeita iOS ou Android, sem formar um híbrido?
7. Entre telas, identidade visual, dados e regras de interação permanecem coerentes?
8. As microinterações e a densidade de informação ajudam a tarefa real do usuário?
9. A interface atende requisitos básicos de acessibilidade?
10. Há evidências de pesquisa, testes e refinamento posterior à geração inicial?

## Possíveis critérios para uma avaliação futura

- Uso de _design tokens_;
- consistência de componentes e tipografia;
- cobertura de estados;
- acessibilidade;
- repetição de padrões genéricos;
- identidade visual;
- densidade de informação;
- coerência de navegação;
- plausibilidade e contextualização dos dados.
