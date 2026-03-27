# Task 2: Administrator Authentication

**Objective:** Implement the security layer and exclusive login portal for the superadmin internal team.

## Instructions for the Agent:
1. Build the `/login` page with a clean design (Logo, Email, Password).
2. Connect the login form to the authentication API (e.g., `/api/v1/auth/verify?role=admin` or similar based on backend constraints).
3. Implement an Authentication Context (`AuthContext.jsx`) that handles the JWT token (storing it in localStorage or cookies, following the FrontEndApp convention) and provides the active user's state.
4. Create a `ProtectedRoute` or `AuthGuard` component wrapping all `MainLayout` routes. If no token is detected, it must redirect to `/login`.
5. Display the active Administrator's name and email in the Header or at the bottom of the Sidebar.
6. Implement the Logout functionality (clear the token and redirect to login).

## Acceptance Criteria:
- It is impossible to access the panel if the session is inactive.
- A failed login attempt displays an appropriate error Toast notification.
- The session persists and reloads correctly when refreshing the page.
