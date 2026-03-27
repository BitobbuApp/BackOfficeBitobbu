# Bitobbu BackOffice (Superadmin Dashboard)

## 🎯 Project Objective

The **Bitobbu BackOffice** is the centralized administrative command center for the Bitobbu B2B platform. 

Its primary objective is to empower the internal operations team with a streamlined, secure, and robust interface to govern the marketplace. The BackOffice provides complete visibility and control over user accounts, supplier verifications, transaction tracking, and real-time read-only chat monitoring between buyers and suppliers. 

By separating the administrative tools from the main customer-facing frontend, this application ensures strict security boundaries, isolated performance, and focused workflows for the platform administrators.

## 🛠️ Technology Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router DOM (v6)
- **Styling:** TailwindCSS + Radix UI (Shadcn-ui)
- **Data Fetching:** Axios + TanStack React Query
- **Real-Time Data:** Socket.io-client
- **Icons:** Lucide React

## 🚀 Key Features (Phase 1)
- **KPI Dashboard**: High-level operational metrics (User count, active RFQs, pending verifications).
- **User Management**: Search, filter, inspect, suspend, and reactivate accounts.
- **Supplier Verification Queue**: Dedicated workflow to approve or safely reject supplier certifications.
- **Transaction Chat Monitoring**: Real-time, read-only WebSocket listener to oversee B2B negotiations.
- **Subscription Management**: Tools to view, modify, and manually extend user membership tiers.

## 📂 Cloud Agent Documentation
The functional requirements for autonomous development are broken down into specific markdown files located in the `/tasks` directory.

---
*Bitobbu Internal Team © 2026*
