# BackOffice Anti-Patterns

Avoid these mistakes.

## 1. Security and Auth
- Do not call customer-facing privileged endpoints when admin endpoints exist.
- Do not keep protected routes accessible without `AuthGuard`.
- Do not keep session state only in volatile component state.
- Do not ignore 401 handling in Axios interceptors.
- Do not log secrets/tokens in console.

## 2. Data Layer
- Do not create multiple axios instances for feature modules.
- Do not fetch with `useEffect + useState` when React Query should be used.
- Do not forget query invalidation after mutations.
- Do not omit `enabled` for dependent queries.
- Do not use incomplete query keys.

## 3. Component Boundaries
- Do not call API/services directly from presentational components.
- Do not place heavy business logic in page components.
- Do not couple components to global auth when props are enough.

## 4. UX and Safety
- Do not use `window.alert`/`window.confirm` for critical actions.
- Do not allow rejection flows without required reason fields.
- Do not execute destructive mutations without explicit confirmation.
- Do not hide errors silently; show user-safe feedback.

## 5. Routing and Navigation
- Do not scatter route definitions across files.
- Do not use plain `<a href>` for internal navigation.
- Do not expose non-MVP routes in Phase 1 (no real-time chat module).

## 6. Styling
- Do not hardcode random colors for semantic UI surfaces.
- Do not ship layouts that break at mobile widths.
- Do not rely on desktop-only table layouts without mobile fallback.
