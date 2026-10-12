# Design Quality Rules for EZ Trip AI

Use these rules with `design.md` and the current source tree. They keep the travel-guide app coherent as screens are added or changed.

## Start From Evidence

- Inspect the actual route, components, theme, hooks, and platform override before designing a change.
- Preserve the React Navigation, Gluestack UI, and component patterns already present in `expo-app`.
- Treat `src/data/` content and remote stock images as illustrative, not approved product data.
- Do not borrow domain language, palettes, workflows, or interface structures from unrelated projects or templates.

## Keep the Interface Purposeful

- Give each screen one clear primary task and a visible hierarchy.
- Prefer a small number of well-labelled controls over decorative cards, badges, gradients, floating controls, glass effects, or generic dashboard tiles.
- Add a component only when it serves a concrete interaction or content need.
- Use the de facto palette and Gluestack tokens from `docs/DESIGN.md`. Extend them only when an approved feature requires it.
- Keep text concise, in Brazilian Portuguese, and consistent with the Felipe persona rather than generic marketing copy.

## Travel Data and AI Honesty

- Show destinations, prices, weather, opening status, ratings, and visa requirements only from the API or clearly illustrative data; never fabricate them as real.
- Make AI-generated content recognizable as coming from Felipe, and show recoverable states for offline, quota (429), timeout, and unparseable AI output.
- Make loading, empty, pending, and failed states explicit. Do not make an unfinished action (itinerary generation, voice processing) appear complete.
- Confirm destructive actions such as deleting itineraries, chats, or expenses, or cancelling Premium.

## States and Accessibility

- Cover normal, pressed, focus, disabled, loading, empty, error, and recovery states when the feature makes them relevant.
- Do not rely on color, motion, an icon, or gesture alone to communicate meaning.
- Use native controls where possible, accessible labels for icon-only actions, readable text contrast, and touch targets appropriate to mobile use.
- Keep a logical reading order for screen readers.
- Respect user motion preferences and avoid animation that obscures state or delays the main task.

## Cross-Platform Checks

- Prefer shared React Native code; guard native-only modules (AdMob, tracking transparency) for Expo Go as `App.tsx` does.
- Check safe areas, narrow portrait layouts, text scaling, overflow, and the floating `NavigationBar` for UI changes.
- Check both Android and iOS behavior when navigation, permissions, maps, or audio change.

## Review Questions

1. Is every visible element supported by the requested task or existing source?
2. Are the user-visible states honest and understandable?
3. Does the change reuse the existing tokens and components where appropriate?
4. Does the interface remain usable on a small portrait screen on Android and iOS?
5. Has the design avoided presenting invented travel data or AI output as fact?
