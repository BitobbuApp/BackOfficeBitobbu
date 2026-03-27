# Task 6: Real-Time Chat

**Objective:** Build a read-only viewer to monitor conversations and ongoing RFQ negotiations between buyers and suppliers using WebSockets (Socket.io).

## Instructions for the Agent:
1. Create the `/chat` route linked through the Sidebar.
2. Rely on the previously generated `frontend_socket_docs.md` to establish the connection logic by passing the superadministrator JWT auth token.
3. Design a Split-Pane Layout for the panel layout:
   - **Left Pane:** A list representing all active transactions/conversations (`GET /api/v1/conversations`). Adjust the API call slightly if the backend requires admin parameters.
   - **Right Pane:** The specific message thread history, retrieved from `GET /api/v1/messages/:conversationId`.
4. Ensure the Socket object listens globally for real-time events to push unread indicators or inject messages dynamically into the UI.
5. Re-use existing chat bubble components (sent vs received styling) but hardwire them into a **READ-ONLY MODE** for the internal admin. The administrator cannot send messages or interfere with the chat strings.
6. Render message attachments gracefully (`file_url`), presenting them as download links or embedded media buttons.

## Acceptance Criteria:
- The Administrator can easily switch between transaction chat rooms.
- The chat window completely omits any text input mechanisms (enforcing pure Read-Only mode).
- New incoming messages surface on the UI seamlessly without requiring a hard refresh.
