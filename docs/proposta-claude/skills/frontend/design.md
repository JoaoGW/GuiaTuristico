---
platforms: [android, ios]
orientation: portrait
navigation: react-navigation-native-stack
ui-kit: gluestack-ui-v1
color-scheme: light
---

# EZ Trip AI Design Context

## Rule Hierarchy

1. **`docs/DesignIA_Regras.md` always wins.** If it conflicts with `docs/DESIGN.md`, with this file, or with the code, follow `DesignIA_Regras.md`.
2. `docs/DESIGN.md` (v2.0, 30/10/2026) is the full design reference; this file summarizes it and must say the same thing.
3. Current code. Where it differs from the migration tables in `docs/DESIGN.md` §3.4–3.5, the code is what must change.

The tokens below are the target. Color migration in code has not been done yet. The font change depends on approval to install `@expo-google-fonts/nunito-sans` (`CLAUDE.md` forbids adding dependencies without approval); do not describe it as implemented.

## Repository Status

`expo-app/` is an Expo SDK 57 application written in TypeScript with React Native 0.86 and React 19.2. Navigation uses React Navigation 7 native-stack (not Expo Router). `app.json` sets portrait orientation and light mode. Android and iOS are the targets; web via `react-native-web` is not validated.

The product is a travel guide with an AI assistant named Felipe: nearby attractions on a map, destination details, text and voice chat, AI itinerary generation with visa check and PDF export, favorites, expense control, notifications, profile, and Premium screens without payment integration. `AGENTS.md` holds the technical context.

Gluestack UI v1 uses the default `@gluestack-ui/config`. Its `fonts.heading`/`fonts.body` are `undefined`, so text currently renders in the system font; Poppins only appears in `SplashLoading`. Unstyled Gluestack components (default `Button`, checked `Checkbox`, `Input` focus) take the theme `$primary*` scale (`#0077E6`, `#005DB4`, `#004282`), which must be remapped to the brand blue.

## Current Application Structure

| Concern | Current location |
| --- | --- |
| Bootstrap, fonts, splash, providers | `expo-app/App.tsx` |
| Navigation stacks and param types | `src/routes/` (`index.tsx`, `auth.routes.tsx`, `noauth.routes.tsx`) |
| Screens | `src/screens/<Domain>/` (AIChat, Credentials, HomePage, Itinerary, Premium, Presentations, UserProfile) |
| Shared UI by domain | `src/components/<Domain>/` |
| Bottom navigation | `src/components/NavigationBar.tsx` |
| Contexts (auth, network, location) | `src/contexts/` |
| Images, illustrations, mascot | `src/assets/` |
| Illustrative data | `src/data/` |
| Token file (proposed, pending approval) | `src/theme/` (the `@theme` alias already points there; the folder does not exist) |

## Visual Foundations

One brand blue and one error red. Derived states keep the base hue and change only lightness. Until the token file exists, use the hex value.

| Token | Value | Use |
| --- | --- | --- |
| `$brand` | `#2752B7` | Primary button, active `NavigationBar` item, links, highlight icons, screen titles, splash |
| `$brandPressed` | `#1F4292` | Pressed/hover of anything in `$brand` |
| `$brandTint` | `#E9EDF8` | Selection and info backgrounds, Felipe chat balloon |
| `$error` | `#EF4444` | Error icon, field border, indicator. Not for small text |
| `$errorStrong` | `#D41212` | Error text; red surfaces with white text |
| `$errorTint` | `#FEF1F1` | Error background (same as Gluestack `$backgroundLightError`) |
| `$bgScreen` / `$surface` / `$bgAlt` | `#FDFDFD` / `#FFFFFF` / `#F8F8F8` | Screen, cards and fields, alternate background |
| `$surfaceMuted` | `#F3F4F6` | Neutral surface, inactive segments |
| `$border` / `$borderStrong` | `#E5E5E5` / `#D1D5DB` | Dividers / decorative card borders |
| `$textPrimary` / `$textSecondary` | `#1F2937` / `#6B7280` | Main text / secondary text, inactive icon, placeholder, field border |
| `$gold` / `$goldTint` | `#FFD700` / `#FEF3C7` | Rating star, Premium, highlight on `$brand` / Premium background, user chat balloon |

Contrast (WCAG 2.x): white on `$brand` 7.05:1; white on `$brandPressed` 9.32:1; `$brand` on `$brandTint` 6.02:1; `$textPrimary` on `$brandTint` 12.54:1; `$error` on white 3.76:1 (icons, borders and large text only); `$errorStrong` on white 5.39:1 and on `$errorTint` 4.90:1; `$textSecondary` passes only on `$surface`, `$bgScreen`, `$bgAlt` (4.55–4.83:1) and fails on `$surfaceMuted` and `$brandTint`; `$error` on `$brand` (1.87:1) is forbidden; `$gold` on white (1.40:1) always needs the numeric rating next to it.

Migration in short: `#336DF6`, `#3B82F6`, `#2563EB`, `#0A84FF`, `#1E40AF` (including the splash in `app.json` and the loading background in `App.tsx`), `$darkBlue600`, `$blue400`, `$blue800` → `$brand`; `$darkBlue700` → `$brandPressed`; `$blue100`, `#DBEAFE`, `#E0E7FF` → `$brandTint`; theme `primary0–100` → `$brandTint`, `primary200–500` → `$brand`, `primary600–950` → `$brandPressed`. `$red500`, `#FF0000`, `#DC2626`, `$red600`, `#FF3B30` → `$error` for icons and borders, `$errorStrong` for text and white-text fills. `$gray500`, `$gray600`, `$gray700`, `$yellow` do not exist in the default theme; migrate them to `$textSecondary`/`$gold`. Full tables: `docs/DESIGN.md` §3.4–3.5.

## Typography

| Family | Use |
| --- | --- |
| Nunito Sans 400/600/700 (`@expo-google-fonts/nunito-sans` 0.4.x) | All interface text via `fonts.heading` and `fonts.body`. Install pending approval |
| Libre Bodoni 700 | Only the "EZ TRIP AI" title in `Login`, `SignUp`, `ForgotPassword` |
| Poppins | Being removed (`DesignIA_Regras.md` §2 lists it as a generic-AI signal) |

| Role | Weight | Token | Size / line height |
| --- | --- | --- | --- |
| Brand title / highlight number | Bodoni 700 / 700 | `$4xl` | 36 / 48 |
| Screen title | 700 | `$3xl` | 30 / 40 |
| Dialog title | 700 | `$2xl` | 24 / 32 |
| Section title | 700 | `$xl` | 20 / 28 |
| Card title, subtitle | 600 | `$lg` | 18 / 24 |
| Body, chat messages | 400 | `$md` | 16 / 24 |
| Button, field and active nav label | 600 | `$md` | 16 / 22 |
| Secondary text | 400 | `$sm` | 14 / 20 |
| Metadata, badge | 400 / 600 | `$xs` | 12 / 18 |

Use weight tokens only (`$normal`, `$semibold`, `$bold`); literal weights such as `"bold"` or `"600"` are not resolved to a font file. `$medium` moves to `$semibold`; weight 500 is not loaded. Never use `$2xs` for text.

Planned application, after approval: load the three Nunito Sans weights and `LibreBodoni_700Bold` in `App.tsx`; extend the theme with `createConfig({ ...config, tokens: { ...config.tokens, fonts: { heading: 'NunitoSans', body: 'NunitoSans' } }, plugins: [...config.plugins, new FontResolver()] })` (both exported by `@gluestack-ui/themed`); replace the Poppins reference in `SplashLoading` and in `printExportItinerary.ts`.

## Shape, Spacing, Elevation

- Radius: `$lg` 8 badges, `$md` 6 checkbox indicator; `$xl` 12 buttons and fields; `$2xl` 16 active nav item, Home shortcuts, dialogs; 20 cards, `NavigationBar`, chat balloons; `$full` avatars and pills.
- Spacing: Gluestack scale in multiples of 4 (`$1`…`$10`); screen side margin `$4` (16), same as the `NavigationBar`.
- Elevation: 0 for badges and list items; 1 for cards (0×4, opacity 0.1, radius 8, elevation 4); 2 for floating elements (`NavigationBar`, toast: 0×6, opacity 0.1, radius 12, elevation 10). No shadowed cards inside cards.

## Component States

| Component | Rule |
| --- | --- |
| `Button` solid | `$brand`, white 600 label, radius `$xl`, min height 48; pressed `$brandPressed`; disabled opacity 0.4 + `accessibilityState.disabled`; loading shows a white spinner, is not pressable but not dimmed, sets `accessibilityState.busy`, keeps the label in `accessibilityLabel` |
| `Button` outline | Transparent, 1.5 border and label `$brand`; pressed `$brandTint` |
| Destructive button | `$errorStrong` fill, white label with the action verb; pressed opacity 0.85; always next to an outline "Cancelar" |
| `Input` | `$surface`, 1 border `$textSecondary`, placeholder `$textSecondary`; focus 2 border `$brand`; error 2 border `$error` plus `CircleAlert` and message in `$errorStrong` `$sm` |
| `Checkbox` | 24 indicator, radius `$md` (6), 2 border `$textSecondary`; checked `$brand` with white check (on a `$brand` background: white border, white fill, `$brand` check); whole row tappable, visible label, unique non-empty `value` |
| Badges | `CategoryBadges` `$brand` without shadow; `OpenStatusBadge` "Fechado" `$errorTint` + `$errorStrong`, "Aberto" neutral `$surfaceMuted` + `$textPrimary`; `HighRatingBadge` `$goldTint` + `$textPrimary` with the numeric rating |
| `NavigationBar` | Active item `$brand` pill with white icon and 600 label; inactive icons `$textSecondary`; each item `accessibilityRole="tab"`, label, `accessibilityState.selected`, `hitSlop` up to 48 |

## Interaction and Accessibility Baseline

- Design for narrow portrait phones first; respect safe areas and leave room for the floating `NavigationBar` on screens that show it.
- Screens draw their own header (`TitleBack` for back navigation); there is no native header.
- Every control has an accessible name and role, especially icon-only ones and checkboxes; the current code has none, so new work must not copy that gap. Touch targets ≥ 44 pt / 48 dp.
- Make pressed, disabled, loading, empty, error, offline, and permission-denied states understandable in text, not only color.
- Errors must be visible on screen with a recovery action; `Alert.alert` may complement but never be the only signal.
- AI answers appear in chat balloons; the voice chat shows the transcription and speaks the answer. Show a recoverable state when the AI is unavailable, over quota (429), times out, or returns unparseable output.

## Content, Icons, and Images

- All UI copy is 100% Brazilian Portuguese in Felipe's warm tone; no generic marketing words.
- Never present fictional data as real (counters, ratings, reviews, profiles, prices, weather, visas, "Online" status).
- Icons only from `lucide-react-native`; never emoji as icons; no pastel icon chips repeated on every card.
- Optimize image assets (no multi-MB PNGs; the 24–43 MB PNGs in `src/assets/` must be replaced); the Felipe mascot always has a transparent background, never a black box.

## Pending Decisions

Token file location and approval; installing Nunito Sans; success color (`$green600` is outside the palette); off-palette neutrals (`#374151`, `#9CA3AF`, `$orange600`, `$yellow400`/`$yellow500`); dark mode (disabled); the "Gaming" nav item without a screen; Premium without payment; web and keyboard focus not validated. Details in `docs/DESIGN.md` §13.

## Visual Acceptance Checklist

- Does the change follow `DesignIA_Regras.md` first, then `docs/DESIGN.md`?
- Does it use only the tokens above (one blue, one red, and their derived states) and existing components?
- Does text follow the type scale with weight tokens?
- Is the copy Brazilian Portuguese and free of fictional data presented as real?
- Are icons from `lucide-react-native`, with no emoji, and images optimized?
- Is the intended action clear without relying on color or an icon alone, with accessible names and adequate contrast?
- Are relevant loading, empty, error (visible on screen), offline, and permission states covered?
- Does it remain usable on a narrow portrait screen with the navigation bar?
