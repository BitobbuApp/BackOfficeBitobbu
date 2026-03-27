# Task 3: Metrics Dashboard

**Objective:** Implement the main landing view featuring 4 key performance indicators (KPIs) of the platform.

## Instructions for the Agent:
1. Create the `Dashboard.jsx` view.
2. At the top, display a greeting such as "Welcome back, [Name]".
3. Implement a responsive `grid` displaying 4 metric Cards (using Shadcn's layout) for the following:
   - Total registered users.
   - Quotation requests (RFQs) created in the last 7 days.
   - Quotations (responses) sent in the last 7 days.
   - Suppliers pending verification (in queue).
4. Given that the backend might lack a consolidated dashboard endpoint initially, you may need to use React Queries on individual endpoints (e.g., `oet /users`, `GET /requests`) parsing their pagination metadata to gather the totals as a temporary workaround.
5. Use distinct `lucide-react` icons for each metric card (e.g., `Users`, `FileText`, `Send`, `ShieldAlert`).

## Acceptance Criteria:
- The four KPIs are clearly visible and the cards respond well across screen sizes.
- Optional (if time allows or API data is readily structured): implement simple charts using `recharts` for weekly registration trends (not a strict MVP priority).
