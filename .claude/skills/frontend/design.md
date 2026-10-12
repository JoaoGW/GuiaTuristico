---
platforms: [android, ios]
orientation: portrait
navigation: react-navigation-native-stack
ui-kit: gluestack-ui-v1
color-scheme: light
---

# EZ Trip AI Design Context

## Repository Status

`expo-app/` is an Expo SDK 57 application written in TypeScript with React Native 0.86 and React 19.2. Navigation uses React Navigation 7 native-stack (not Expo Router). `app.json` sets portrait orientation and light mode. Android and iOS are the targets; web via `react-native-web` is not validated.

The product is a travel guide with an AI assistant named Felipe: nearby attractions on a map, destination details, text and voice chat, AI itinerary generation with visa check and PDF export, favorites, expense control, notifications, profile, and Premium screens without payment integration. `docs/DESIGN.md` is the full design reference; `AGENTS.md` holds the technical context.

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

## Existing Visual Foundations

There is no project token file. Use Gluestack tokens and the de facto palette.

| Group | Values |
| --- | --- |
| Primary | `#2752B7`; button `$darkBlue600` (pressed `$darkBlue700`); splash `#1E40AF` |
| Backgrounds | `#FDFDFD`, `#FFFFFF`, `#F8F8F8`; neutral surfaces `#F3F4F6`, `#E5E5E5` |
| Text | `#1F2937`; secondary `#6B7280` / `$gray600` |
| Accents | gold `#FFD700` (ratings, Premium); error `#EF4444` / `$red500` |
| Fonts | Poppins 300/400/500 (global); Libre Bodoni 700 only for Login/SignUp titles |
| Type scale | Gluestack `$xs`…`$4xl`, weights `$medium`, `$semibold`, `$bold` |
| Radius | 20 (most common), 12–16 for cards, `$xl` buttons, `$full` for avatars and pills |
| Icons | `lucide-react-native` |

Do not introduce a new primary color, font, or spacing scale. Propose a token file only if the request requires one.

## Interaction and Accessibility Baseline

- Design for narrow portrait phones first; respect safe areas and leave room for the floating `NavigationBar` on screens that show it.
- Screens draw their own header (`TitleBack` for back navigation); there is no native header.
- Keep primary actions reachable and make pressed, disabled, loading, empty, error, offline, and permission-denied states understandable in text, not only color.
- Provide accessible labels and roles for controls, especially icon-only ones; the current code has none, so new work should not copy that gap.
- AI answers appear in chat balloons; the voice chat shows the transcription and speaks the answer. Show a recoverable state when the AI is unavailable or over quota.

## Visual Acceptance Checklist

- Does the change reuse existing components and the palette above?
- Is the copy Brazilian Portuguese and free of fictional data presented as real?
- Is the intended action clear without relying on color or an icon alone?
- Are relevant loading, empty, error, offline, and permission states covered?
- Does it remain usable on a narrow portrait screen with the navigation bar?
