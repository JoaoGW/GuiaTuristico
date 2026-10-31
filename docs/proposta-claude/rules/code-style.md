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
- API code is organized by Bounded Context in `nextjs-api/src/contexts/<context>/{domain,application,infrastructure}` with shared helpers in `nextjs-api/src/shared/` (imported via `@/`); `nextjs-api/utils/` keeps only `responseCache.ts`. The App Router in `app/` (next to `pages/`, as Next 16 requires) only serves the documentation page; keep API code out of it.
- Tailwind CSS 4 is used only for the documentation page.

## Comments

- Comment decisions, constraints, or non-obvious behavior only.
- Do not write comments that restate the code. Do not create TODO comments.
- Commented-out `// DEBUG:` logs already exist; do not add more and do not remove existing ones unless the change touches them.

## Visual System

- `docs/DesignIA_Regras.md` is always the superior design rule; then follow `docs/DESIGN.md` (v2.0) and its visual reference `docs/EZTripAI_Design_System.pdf`.
- Use a single brand blue, `#2752B7`, with its derived states only (`#1F4292` pressed, `#E9EDF8` tint); do not add `#336DF6`, `#3B82F6`, `#2563EB`, `#0A84FF`, `#1E40AF` or `$darkBlue*`/`$blue*` in new code, and migrate them when touching a file. Error red is `#EF4444` (text: `#D41212`). There is no token file yet: use the hex values from `docs/DESIGN.md` §3.1.
- Typography target is Nunito Sans (Libre Bodoni 700 only for the brand title); its installation is pending approval, so do not add Poppins in new code and use weight tokens (`$normal`, `$semibold`, `$bold`), not literal weights.
- Icons only from `lucide-react-native`; never emoji as icons.
- Reuse existing components in `src/components/` before adding a new visual primitive.
- The app is light-mode and portrait. Do not add dark-mode styling without a decision.
- User-facing copy is Brazilian Portuguese.

## Types

- Keep a type near its single consumer; move it to `expo-app/@types/` only after a second real use.
- Prefer descriptive type and interface names. Do not add artificial prefixes or suffixes.

## Accessibility

- The current code has no `accessibilityLabel` or `accessibilityRole`. Add them to new or modified interactive elements, especially icon-only buttons.
- Keep touch targets at least 44 × 44 pt and make loading, disabled, and error states clear in text.
