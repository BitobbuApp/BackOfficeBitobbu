# Task 7: Plans and Subscriptions Management

**Objective:** Empower the internal team to manually govern paid memberships, extensions, and courtesy upgrades.

## Instructions for the Agent:
1. Either create a sub-view within Users or a dedicated `/subscriptions` option on the Sidebar.
2. Render a Data Table displaying registered companies grouped by their active or expired subscription plan.
3. Introduce a "Manage Plan" action per row that spawns a detailed interactive Modal (`Dialog`).
4. The management Modal should visualize:
   - Current Plan Tier.
   - Plan Activation Date.
   - Upcoming Expiration Date.
5. Provide a dropdown/form combo to manually override their tier by throwing a POST/PATCH request against the user/subscriptions API matching the new plan ID.
6. Include a separate Numeric Input to apply "Manual Day Extensions," letting the admin inject bonus expiration days (ideal for service compensations, loyalty deals, etc.).

## Acceptance Criteria:
- A clear, unambiguous confirmation notification (Toast) is rendered as soon as a tier adjustment hits the backend successfully.
- Trigger secondary confirmation pop-ups before dispatching destructive or major state mutations to prevent accidental stray clicks.
