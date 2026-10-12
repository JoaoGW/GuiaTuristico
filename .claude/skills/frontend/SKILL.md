---
name: frontend
description: Design, implement, review, or fix EZ Trip AI screens, components, navigation, visual states, and user flows in the Expo app using the local application patterns.
when_to_use: Use for requests involving UI, frontend bugs, screens, components, forms, navigation, accessibility, visual polish, or user flows in expo-app.
argument-hint: "[feature, screen, component, or UI issue]"
---

# Frontend Implementation Skill

Use this skill for `$ARGUMENTS`.

## Mandatory Context

Before making a frontend decision, read `${CLAUDE_SKILL_DIR}/design.md` and `${CLAUDE_SKILL_DIR}/ai-design-rules.md` completely. Read `docs/DESIGN.md` for the palette, components, and accessibility baseline. Then inspect the affected screen in `expo-app/src/screens/`, its components in `expo-app/src/components/`, related hooks, contexts, services, and its route in `expo-app/src/routes/`.

`design.md` records only decisions supported by this repository. It does not authorize inventing destinations, prices, weather, visa rules, AI answers, or a new visual system.

## Discovery Before Implementation

1. Locate the screen and its stack (`auth.routes.tsx` or `noauth.routes.tsx`), its navigation params, and whether it shows `NavigationBar`.
2. Reuse existing components (`Button`, `TitleBack`, `Loading`, `AlertToast`, `ConnectionErrorAlerter`, `*Error` components, dialogs, badges, chat balloons) and the de facto palette before creating anything new.
3. Identify required user-visible states: default, pressed, disabled, loading, empty, error, offline, AI quota or timeout, and permission denied (location, microphone, contacts) — only when they apply.
4. Keep the work scoped to the requested UI behavior. Do not change API contracts, LLM prompts, persistence keys, or authentication without explicit approval.

## Implementation Rules

- Build with `@gluestack-ui/themed` components and props (`bg`, `px`, `$md`…) and `lucide-react-native` icons, as the rest of the app does.
- Navigation uses React Navigation native-stack with `headerShown: false`; register new screens and param types in the route file and navigate with `useNavigation<AuthNavigationProp>()`.
- Call the API only through existing services or `API_URL` from `src/config.ts`.
- Write user-facing copy in Brazilian Portuguese, consistent with the Felipe persona.
- Add `accessibilityLabel` and `accessibilityRole` to new or modified interactive elements; keep touch targets at least 44 × 44 pt.
- Do not create fictional data presented as real. Illustrative content belongs in `src/data/` and must look plausible.
- Avoid decorative dashboards, metrics, or effects that do not support the user's task.
- Do not introduce libraries, generated UI kits, NativeWind, Expo Router, or a second styling system without approval.

## Validation and Completion

- Run `cd expo-app && npm run lint` and `npx tsc --noEmit`, and compare with the known baseline in `AGENTS.md` (both clean: any error or warning is new).
- Run `npm run android` or `npm run ios` only when a suitable local target is available.
- Report the design requirements applied, reused components, covered states, validation results, unverified platforms, and any product decision still needed.
