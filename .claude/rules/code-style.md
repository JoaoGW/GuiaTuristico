---
paths:
  - "expo-app/**/*.{ts,tsx}"
  - "nextjs-api/**/*.{ts,tsx}"
---

# TypeScript, React Native, and Next.js Rules

## TypeScript

- Preserve the established file structure, naming, exports, and import style of the package being edited.
- Prefer explicit types at system boundaries: component props, navigation params, API request and response bodies, AsyncStorage data, and external-service payloads.
- Prefer inference for obvious local values.
- Do not add new `any`, `@ts-ignore`, broad type assertions, or disabled lint rules to silence an error. Existing `any` in older files is not a license to add more.
- Keep functions and components focused on one responsibility. Do not create reusable abstractions for a single use case.

## Expo App (`expo-app/`)

- Screens: `src/screens/<Domain>/`. Shared components: `src/components/<Domain>/`. Hooks: `src/hooks/`. Contexts: `src/contexts/`. Network and storage: `src/services/` and `src/utils/`. Static data: `src/data/`. Domain types: `expo-app/@types/`.
- Navigation is React Navigation 7 native-stack (not Expo Router). Register new screens in `src/routes/auth.routes.tsx` or `noauth.routes.tsx`, add them to the param list type, and use `useNavigation<AuthNavigationProp>()`. Wrap a screen in `ScreenWrapper` only if it must show `NavigationBar`.
- Use the path aliases configured in `tsconfig.json` and `babel.config.js` (`@components`, `@screens`, `@services`, `@utils`, `@contexts`, `@hooks`, `@config`, `@data`, `@assets`, `@routes`). Types from `@types/` are imported by relative path.
- Build UI with `@gluestack-ui/themed` components and `lucide-react-native` icons, as the rest of the app does. Do not introduce another UI kit, styling system, or state library without approval; global state uses React Context or Zustand.
- Import `.svg` files as components (configured through `react-native-svg-transformer`).
- Native-only modules (AdMob, tracking transparency) must stay guarded for Expo Go, following `App.tsx` and `src/services/admob/adMobConfig.ts`.
- Environment values come from `process.env.EXPO_PUBLIC_*` or `@env` (`DEV_API_URL`); never inline a key.

## Next.js API (`nextjs-api/`)

- One default-exported handler per file in `pages/api/`, typed with `NextApiRequest` and `NextApiResponse`.
- Shared server helpers live in `nextjs-api/utils/`. The App Router in `app/` (next to `pages/`, as Next 16 requires) only serves the documentation page; keep API code out of it.
- Tailwind CSS 4 is used only for the documentation page.

## Comments

- Comment decisions, constraints, or non-obvious behavior only.
- Do not write comments that restate the code. Do not create TODO comments.
- Commented-out `// DEBUG:` logs already exist; do not add more and do not remove existing ones unless the change touches them.

## Visual System

- Follow `docs/DESIGN.md`. There is no project token file: reuse Gluestack tokens and the de facto palette (primary `#2752B7`, button `$darkBlue600`, text `#1F2937`, secondary `#6B7280`, background `#FDFDFD`).
- Reuse existing components in `src/components/` before adding a new visual primitive.
- The app is light-mode and portrait. Do not add dark-mode styling without a decision.
- User-facing copy is Brazilian Portuguese.

## Types

- Keep a type near its single consumer; move it to `expo-app/@types/` only after a second real use.
- Prefer descriptive type and interface names. Do not add artificial prefixes or suffixes.

## Accessibility

- The current code has no `accessibilityLabel` or `accessibilityRole`. Add them to new or modified interactive elements, especially icon-only buttons.
- Keep touch targets at least 44 × 44 pt and make loading, disabled, and error states clear in text.
