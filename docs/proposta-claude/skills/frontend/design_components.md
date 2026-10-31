# EZ Trip AI — Catálogo de componentes

Catálogo dos componentes que existem em `expo-app/src/components/` em 30/10/2026, com o caminho real, o export e a regra visual de `docs/DESIGN.md` v2.0. `docs/DesignIA_Regras.md` prevalece em qualquer conflito. A coluna "Ajuste pendente" registra onde o código ainda diverge do Design System; não é autorização para refatorar fora do escopo de uma tarefa.

| Campo | Valor |
| --- | --- |
| Projeto | EZ Trip AI (GuiaTuristico) — app `expo-app/` |
| Biblioteca de componentes | Gluestack UI v1 (`@gluestack-ui/themed`, tema padrão `@gluestack-ui/config`) |
| Ícones | `lucide-react-native` (nunca emoji) |
| Diretório de componentes | `expo-app/src/components/<Domínio>/` (alias `@components`) |
| Fonte dos tokens | `docs/DESIGN.md` §3–§5. Não existe arquivo de tokens; a proposta `src/theme/` está pendente de aprovação |

Ao criar um componente ou mudar o contrato de um existente, atualize esta tabela na mesma tarefa. Componente novo entra na pasta do seu domínio e só depois de verificar que nenhum destes atende.

## Botões

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `Button` | `@components/Buttons/Button` | Botão de largura total. Props: `title`, `variant` (`solid`/`outline`), `isLoading`, demais props do Gluestack. Estados (§7.1): padrão, pressionado, desabilitado (opacidade 0,4) e carregando (spinner, sem esmaecer). | Trocar `$darkBlue600/700` por `#2752B7`/`#1F4292`; dar borda e estado pressionado ao outline; `accessibilityState` |
| `ButtonIconLeft`, `ButtonIconRight` | `@components/Buttons/...` | Botão com ícone lucide antes ou depois do rótulo. | Nome acessível quando o rótulo não descreve a ação |
| `ButtonIconImageLeft` | `@components/Buttons/ButtonIconImageLeft` | Botão com imagem à esquerda (login Google). | Ícone do Google pequeno ou ausente na web |
| `ButtonSelect` | `@components/Buttons/ButtonSelect` | Opção selecionável em grupo. | Estado selecionado com `$brand`/`$brandTint` e `accessibilityState.selected` |
| `IconButton` | `@components/Buttons/IconButton` | Botão só com ícone. | Obrigatório `accessibilityLabel` e alvo de 44–48 |

## Cartões e badges

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `ItineraryCard` | `@components/Cards/ItineraryCard` | Cartão de roteiro na lista de itinerários (Planejados, Rascunhos, Passados). Elevação 1, raio 20. | — |
| `NotificationCard` | `@components/Cards/NotificationCard` | Item da tela Notificações. | — |
| `CategoryBadges` | `@components/Badges/CategoryBadges` | Categoria de atividade. Fundo `$brand`, texto branco, raio 20, sem sombra. | Trocar `$blue800`; remover sombra |
| `HighRatingBadge` | `@components/Badges/HighRatingBadge` | "Boa Nota", sempre com a nota numérica. Fundo `$goldTint`, texto `$textPrimary`. | Hoje branco sobre `$yellow400` (1,53:1) |
| `OpenStatusBadge` | `@components/Badges/OpenStatusBadge` | Prop `openStatus`. "Fechado": `$errorTint` + `$errorStrong`; "Aberto": neutro até decidir a cor de sucesso. | Trocar `$red600`/`$green600` |

## Chat

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `AiBalloon` | `@components/Chat/AiBalloon` | Resposta do Felipe. Fundo `$brandTint`, texto `$textPrimary`, horário `$xs`. | Trocar `$blue100`/`#DBEAFE`; avatar do mascote local em vez de URL do Flaticon |
| `UserBalloon` | `@components/Chat/UserBalloon` | Mensagem do usuário. Fundo `$goldTint`. | Nome e foto do usuário real (hoje "Usuário" e foto de banco de imagens) |

## Diálogos e modais

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `ChooseDialog` | `@components/Dialogs/ChooseDialog` | Confirmação com duas ações. Destrutivo: fundo `$errorStrong` ao lado de "Cancelar" em outline. | Trocar `$red500` no botão |
| `ChooseBackgroundDialog` | `@components/Dialogs/ChooseBackgroundDialog` | Escolha de imagem de fundo do perfil. | — |
| `ItineraryActionsDialog` | `@components/Dialogs/ItineraryActionsDialog` | Ações sobre um roteiro (editar, excluir, anúncio recompensado). | Trocar `#3B82F6`/`#DC2626` |
| `SaveItineraryDialog` | `@components/Dialogs/SaveItineraryDialog` | Salvar roteiro gerado. | — |
| `AddExpenseModal`, `ExpenseAddedModal` | `@components/Modals/...` | Registro de gasto e confirmação; valores em R$. | — |

## Erros e carregamento

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `AlertToast` / `useToastContext` | `@components/Errors/AlertToast` | Toast de erro (`handleToast(message)`), topo, 3 s. Complementa, nunca substitui a mensagem na tela. | Textos "Error!"/"Retry" para pt-BR; trocar `#FF0000`/`$red500` |
| `ConnectionErrorAlerter` | `@components/Errors/ConnectionErrorAlerter` | Aviso de sem conexão. | — |
| `LocalFetchError`, `ItinerariesError`, `PastItinerariesError`, `NotificationError` | `@components/Errors/...` | Estados de erro ou vazio por domínio (export de `NotificationsError.tsx` é `NotificationError`). | Ação de recuperação textual quando aplicável |
| `Loading` | `@components/Loading/Loading` | Carregamento em tela. | — |
| `SplashLoading` | `@components/Loading/SplashLoading` | Tela de abertura com mensagem de progresso. | Trocar `Poppins_400Regular` pela fonte aprovada e o fundo `#1E40AF` por `#2752B7` |

## Home, mapas e destinos

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `HomeDestinations` | `@components/Home/Destinations` | Cartões de lugares próximos (foto via `googlePhotoProxy`). | Estado de erro honesto em vez da lista fixa |
| `GlobalDestinations` | `@components/Home/GlobalDestinations` | Destinos recomendados (dados ilustrativos de `src/data/`). | Não exibir notas fixas como reais |
| `UserInfo` | `@components/Home/UserInfo` | Nome e foto do usuário na Home. | Usar `displayName` do Firebase para login por e-mail |
| `Maps` | `@components/Maps/Maps` | Mapa com lugares próximos. | Mover o `fetch` para um serviço |
| `RecenterButton` | `@components/Maps/RecenterButton` | Recentralizar o mapa (só ícone). | `accessibilityLabel` |
| `DestinationStories` | `@components/Stories/DestinationStories` | Stories de destino. | — |
| `CarouselImages` | `@components/CarouselImages` | Carrossel de imagens. | — |

## Roteiro

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `ChooseGenerateStyle` | `@components/Itinerary/ChooseGenerateStyle` | Escolha Planejado, Surpresa ou Roteiros Prontos. | "Roteiros Prontos" sem ação |
| `ItineraryCategoriesDefine` | `@components/Itinerary/ItineraryCategoriesDefine` | Categorias do roteiro. | — |
| `ItineraryCreateDialog` | `@components/Itinerary/ItineraryCreateDialog` | Etapa 1 do roteiro (título, datas, origem, continente, países). | Emojis como ícone |
| `ItineraryPreferencesModal` | `@components/Itinerary/ItineraryPreferencesModal` | Preferências do roteiro Surpresa. | Emojis como ícone |
| `ItinerarySliderDateShow` | `@components/Itinerary/ItinerarySliderDateShow` | Seletor de dias do roteiro. | — |
| `UnlockProgressModal` | `@components/Itinerary/UnlockProgressModal` | Progresso de 3 anúncios para criar roteiro. | Singular/plural ("Falta 1 anúncio") |
| `VisaModel` | `@components/Itinerary/VisaModel` | Resultado da verificação de visto. | Estado "informação indisponível" |
| `SlideUpItinerary` | `@components/Sliders/SlideUpItinerary` | Painel do roteiro sobre o mapa. | Trocar `#FF0000` |
| `SlideUp` | `@components/Sliders/SlideUpPlaces` | Painel de lugares sobre o mapa. | — |

## Navegação, formulários e outros

| Componente | Import | Uso e estados | Ajuste pendente |
| --- | --- | --- | --- |
| `NavigationBar` / `NavbarContext` | `@components/NavigationBar` | Barra flutuante com 5 itens; ativo com fundo `$brand` (§6). | `accessibilityRole="tab"`, `selected`, `hitSlop`; item "Gaming" sem tela |
| `TitleAndBack` | `@components/TitleBack` | Cabeçalho com voltar (`pageTitle`). | `accessibilityLabel` no voltar |
| `CurrentStatusBar` | `@components/CurrentStatusBar` | Barra de status do app. | Trocar `$red500` |
| `Input` | `@components/InputItems/Input` | Campo de texto (props do `InputField`). Estados de §7.2: padrão, foco `$brand`, erro `$error` + mensagem `$errorStrong`. | Placeholder com contraste 2,0:1 |
| `CharacterLimiter` | `@components/InputItems/CharacterLimiter` | Contador de caracteres (chat, 0/200). | Informar o mínimo de 10 caracteres do chat |
| `UserPreferencesTags` | `@components/Register/Tags` | Tópicos de interesse do usuário (dados de `src/data/tags.json`). | Emojis como ícone vindos de `tags.json`; fotos repetidas |
| `SettingsOption` | `@components/Settings/SettingsOption` | Linha de configuração do Perfil. | Itens sem ação (Cotação, Modo de Exibição, Modo Offline, Privacidade, Informações) |
| `PersonalInfoProfile`, `PersonalInfoPreferences`, `PersonalInfoSettings` | `@components/Profile/...` | Blocos do Perfil. | Dados fixos exibidos como reais |
| `GoPremium` | `@components/GoPremium` | Chamada para o Premium. | — |
| `SimulatedAd` | `@components/SimulatedAd` | Anúncio simulado (desenvolvimento). | Emoji como ícone; não usar em produção |
| `AnimatedStar` | `@components/AnimatedStar` | Estrela animada de avaliação. | Respeitar movimento reduzido |

Não invente comandos de instalação nem pastas de componentes. Para adicionar uma biblioteca, siga a regra de aprovação de dependências do `CLAUDE.md`.
