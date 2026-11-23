# Bitobbu BackOffice - Architecture and Core Rules

Before writing code in this project, every contributor must follow these rules.

## 1. Scope and Product Boundary
- This app is for internal Bitobbu administrators only.
- This app must not reuse customer-facing auth/session flows directly.
- Phase 1 MVP includes tasks `01`, `02`, `03`, `04`, `05`, and `07`.
- Task `06_chat_tiempo_real.md` is explicitly out of scope for Phase 1.

## 2. Tech Stack and Baseline
- React 18 + Vite.
- React Router DOM v6 with centralized route registry.
- Tailwind + Shadcn UI primitives.
- TanStack React Query for server state.
- Axios singleton for HTTP.
- Sonner for toasts.
- Zod + React Hook Form for validation.

## 3. Feature-Domain Structure (Mandatory)
Use feature-first organization:

```txt
src/
  api/
    axiosClient.js
  app/
    providers/
    router/
  features/
    auth/
      AuthContext.jsx
      LoginPage.jsx
      components/
      hooks/
      services/
    dashboard/
    users/
    verifications/
    subscriptions/
  components/
    ui/
    atoms/
  layouts/
    MainLayout/
  lib/
  hooks/
  utils/
  pages.config.js
```

Rules:
- Pages orchestrate only. No direct axios calls in page components.
- Hooks own query/mutation orchestration.
- Services are API wrappers only.
- Presentational components receive data via props.

## 4. Security Rules (Admin-Only Platform)
- All protected routes require a valid admin session.
- Every request to protected endpoints must send the JWT token.
- Token storage strategy must be consistent and documented. If localStorage is used in MVP, enforce strict logout and 401 handling.
- Never expose sensitive backend error payloads directly in UI.
- Use least-privilege frontend behavior: hide unauthorized actions by role/scope.
- Do not trust client validation alone. Always assume backend is the source of authorization truth.

## 5. BackendApp Contract Assumptions
- BackendApp will provide admin-specific endpoints guarded by a new admin middleware.
- BackendApp will own admin persistence (`admins` table) and credentials lifecycle.
- Frontend must consume only admin endpoints, never customer endpoints for privileged actions when an admin variant exists.

## 6. Routing Rules
- Centralize route config in `src/pages.config.js`.
- Public routes: `/login` only.
- Protected routes: all dashboard and management modules under `MainLayout`.
- Use route guards (`AuthGuard`) for every protected route.

## 7. State and Data Rules
- All remote data uses TanStack Query.
- Query keys must include all variables (page, filters, search, admin id/scope when applicable).
- Mutations must invalidate affected queries.
- Add `enabled` for dependent queries.

## 8. UI/UX Rules
- Mobile-first styling.
- Use semantic design tokens for surfaces/text where possible.
- Use `AlertDialog` for destructive confirmations.
- Use `Dialog`/`Sheet` for detail views.
- Keep interactions deterministic: pending state, success feedback, error feedback.

## 9. Logging and Error Handling
- Avoid logging tokens, passwords, or sensitive payloads.
- Normalize errors in API layer and map to user-friendly messages in UI.
- Redirect to `/login` on 401 from protected endpoints.

## 10. Definition of Done (Per Feature)
- Feature follows folder architecture.
- Service + hook + page separation is respected.
- Protected route behavior verified.
- Loading/error/empty states implemented.
- Toast feedback for success and failure implemented.
- Build passes (`npm run build`).
