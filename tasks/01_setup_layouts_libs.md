# Task 1: Migration of Layouts, General Hooks, and Libs

**Objective:** Set up the foundational frontend baseline for the BackOffice using the existing React + Vite configuration with TailwindCSS and Shadcn-ui.

## Instructions for the Agent:
1. Ensure the project runs locally using `npm run dev` with no console errors.
2. Copy/Adapt the general hooks from the FrontEndApp (e.g., formatting utilities, Axios auth interceptors, debounce hooks).
3. Migrate the base UI components (from `components/ui/` or similar) that will be used in the superadmin panel. Specifically:
   - Buttons (`Button`)
   - Tables (`Table`, `TableHead`, `TableRow`, etc.)
   - Badges (`Badge`, `StatusBadge`)
   - Forms (`Input`, `Select`, `Label`, `Textarea`)
   - Modals (`Dialog`, `AlertDialog`)
   - Toasters (`sonner` or `react-hot-toast`)
4. Create the `MainLayout` and the `Sidebar` for the Superadmin. The Sidebar must have the following navigation links ready (even if the target pages don't exist yet):
   - Dashboard
   - Users
   - Verifications
   - Chat
   - Subscriptions
5. Configure the router (`react-router-dom`) in `src/App.jsx`, enabling nested routes grouped under the `MainLayout`.
6. If a library is missing in `package.json`, use `npm install <package>` before implementing the code.

## Acceptance Criteria:
- The app starts normally.
- The base navigation Sidebar exists containing a central `Outlet` to render pages.
- Tailwind and Radix UI components are correctly migrated and the Vite `@/components` alias resolves properly.
