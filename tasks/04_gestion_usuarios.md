# Task 4: User Management (CRUD)

**Objective:** Provide administration visibility and control over all registered platform accounts.

## Instructions for the Agent:
1. Create the `/usuarios` (or `/users`) view and link it in the Sidebar.
2. Build a paginated Data Table (`DataTable`) consuming `GET /users` (or the corresponding administrative endpoint for companies).
3. Mandatory columns: Company Name / Trade Name, Email, Profile Type (Buyer, Supplier, Both), Registration Date, Status (Active, Suspended).
4. Add interactive filters to the table: A Select dropdown for Account Type, and a Search input to query by name or email (implementing a **debounce**).
5. Add a context action menu (`DropdownMenu`) to each row:
   - **View Full Profile:** Opens a Side sheet, Dialog, or navigates to `/users/:id` showing exhaustive company details (Contacts, Locations, Payment Preferences).
   - **Suspend / Reactivate Account:** Opens an `AlertDialog` for confirmation. Upon acceptance, fires a PATCH/PUT to the backend updating the user's status.
   
## Acceptance Criteria:
- The admin can quickly search and locate any specific user.
- The admin can view every piece of registered profile information.
- Toggling the account status triggers a successful Toast notification and refreshes the dataset.
