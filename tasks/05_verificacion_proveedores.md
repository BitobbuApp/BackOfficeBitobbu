# Task 5: Supplier Verification

**Objective:** Implement the manual review queue that grants the "Verified Bitobbu" badge to reliable suppliers.

## Instructions for the Agent:
1. Build the `/verifications` view and append it to the Sidebar (optionally display a UI Badge with the pending count next to the link text).
2. Create a list, grid, or table exclusively aimed at fetching suppliers where `status="Pending"`.
3. Upon clicking review on a specific entry, display their full verification dossier:
   - Legal Information (Tax ID / RIF, Company Name).
   - Legal representative mapping and primary contacts.
   - A download link or PDF previewer to examine the document uploaded by the supplier (certification or registration photos).
4. Provide two distinct primary action buttons: **Approve** and **Reject**.
5. If the admin clicks **Reject**, it **MUST trigger a mandatory text form** (textarea dialog) requesting the exact rejection reason. This feedback will be submitted to the backend so the user knows what to correct.
6. If the admin clicks **Approve**, trigger a confirmation prompt and then fire a `PATCH /companies/:id/verify` (or equivalent backend method).

## Acceptance Criteria:
- Suppliers currently sitting in the verification queue are clearly exposed.
- Rejection cannot proceed if the reason field is empty (required validation).
- Once approved or rejected, the record immediately clears out of the pending queue.
