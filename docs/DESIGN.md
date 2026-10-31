# DESIGN.md — EZ Trip AI

Versão 2.0 · 30/10/2026. Referência de design do app **EZ Trip AI** (`expo-app/`). Registra o que existe no código e as decisões de design aprovadas em 30/10/2026. Não autoriza inventar produto, regra de negócio, tela ou componente: lacunas viram decisão pendente (§13).

## 0. Hierarquia de regras

1. **`docs/DesignIA_Regras.md` é sempre a regra superior.** Em qualquer conflito entre ele e este arquivo, ou entre ele e o código, prevalece o `DesignIA_Regras.md`.
2. Este `DESIGN.md` (e o resumo em `.claude/skills/frontend/design.md`, que deve dizer o mesmo).
3. O código atual. Onde o código diverge das tabelas de migração abaixo, o código é que deve mudar.

**Situação:** os tokens desta versão são o alvo. A migração das cores no código ainda não foi feita. A troca de fonte (§4) **depende de aprovação para instalar `@expo-google-fonts/nunito-sans`** (o `CLAUDE.md` proíbe adicionar dependências sem aprovação); até lá, o app continua como está.

## 1. Produto e escopo

- Guia turístico com IA para viajantes, em português do Brasil. Guia virtual e mascote: **Felipe** (`src/assets/Mascot/`).
- Jornadas: pontos turísticos próximos e mapa; destinos recomendados e detalhes; chat por texto e por voz com o Felipe; geração de roteiros (preferências → visto → mapa → PDF); favoritos; controle de gastos; notificações; perfil e preferências; telas Premium (sem pagamento integrado).
- Plataformas: Android e iOS (tablet habilitado no iOS). A web existe via `react-native-web`, mas não é um alvo validado.
- Orientação retrato e modo claro (`app.json`: `orientation: portrait`, `userInterfaceStyle: light`). `App.tsx` lê o esquema do sistema só para o fundo raiz e a barra de status; as telas usam cores claras fixas.

## 2. Base técnica da interface

- Biblioteca: **Gluestack UI v1** (`@gluestack-ui/themed` 1.1.73) com a configuração padrão `@gluestack-ui/config` 1.1.19, aplicada em `App.tsx` por `GluestackUIProvider` e `StyledProvider`. A pasta `expo-app/config/` contém uma cópia do tema que não é importada. O alias `@theme` aponta para `src/theme/`, que não existe.
- No tema padrão, `fonts.heading` e `fonts.body` são `undefined`: hoje `Text` e `Heading` usam a fonte do sistema, e a Poppins carregada em `App.tsx` só aparece em `SplashLoading`.
- Componentes Gluestack usados sem estilo próprio (`Button` padrão, `Checkbox` marcado, foco de `Input`) pegam a escala `$primary*` do tema (`#0077E6`, `#005DB4`, `#004282`), que também precisa migrar (§3.4).
- Ícones: `lucide-react-native` (padrão do app); `@expo/vector-icons` aparece em um único ponto.
- Animações: `react-native-reanimated` 4, `Animated` do React Native na barra de navegação e `@legendapp/motion` como driver do Gluestack.
- Outros componentes visuais: `react-native-reanimated-carousel`, `react-native-calendars`, `react-native-timeline-flatlist`, `react-native-country-flag`, `expo-linear-gradient`, `expo-glass-effect`, `react-native-indicators`.
- SVG via `react-native-svg` + `react-native-svg-transformer`.

## 3. Cores

Um único azul de marca (`#2752B7`) e um único vermelho de erro (`#EF4444`). Os estados derivados mantêm o matiz da cor-base e mudam só a luminosidade. Nomes de token propostos para o arquivo de tokens (§13, item 1); até ele existir, use o hex.

### 3.1 Tokens

| Token | Valor | Papel |
| --- | --- | --- |
| `$brand` | `#2752B7` | Cor da marca: botão primário, item ativo da `NavigationBar`, links, ícones de destaque, títulos de tela, splash |
| `$brandPressed` | `#1F4292` | Pressionado/hover do que usa `$brand`. Mesmo matiz (222°) e saturação (65%), luminosidade 43,5% → 34,7% |
| `$brandTint` | `#E9EDF8` | Fundo de seleção, balão do Felipe, fundos informativos. Matiz 222°, luminosidade 94,3% |
| `$error` | `#EF4444` | Erro em ícone, borda de campo, indicador e contorno. Não usar em texto pequeno (ver §3.2) |
| `$errorStrong` | `#D41212` | Texto de erro e superfícies vermelhas com texto branco. Mesmo matiz (0°) e saturação (84%) de `$error`, luminosidade 60% → 45% |
| `$errorTint` | `#FEF1F1` | Fundo de erro (igual ao `$backgroundLightError` do tema Gluestack, já usado pelo `Toast`) |
| `$bgScreen` | `#FDFDFD` | Fundo de tela |
| `$surface` | `#FFFFFF` | Cartões, campos, diálogos |
| `$bgAlt` | `#F8F8F8` | Fundo alternativo (absorve `#F9FAFB`) |
| `$surfaceMuted` | `#F3F4F6` | Superfície neutra, segmentos inativos (absorve `#F0F0F0`) |
| `$border` | `#E5E5E5` | Divisórias (absorve `#E5E7EB`) |
| `$borderStrong` | `#D1D5DB` | Bordas decorativas de cartões |
| `$textPrimary` | `#1F2937` | Texto principal |
| `$textSecondary` | `#6B7280` | Texto secundário, ícone inativo, placeholder, borda de campo (absorve `$gray500`, `$gray600`, `#666666`) |
| `$gold` | `#FFD700` | Estrela de avaliação, destaque Premium e destaque sobre `$brand` |
| `$goldTint` | `#FEF3C7` | Fundo Premium e balão do usuário (absorve `$yellow100`) |

`$gray500`, `$gray600`, `$gray700` e `$yellow` aparecem no código, mas não existem no tema padrão do Gluestack v1 (não há família `gray`). Migre-os para os tokens acima; o efeito atual em tela não foi verificado.

### 3.2 Contraste (WCAG 2.x)

| Par | Razão | Resultado |
| --- | --- | --- |
| Branco sobre `$brand` | 7,05:1 | AAA texto normal |
| Branco sobre `$brandPressed` | 9,32:1 | AAA |
| `$brand` sobre `$brandTint` | 6,02:1 | AA texto normal |
| `$textPrimary` sobre `$brandTint` | 12,54:1 | AAA |
| `$brand` sobre `$bgScreen` | 6,93:1 | AA texto normal |
| `$textPrimary` sobre `$bgScreen` | 14,43:1 | AAA |
| `$textSecondary` sobre `$surface` / `$bgScreen` / `$bgAlt` | 4,83 / 4,75 / 4,55:1 | AA, no limite |
| `$textSecondary` sobre `$surfaceMuted` / `$brandTint` | 4,39 / 4,16:1 | **Falha** para texto normal |
| `$error` sobre `$surface` | 3,76:1 | Só ícone, borda e texto grande (≥ 24 px, ou ≥ 18,7 px em 700) |
| `$errorStrong` sobre `$surface` / `$errorTint` | 5,39 / 4,90:1 | AA texto normal |
| Branco sobre `$errorStrong` | 5,39:1 | AA texto normal |
| `$error` sobre `$brand` | 1,87:1 | **Proibido** |
| `$gold` sobre `$brand` | 5,03:1 | AA texto normal |
| `$gold` sobre `$surface` | 1,40:1 | **Falha**: estrela sempre acompanhada da nota em texto |

### 3.3 Regras de uso

- Não introduza outra cor primária, outro azul ou outro vermelho. Estado nunca depende só de cor: use também texto, ícone ou forma.
- Texto secundário (`$textSecondary`) só sobre `$surface`, `$bgScreen` ou `$bgAlt`; sobre `$surfaceMuted` ou `$brandTint`, use `$textPrimary`.
- Sobre fundo `$brand` (onboarding, preferências do roteiro), texto e ícones em branco; destaque em `$gold`; erro em branco com ícone, nunca em vermelho.
- Desabilitado: opacidade 0,4 (padrão Gluestack) mais `accessibilityState.disabled`; não criar cinza próprio.
- Cores fora desta tabela (por exemplo `$green600`, `$orange600`, `#374151`, `#9CA3AF`) estão em decisão pendente (§13); não as espalhe.

### 3.4 Migração dos azuis

| Valor atual | Usos | Onde | Token novo |
| --- | --- | --- | --- |
| `#2752B7` | 186 | Ícones, `NavigationBar`, títulos, valores | `$brand` (sem mudança) |
| `#336DF6` | 10 | `Introduction`, `Welcome`, `Login`, `SignUp`, `ForgotPassword` | `$brand` |
| `#3B82F6` | 6 | `ItineraryActionsDialog`, `itineraryStyles.ts`, `ExpenseControl` | `$brand` |
| `#2563EB` | 6 | `AIMascotIntroduction`, `GenerateItineraryFeaturesIntroduction`, `GenerateItineraryPreferences`, `UserPreferences` | `$brand` |
| `#0A84FF` | 3 | `Home` (links "Ver tudo"/"Ver mapa") | `$brand` |
| `#1E40AF` | 6 | Splash em `app.json` (3), fundo de carregamento em `App.tsx` (1), `itineraryStyles.ts` (2) | `$brand` |
| `$darkBlue600` (`#005DB4`) | 2 | `Buttons/Button.tsx`: fundo do sólido e texto do outline | `$brand` |
| `$darkBlue700` (`#004282`) | 1 | `Buttons/Button.tsx`: pressionado | `$brandPressed` |
| `$blue400` (`#60A5FA`) | 4 | Bordas dos atalhos da `Home` | `$brand` |
| `$blue800` (`#1E40AF`) | 1 | `CategoryBadges` | `$brand` |
| `$blue100` (`#DBEAFE`) | 1 | `AiBalloon` | `$brandTint` |
| `#DBEAFE` | 4 | `AiBalloon` (cauda), `DestinationDetails`, `RecommendedDestinations` | `$brandTint` |
| `#E0E7FF` | 4 | `ExpenseControl` | `$brandTint` |
| `$primary*` do tema | implícito | `Button` padrão, `Checkbox`, foco de `Input` | No tema: `primary0`–`100` → `$brandTint`; `primary200`–`500` → `$brand`; `primary600`–`950` → `$brandPressed` |

Após a troca do splash para `#2752B7`, confira a legibilidade de `splash-icon.png` sobre o novo fundo.

### 3.5 Migração dos vermelhos

| Valor atual | Usos | Onde | Token novo |
| --- | --- | --- | --- |
| `#EF4444` / `#ef4444` | 13 | Textos de `FormControlErrorText`, ícones | Ícone/borda: `$error`; texto: `$errorStrong` |
| `$red500` (`#EF4444`) | 5 | `AlertToast`, `CharacterLimiter`, `ChooseDialog`, `CurrentStatusBar` | Borda/ponto: `$error`; texto: `$errorStrong`; botão de `ChooseDialog`: botão destrutivo (§7.2) |
| `#FF0000` / `#ff0000` | 7 | `AlertToast`, `Maps`, `SlideUpItinerary`, `Home`, `Profile` | `$error` |
| `#DC2626` | 7 | `ItineraryActionsDialog`, `DestinationDetails`, `CancelPremiumPlan` | Ícone: `$error`; texto ou fundo com texto branco: `$errorStrong` |
| `$red600` (`#DC2626`) | 1 | `OpenStatusBadge` ("Fechado") | Fundo `$errorTint`, texto `$errorStrong` |
| `#FF3B30` | 5 | `ExpenseControl`, `FavoritePlaces` | `$error` |
| `#FBBF24` (erro sobre azul) | 1+ | `GenerateItineraryPreferences` | Branco + ícone `CircleAlert` |

## 4. Tipografia

### 4.1 Famílias

| Família | Uso | Situação |
| --- | --- | --- |
| **Nunito Sans** (`@expo-google-fonts/nunito-sans` 0.4.x) | Toda a interface: `fonts.heading` e `fonts.body` | Aprovada; instalação pendente de aprovação |
| **Libre Bodoni 700** | Só o título "EZ TRIP AI" em `Login`, `SignUp` e `ForgotPassword` | Mantida |
| ~~Poppins~~ | Sai: o `DesignIA_Regras.md` §2 a lista entre as fontes que sinalizam design genérico de IA | Remover após a migração |

Por que Nunito Sans: é humanista, com terminais suavizados que combinam com os raios de 20 e o tom acolhedor do Felipe, cobre Latin Extended (acentos do pt-BR) e contrasta bem com a serifa de alto contraste da Libre Bodoni.

### 4.2 Pesos carregados

Carregar **400 (Regular), 600 (SemiBold) e 700 (Bold)**; cerca de 113 KB por arquivo. Três pesos bastam para a hierarquia abaixo. Não carregar 300 (a Poppins 300 nunca foi usada) nem 500.

- `$medium` (48 usos) passa para `$semibold` na mesma alteração; com a fonte nova, um peso não carregado cai na fonte do sistema.
- Use sempre os tokens `$normal`, `$semibold`, `$bold`. Não escreva pesos literais como `"bold"`, `"500"`, `"600"` ou `"700"` (23 usos hoje, em props e estilos): o resolvedor de fontes só converte tokens.

### 4.3 Escala (Gluestack)

| Papel | Peso | Token | Tamanho / altura de linha (px) |
| --- | --- | --- | --- |
| Marca "EZ TRIP AI" | Libre Bodoni 700 | `$4xl` | 36 / 48 |
| Número de destaque (total de gastos, contadores do mapa) | 700 | `$4xl` | 36 / 48 |
| Título de tela ("Itinerários de Viagem") | 700 | `$3xl` | 30 / 40 |
| Título de diálogo ou modal | 700 | `$2xl` | 24 / 32 |
| Título de seção ("Recomendados para você") | 700 | `$xl` | 20 / 28 |
| Título de cartão, subtítulo | 600 | `$lg` | 18 / 24 |
| Corpo, mensagens do chat | 400 | `$md` | 16 / 24 |
| Rótulo de botão, de campo e do item ativo da barra | 600 | `$md` | 16 / 22 |
| Texto secundário | 400 | `$sm` | 14 / 20 |
| Metadado (horário do balão), badge | 400 / 600 | `$xs` | 12 / 18 |

`$2xs` (10 px) não é usado para texto. `$5xl` e maiores ficam fora do app. Não use itálico serifado como enfeite nem rótulos em caixa alta sobre seções (`DesignIA_Regras.md` §2).

### 4.4 Aplicação prevista (não implementada)

Depende da aprovação da dependência. Quando aprovada, a mudança é:

1. `App.tsx`: trocar o `useFonts` da Poppins por `NunitoSans_400Regular`, `NunitoSans_600SemiBold`, `NunitoSans_700Bold`; mover para lá a `LibreBodoni_700Bold` (hoje carregada em cada tela de credencial).
2. Tema estendido (local a definir, §13 item 1): `createConfig({ ...config, tokens: { ...config.tokens, fonts: { heading: 'NunitoSans', body: 'NunitoSans' }, colors: {…} }, plugins: [...config.plugins, new FontResolver()] })`. `FontResolver` e `createConfig` são exportados por `@gluestack-ui/themed` e convertem `NunitoSans` + `$bold` em `NunitoSans_700Bold`.
3. Trocar `'Poppins_400Regular'` em `SplashLoading` por `$body`, e a fonte do HTML de exportação de roteiro (`printExportItinerary.ts`, via Google Fonts) para Nunito Sans.
4. Validar em Android e iOS: acentos, quebra de linha e altura dos botões.

## 5. Forma, espaçamento e elevação

| Item | Regra | Migra de |
| --- | --- | --- |
| Raio pequeno | `$lg` (8): badges; `$md` (6): indicador de checkbox (como hoje) | 7 |
| Raio de controle | `$xl` (12): botões, campos | 10, 12 |
| Raio médio | `$2xl` (16): item ativo da `NavigationBar`, atalhos da `Home`, diálogos | 15, 16 |
| Raio de cartão | 20 (o mais usado; não há token Gluestack): cartões, `NavigationBar`, balões do chat | 18, 25 |
| Raio total | `$full`: avatares, círculos, pílulas | 50 |
| Espaçamento | Escala Gluestack em múltiplos de 4: `$1` 4, `$2` 8, `$3` 12, `$4` 16, `$5` 20, `$6` 24, `$8` 32, `$10` 40 | Valores locais |
| Margem lateral de tela | `$4` (16), a mesma da `NavigationBar` | 10, 25 |
| Elevação 0 | Sem sombra: badges, itens de lista, elementos dentro de cartões | Sombra em `CategoryBadges` |
| Elevação 1 | Cartões: deslocamento 0×4, opacidade 0,1, raio 8, `elevation` 4 | 0×2/0×4, opacidade 0,08–0,3 |
| Elevação 2 | Flutuantes (`NavigationBar`, toast): 0×6, opacidade 0,1, raio 12, `elevation` 10 | — |

Não aninhe cartões com sombra própria dentro de outros cartões.

## 6. Navegação e estrutura de tela

- React Navigation 7, `native-stack` sem cabeçalho nativo (`headerShown: false`) e transição `animation: 'none'` na maioria das telas (`WelcomePremium` usa `flip`). Cada tela desenha o próprio cabeçalho; `components/TitleBack.tsx` é o cabeçalho com voltar.
- `NavigationBar`: barra inferior flutuante (largura da tela − 32, raio 20, fundo branco 92,5%, elevação 2) com 5 itens: Roteiros, Chat IA, Início, Gaming e Perfil. O item ativo se expande para ~48% da largura com fundo `$brand` (raio 16, altura 50), ícone e rótulo brancos em 600; os inativos mostram só o ícone em `$textSecondary`. "Gaming" não tem tela.
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

### 7.1 Estados do `Button` (`Buttons/Button.tsx`)

| Estado | Sólido | Outline |
| --- | --- | --- |
| Padrão | Fundo `$brand`, rótulo branco 600 `$md`, raio `$xl`, altura mínima 48 | Fundo transparente, borda 1,5 `$brand`, rótulo `$brand` |
| Pressionado | Fundo `$brandPressed` | Fundo `$brandTint`, rótulo `$brandPressed` |
| Desabilitado | Opacidade 0,4 + `accessibilityState.disabled` | Igual |
| Carregando | Não interativo (`disabled`, como hoje) e sem esmaecer; `ButtonSpinner` branco no lugar do rótulo, `accessibilityState.busy` e o rótulo mantido em `accessibilityLabel` | Spinner `$brand` |

O outline atual não tem borda nem estado pressionado; passa a ter.

### 7.2 Outros estados

| Componente | Regra |
| --- | --- |
| Botão destrutivo (`ChooseDialog`, `ItineraryActionsDialog`, `CancelPremiumPlan`) | Fundo `$errorStrong`, rótulo branco com o verbo da ação ("Excluir roteiro"); pressionado com opacidade 0,85 (4,60:1 com branco). Sempre ao lado de "Cancelar" em outline |
| `Input` (`InputItems/Input.tsx`) | Fundo `$surface`, borda 1 `$textSecondary`, placeholder `$textSecondary`, raio `$xl`, altura 48. Foco: borda 2 `$brand`. Erro: borda 2 `$error` e, abaixo, ícone `CircleAlert` + mensagem em `$errorStrong` `$sm`. Hoje o placeholder `$trueGray400` sobre `$trueGray200` tem 2,0:1 |
| `Checkbox` (Gluestack) | Indicador 24, raio `$md` (6), borda 2 `$textSecondary`; marcado: fundo `$brand` e `Check` branco. Sobre fundo `$brand`: borda branca; marcado com fundo branco e `Check` `$brand`. Linha inteira tocável (≥ 48 de altura), `CheckboxLabel` visível e `value` único e não vazio |
| `CategoryBadges` | Fundo `$brand`, ícone e texto brancos 600, raio 20, sem sombra |
| `OpenStatusBadge` | "Fechado": fundo `$errorTint`, `DoorClosed` e texto `$errorStrong`. "Aberto": fundo `$surfaceMuted`, `DoorOpen` e texto `$textPrimary` (estado normal não ganha cor; ver §13) |
| `HighRatingBadge` | Fundo `$goldTint`, ícone e texto `$textPrimary`, junto da nota numérica. Hoje usa branco sobre `$yellow400` (1,53:1) |
| `AiBalloon` / `UserBalloon` | Felipe: fundo `$brandTint`; usuário: fundo `$goldTint`; texto `$textPrimary`; horário `$textSecondary` `$xs` |
| `NavigationBar` | Ver §6. Cada item: `accessibilityRole="tab"`, `accessibilityLabel` com o rótulo e `accessibilityState.selected`; itens inativos (≈ 42 de largura em tela de 390) com `hitSlop` até 48 |
| `AlertToast` | Borda `$error`, ícone `$error`, título e ação em pt-BR ("Erro", "Tentar de novo"); não substitui a mensagem de erro na tela |

## 8. Padrões de conteúdo e IA

- Todo texto de interface em português do Brasil (100%), com o tom acolhedor do Felipe. Pendências vistas no código: "Error!" e "Retry" (`AlertToast`), "Holiday" (atalho da `Home`), "Gaming" (`NavigationBar`), textos de permissão em inglês no `app.json`, grafia "Vôos".
- Sem dado fictício apresentado como real: contadores, notas, avaliações, perfis, preços, clima, vistos e status como "Online" só com origem real ou rótulo explícito de exemplo. Exemplo atual a corrigir: valor fixo "999999" em `ManagePremiumPlan`.
- Respostas da IA aparecem em `AiBalloon`; no chat de voz a resposta também é falada (`expo-speech`) e a transcrição é exibida.
- Sem conexão, o app usa respostas por palavra-chave (`felipeResponseSystem`) e mostra `ConnectionErrorAlerter`.
- Erro visível: falha de rede, de IA (429, tempo esgotado, resposta ilegível) ou de validação aparece na própria tela, com texto e ação de recuperação. `Alert.alert` (17 arquivos hoje) só complementa, nunca é o único aviso.
- Imagens de destino vêm do Google Places (via API) ou de URLs públicas (Pixabay/Pexels) nos dados ilustrativos de `src/data/`.
- Sem jargão de marketing ("eleve", "desbloqueie", "revolucione") e sem a estrutura "não é só X, é Y".

## 9. Ícones e imagens

- Ícones somente de `lucide-react-native`, traço 2 (2,5 no item ativo da barra), cor de token. **Proibido emoji como ícone** (hoje há "✓", "✕", "📍" e "✨" em `ItineraryPreferencesModal`, `ItineraryCreateDialog`, `SimulatedAd` e no HTML de exportação).
- Não colocar ícone dentro de chip pastel repetido em todos os cartões.
- Ativos otimizados: nada de PNG de dezenas de MB. Hoje `evento.png`, `comidas.png`, `ciencia.png`, `cachoeira.png`, `culturas.png`, `museus.png` e `monumentoshistoricos.png` têm de 24 a 43 MB; alvo: JPEG/WebP na largura de exibição (até 2×), com algumas centenas de KB.
- Mascote Felipe com fundo transparente, nunca sobre retângulo preto (visto no Chat IA). Quatro SVGs do mascote têm de 1,6 a 3,8 MB; otimizar.

## 10. Acessibilidade

- Toda ação tem nome acessível: `accessibilityLabel` e `accessibilityRole` em botões, sobretudo os só com ícone (barra de navegação, gravar voz, recentralizar mapa, fechar). Checkbox e ícone tocável sempre com nome. Hoje não há nenhum em `src/`.
- Alvos de toque de pelo menos 44 × 44 pt (iOS) / 48 × 48 dp (Android); use `hitSlop` quando o desenho for menor.
- Contraste conforme §3.2: texto normal ≥ 4,5:1; ícones, bordas de campo e texto grande ≥ 3:1.
- Estados de carregamento, vazio, erro, sem conexão e permissão negada (localização, microfone, contatos) explícitos e textuais.
- Ordem de leitura lógica; respeitar a preferência de movimento reduzido; não comunicar estado só por cor, ícone, animação ou gesto.

## 11. Anti-padrões proibidos (resumo do `DesignIA_Regras.md`)

- Gradiente roxo-azul, índigo padrão (`#4F46E5`, `#5E6AD2`) ou qualquer azul além de `$brand` e derivados.
- Faixa colorida lateral em cartões; lista com um badge de cor diferente por linha.
- Poppins, Inter, Roboto, Geist ou Space Grotesk como fonte de interface.
- Emoji como ícone; ícone em chip pastel repetido; ilustração 3D genérica.
- Cartões dentro de cartões, cada um com sombra e borda.
- Copy genérica de marketing; "Lorem ipsum", "User Name", "Item 1" ou dado fictício apresentado como real.
- Telas só com o caminho feliz; alvos de toque pequenos; mistura de convenções iOS e Android.
- Glassmorphism, orbes ou `LiquidGlass` como estilo padrão.

## 12. Checklist de aceitação de UI

- [ ] Respeita o `DesignIA_Regras.md` (regra superior) e §11.
- [ ] Usa só os tokens de §3.1 (um azul, um vermelho e seus derivados) e componentes de `src/components/`.
- [ ] Tipografia pela escala de §4.3, com pesos por token.
- [ ] Textos 100% em pt-BR, sem dado fictício apresentado como real.
- [ ] Ícones `lucide-react-native`, sem emoji; imagens otimizadas.
- [ ] Controles com nome acessível, contraste de §3.2 e alvo de toque adequado.
- [ ] Estados de pressionado, desabilitado, carregando, vazio, erro (visível na tela) e sem conexão quando aplicáveis.
- [ ] Usável em retrato estreito, respeitando área segura e a `NavigationBar` flutuante.
- [ ] Verificado em Android e/ou iOS quando houver destino disponível; o que não foi verificado está relatado.

## 13. Decisões pendentes

1. **Arquivo de tokens**: não existe. Proposta: `src/theme/` (alias `@theme` já configurado) com os tokens de §3.1, a escala `$primary*` remapeada e as fontes de §4.4. Precisa de aprovação.
2. **Instalação de `@expo-google-fonts/nunito-sans`**: decisão de fonte tomada; a dependência exige aprovação.
3. **Cor de sucesso**: `$green600` ("Aberto", confirmações) não está na paleta. Até decidir, "Aberto" usa o estilo neutro de §7.2.
4. **Cores fora da paleta**: `#374151` e `#9CA3AF` (`itineraryStyles.ts`, placeholders, ícones de estado vazio), `$orange600` (nota baixa) e `$yellow400`/`$yellow500`. Sugestão: `$textPrimary` e `$textSecondary`; confirmar caso a caso.
5. **Modo escuro**: desativado em `app.json`; não implementar sem decisão.
6. **Item "Gaming"** da barra de navegação sem tela correspondente.
7. **Premium e anúncios**: telas e AdMob existem, mas não há integração de pagamento.
8. **Suporte web e foco visível por teclado**: não validados.
