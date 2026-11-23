# BackOffice New Feature Guide

Follow this checklist for every new feature module.

## 1. Create Feature Skeleton

```txt
src/features/<featureName>/
  <FeatureName>Page.jsx
  components/
  hooks/
    use<FeatureName>Data.js
  services/
    <featureName>Api.js
```

Naming:
- Folder: `camelCase` (`subscriptions`).
- Page: `PascalCase` + `Page` (`SubscriptionsPage.jsx`).
- Hook: `use` + `PascalCase` (`useSubscriptionsData.js`).
- Service: `camelCase` + `Api` (`subscriptionsApi.js`).

## 2. Create Service Layer
- Import only from `@/api/axiosClient`.
- One function per endpoint.
- Keep services pure (no hooks/state/UI).
- Include short endpoint comments per function.

Example:

```js
import apiClient from '@/api/axiosClient';

export const usersApi = {
  // GET /admin/users
  async getUsers(params) {
    return await apiClient.get('/admin/users', { params });
  },
  // PATCH /admin/users/:id/status
  async updateUserStatus(id, payload) {
    return await apiClient.patch(`/admin/users/${id}/status`, payload);
  },
};
```

## 3. Create Feature Hook
- Use `useQuery`/`useMutation` in hooks only.
- Keep query keys complete and stable.
- Use debounce for search inputs before query execution.
- Invalidate relevant queries on mutation success.
- Return a clean data+handlers API to the page.

## 4. Create Page
- Page orchestrates layout and local UI state only.
- No direct API calls or React Query calls inside page.
- Pass data/handlers to presentational components.

## 5. Register Route
- Add route import and key in `src/pages.config.js`.
- Protect route with `AuthGuard` unless it is `/login`.

## 6. Sidebar Entry
- Add feature link in `MainLayout/Sidebar`.
- Keep labels consistent:
  - Dashboard
  - Users
  - Verifications
  - Subscriptions
- Do not add Chat in Phase 1 MVP.

## 7. Security Checklist (Mandatory)
- Endpoint path uses admin namespace.
- Mutation actions have confirmation dialog when high impact.
- Rejection flows require mandatory reason fields when specified by task.
- Never render raw backend stack traces to users.

## 8. UI Checklist
- Loading state.
- Empty state.
- Error state.
- Success/Error toasts.
- Responsive table/list behavior.

## 9. Testing Checklist
- Session restore after refresh.
- Unauthorized access redirects to `/login`.
- Filters/search/pagination sync with query params or local state.
- Build passes.
