# DESIGN.md — EZ Trip AI

Referência de design do app **EZ Trip AI** (`expo-app/`). Este arquivo substitui as versões herdadas de outros produtos (Multscan Monitor e Aprova.Ai) e registra apenas o que existe no código em 12/10/2026. Não autoriza inventar produto, regra de negócio ou sistema visual: lacunas viram pergunta (§10).

## 1. Produto e escopo

- Guia turístico com IA para viajantes, em português do Brasil. Guia virtual e mascote: **Felipe** (`src/assets/Mascot/`).
- Jornadas: pontos turísticos próximos e mapa; destinos recomendados e detalhes; chat por texto e por voz com o Felipe; geração de roteiros (preferências → visto → mapa → PDF); favoritos; controle de gastos; notificações; perfil e preferências; telas Premium (sem pagamento integrado).
- Plataformas: Android e iOS (tablet habilitado no iOS). A web existe via `react-native-web`, mas não é um alvo validado.
- Orientação retrato e modo claro (`app.json`: `orientation: portrait`, `userInterfaceStyle: light`). `App.tsx` lê o esquema do sistema só para o fundo raiz e a barra de status; as telas usam cores claras fixas.

## 2. Base técnica da interface

- Biblioteca: **Gluestack UI v1** (`@gluestack-ui/themed`) com a configuração padrão `@gluestack-ui/config`, aplicada em `App.tsx` por `GluestackUIProvider` e `StyledProvider`. A pasta `expo-app/config/` contém uma cópia do tema que não é importada.
- Ícones: `lucide-react-native` (padrão do app); `@expo/vector-icons` aparece em um único ponto.
- Animações: `react-native-reanimated` 4 (Animated, `withTiming`, `withRepeat`), `Animated` do React Native na barra de navegação e `@legendapp/motion` como driver do Gluestack.
- Outros componentes visuais: `react-native-reanimated-carousel`, `react-native-calendars`, `react-native-timeline-flatlist`, `react-native-country-flag`, `expo-linear-gradient`, `expo-glass-effect`, `react-native-indicators`.
- SVG via `react-native-svg` + `react-native-svg-transformer` (arquivos `.svg` importados como componentes).

## 3. Cores

Não há arquivo de tokens próprio: as cores são tokens Gluestack (`$darkBlue600`, `$gray600`, `$red500`, `$white`…) ou hex escritos nos componentes. Os valores abaixo são os mais recorrentes em `src/` e funcionam como paleta de fato.

| Papel | Valor | Observação |
| --- | --- | --- |
| Primária (azul da marca) | `#2752B7` | Cor mais usada: ícones de destaque, item ativo da `NavigationBar`, valores em `DestinationDetails` |
| Botão primário | `$darkBlue600` / `$darkBlue700` (pressionado) | `components/Buttons/Button.tsx` |
| Splash e carregamento inicial | `#1E40AF` | `app.json` e `App.tsx` |
| Fundo de tela | `#FDFDFD`, `#FFFFFF`, `#F8F8F8` | |
| Superfícies neutras e bordas | `#F3F4F6`, `#F0F0F0`, `#E5E5E5`, `#D1D5DB` | |
| Texto principal | `#1F2937` | |
| Texto secundário / ícone inativo | `#6B7280`, `$gray600`, `$gray500` | |
| Destaque dourado | `#FFD700`, fundo `#FEF3C7` | Avaliação e Premium |
| Erro | `#EF4444`, `$red500` | |

Ao criar algo novo, reutilize estes valores ou o token Gluestack equivalente; não introduza outra cor primária. Estado nunca deve depender só de cor.

## 4. Tipografia

- **Poppins** 300, 400 e 500 (`@expo-google-fonts/poppins`), carregadas em `App.tsx` antes de esconder o splash.
- **Libre Bodoni** 700 (`@expo-google-fonts/libre-bodoni`) apenas no título das telas de Login e Cadastro, carregada na própria tela.
- Tamanhos e pesos pela escala Gluestack (`$xs`…`$4xl`; `$medium`, `$semibold`, `$bold`), que é a forma predominante no código.

## 5. Forma, espaçamento e elevação

- Raios recorrentes: 20 (mais comum, inclusive a `NavigationBar`), 15, 12, 16, `$2xl`, `$xl` (botão) e `50`/`$full` para avatares e pílulas.
- Espaçamento pela escala Gluestack (`$1`…`$10`) e valores numéricos locais; não há escala própria.
- Sombras discretas em cartões e na barra de navegação (`shadowOffset` 0×6).

## 6. Navegação e estrutura de tela

- React Navigation 7, `native-stack` sem cabeçalho nativo (`headerShown: false`) e transição `animation: 'none'` na maioria das telas (`WelcomePremium` usa `flip`). Cada tela desenha o próprio cabeçalho; `components/TitleBack.tsx` é o cabeçalho com voltar.
- `NavigationBar`: barra inferior flutuante (largura da tela − 32, raio 20) com 5 itens — Roteiros, Chat IA, Início, Gaming e Perfil. O item ativo se expande para ~48% da largura com fundo `#2752B7`, ícone e rótulo brancos; os inativos mostram só o ícone em `#6B7280`. "Gaming" não tem tela.
- Telas com a barra: as embrulhadas por `ScreenWrapper` em `auth.routes.tsx` (Perfil, Roteiros, Mapa do Roteiro, Chat IA, Chat por voz, Menu do Chat e Gerenciar Premium) e `RecommendedDestinations`, que a renderiza por conta própria. `Home` não exibe a barra.
- Onboarding (`Presentations/Introduction` e `Welcome`) com ilustrações Storyset em `assets/Illustrations/Welcome/` e link de crédito ao Storyset.

## 7. Componentes existentes (`src/components/`)

| Grupo | Componentes |
| --- | --- |
| Botões | `Button` (variantes `solid`/`outline`, `isLoading` com spinner, largura total), `ButtonIconLeft`, `ButtonIconRight`, `ButtonIconImageLeft`, `ButtonSelect`, `IconButton` |
| Cartões e badges | `ItineraryCard`, `NotificationCard`, `CategoryBadges`, `HighRatingBadge`, `OpenStatusBadge` |
| Chat | `AiBalloon`, `UserBalloon` |
| Diálogos e modais | `ChooseDialog`, `ChooseBackgroundDialog`, `ItineraryActionsDialog`, `SaveItineraryDialog`, `AddExpenseModal`, `ExpenseAddedModal` |
| Erros | `AlertToast`, `ConnectionErrorAlerter` (sem conexão), `LocalFetchError`, `ItinerariesError`, `PastItinerariesError`, `NotificationsError` |
| Carregamento | `Loading`, `SplashLoading` |
| Home e mapas | `Destinations`, `GlobalDestinations`, `UserInfo`, `Maps`, `RecenterButton`, `DestinationStories`, `CarouselImages` |
| Roteiro | `ChooseGenerateStyle`, `ItineraryCategoriesDefine`, `ItineraryCreateDialog`, `ItineraryPreferencesModal`, `ItinerarySliderDateShow`, `UnlockProgressModal`, `VisaModel`, `SlideUpItinerary`, `SlideUpPlaces` |
| Outros | `NavigationBar`, `TitleBack`, `CurrentStatusBar`, `Input`, `CharacterLimiter`, `Tags`, `SettingsOption`, perfis em `Profile/`, `GoPremium`, `SimulatedAd`, `AnimatedStar` |

Reutilize um destes antes de criar um novo. Componente novo entra na pasta do seu domínio.

## 8. Padrões de conteúdo e IA

- Todo texto de interface em português do Brasil, com o tom acolhedor do Felipe.
- Respostas da IA aparecem em `AiBalloon`; no chat de voz a resposta também é falada (`expo-speech`) e a transcrição é exibida.
- Sem conexão, o app usa respostas por palavra-chave (`felipeResponseSystem`) e mostra `ConnectionErrorAlerter`.
- Imagens de destino vêm do Google Places (via API) ou de URLs públicas (Pixabay/Pexels) nos dados ilustrativos de `src/data/`.

## 9. Acessibilidade

- Hoje não há `accessibilityLabel` nem `accessibilityRole` em `src/`. Em código novo ou alterado, adicione rótulo e papel a controles, sobretudo botões só com ícone (barra de navegação, gravar voz, recentralizar mapa).
- Alvos de toque de pelo menos 44 × 44 pt (iOS) / 48 × 48 dp (Android).
- Contraste (WCAG 2.x): branco sobre `#2752B7` = 7,05; `#1F2937` sobre `#FDFDFD` = 14,4; `#6B7280` sobre `#FDFDFD` = 4,75 e sobre `#F8F8F8` = 4,55 — atende AA, mas no limite; não o use sobre fundos mais escuros que `#F8F8F8`.
- Estados de carregamento, vazio, erro, sem conexão e permissão negada (localização, microfone, contatos) devem ser explícitos e textuais.

## 10. Lacunas que exigem decisão

1. Arquivo central de tokens (cores, raios, espaçamento): não existe; cores estão espalhadas como hex.
2. Modo escuro: desativado em `app.json`; não implementar sem decisão.
3. Item "Gaming" da barra de navegação sem tela correspondente.
4. Premium e anúncios: telas e AdMob existem, mas não há integração de pagamento.
5. Suporte web e foco visível por teclado: não validados.

## 11. Checklist de aceitação de UI

- [ ] Reutiliza componentes de `src/components/` e a paleta de §3.
- [ ] Textos em pt-BR, sem dados fictícios apresentados como reais.
- [ ] Controles com rótulo acessível e alvo de toque adequado.
- [ ] Estados de pressionado, desabilitado, carregando, vazio, erro e sem conexão quando aplicáveis.
- [ ] Usável em retrato estreito, respeitando área segura e a `NavigationBar` flutuante.
- [ ] Verificado em Android e/ou iOS quando houver destino disponível; o que não foi verificado está relatado.
