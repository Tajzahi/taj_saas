# Taj SaaS - Enterprise Multi-Tenant F&B SaaS Platform

Taj SaaS is a modern, enterprise-ready multi-tenant SaaS application designed for Food & Beverage (F&B) businesses. The platform manages ordering, cashiers, stock, production, and high-level management across multiple brands and branches.

---

## 🏗️ Architecture & Stack

The codebase is structured as a monorepo containing three core Next.js applications and shared workspace packages:

### Tech Stack
1. **Frontend / Routing:** Next.js (App Router)
2. **Database:** Neon Serverless Postgres
3. **ORM:** Drizzle ORM
4. **Authentication:** Better Auth (supporting subdomain session sharing)
5. **Real-time Notifications:** Ably (tenant-isolated pub/sub channels)
6. **AI Features:** Google Gemini AI (integrated into Customer chatbot and Owner dashboard)
7. **Monorepo Manager:** Turborepo + pnpm Workspaces

---

## 📁 Repository Structure

```text
taj_saas/
├── apps/
│   ├── customer/        # Customer Web App (ordering, payment upload, menu tracking)
│   ├── admin/           # Admin Cashier Dashboard (real-time orders, shift/cashier logs, updates)
│   └── owner/           # Owner Executive Cockpit (11 dashboard pages ported from Vite)
├── packages/
│   ├── db/              # Database Schema definitions, migrations, and Drizzle clients
│   └── shared/          # Shared types, tenant context, and middleware helpers
├── docs/                # Blueprint documentation and design specs
├── SETUP.md             # Developer setup, database seeding, and execution guide
├── package.json         # Workspace configuration
└── pnpm-workspace.yaml  # Workspace pnpm configurations
```

---

## 🔒 Key Design Patterns

### 1. Zero-Supabase Architecture
All data storage, queries, and RLS mechanisms have been migrated fully to Neon Serverless Postgres + Drizzle ORM. Better Auth acts as the single auth provider, fully decoupling the codebase from Supabase services.

### 2. Tenant Isolation
Middleware automatically resolves hostnames to inject tenant contexts via HTTP headers (`x-tenant-id`, `x-tenant-slug`). Drizzle ORM queries explicitly scope transactions using `tenantId` indexes to prevent cross-tenant data leaks.

### 3. Faithfully Ported Owner UI
The Owner app has been ported page-by-page from the legacy Vite template to Next.js App Router Server and Client components, preserving premium aesthetics, responsive layouts, Recharts visualizations, and interactive F&B settings.

### 4. Real-time Pub/Sub
Order dispatching and state updates are sent via tenant-scoped Ably channels (e.g. `[slug]:orders`), allowing cashier nodes to receive instant updates of incoming customer orders without polling the database.

---

## 📖 Get Started

To set up, migrate, and run the applications locally, please refer to the comprehensive guide in [SETUP.md](file:///D:/taj_saas/SETUP.md).
