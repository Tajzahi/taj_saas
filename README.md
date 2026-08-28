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
│   ├── customer/        # Customer Web App (ordering, payment upload, menu tracking, AI chatbot)
│   ├── admin/           # Admin Cashier & KDS Dashboard (real-time orders, shift logs, POS, KDS)
│   └── owner/           # Owner Executive Cockpit (15 dashboard modules: PnL, HR, BOM, inventory, AI)
├── packages/
│   ├── db/              # Database Schema definitions, Drizzle migrations, and DB client
│   ├── shared/          # Shared types, Zod schemas, tenant context, and auth helpers
│   ├── ui/              # Shared UI components and layout primitives
│   └── config/          # Shared ESLint, TypeScript, and Tailwind configurations
├── SETUP.md             # Developer setup, database seeding, and execution guide
├── package.json         # Workspace configuration and security overrides
├── pnpm-workspace.yaml  # Workspace pnpm configurations
└── turbo.json           # Turborepo task pipeline and global environment cache definitions
```

---

## 🔒 Key Design Patterns

### 1. Serverless PostgreSQL & Drizzle ORM Architecture
All data storage, queries, and multi-tenant scoping mechanisms run natively on Neon Serverless Postgres + Drizzle ORM. Better Auth acts as the unified authentication engine with subdomain session sharing.

### 2. Tenant Isolation
Middleware automatically resolves hostnames to inject tenant contexts via HTTP headers (`x-tenant-id`, `x-tenant-slug`). Drizzle ORM queries explicitly scope transactions using `tenantId` indexes to prevent cross-tenant data leaks.

### 3. Faithfully Ported Owner UI
The Owner app contains 15 fully functional Next.js App Router Server and Client modules, preserving premium aesthetics, responsive layouts, Recharts visualizations, and interactive F&B settings.

### 4. Real-time Pub/Sub
Order dispatching and state updates are sent via tenant-scoped Ably channels (e.g. `[slug]:orders`), allowing cashier nodes to receive instant updates of incoming customer orders without polling the database.

### 5. Multi-Layer Security Posture
- Magic-byte image inspection with MIME whitelist to prevent Stored XSS.
- Timing-safe cryptographic comparison for order tokens and cron webhooks.
- Multi-stage Docker container build running as non-root user (`USER nextjs` UID 1001).
- Distributed rate limiting with Upstash Redis and in-memory fail-safe sliding windows.

---

## 📖 Get Started

To set up, migrate, and run the applications locally, please refer to the comprehensive guide in [SETUP.md](./SETUP.md).
