# Implementation Plan: Full Refactor – Neon + Drizzle + Owner Dashboard Port

**Project:** taj_saas (Multi-Tenant F&B SaaS)  
**Goal:** Complete migration from current mixed state to a clean, production-ready multi-tenant architecture using **Neon Postgres + Drizzle ORM + Better Auth + Ably**, with full port of the Owner Dashboard from the Vite template, and fixes for existing bugs.

**Important Notes:**
- A6 Nyuss data and structure is used **only as reference** (menu, variants, toppings, business flow).
- All three apps (Customer, Admin, Owner) must be fully tenant-aware.
- Supabase must be **completely removed**.
- Owner Dashboard must be ported as faithfully as possible from `apps/owner/_pages/` into Next.js App Router.

---

## Phase 0: Preparation & Cleanup

1. **Remove all Supabase dependencies**
   - Delete `@supabase/supabase-js` from all `package.json` files (root, customer, admin, owner).
   - Delete folders and files:
     - `apps/customer/lib/supabase/`
     - `apps/admin/utils/supabase.ts`
     - Any other Supabase-related files (client.ts, server.ts, etc.).
   - Remove Supabase environment variables from `.env` files.
   - Run `pnpm install` after cleanup.

2. **Clean up unused or conflicting files**
   - Review and remove old Supabase schema/types if they exist in `packages/db` or `apps/*/types/database.types.ts`.
   - Keep `apps/owner/_pages/` as the **source of truth** for Owner UI (do not delete).

3. **Update root configuration**
   - Ensure `packages/db` is properly set up as a workspace package.
   - Update `turbo.json` if needed to include `db` tasks.

---

## Phase 1: Database Schema & Neon + Drizzle Setup

**Goal:** Create a complete, multi-tenant F&B schema using Drizzle + Neon.

1. **Setup Drizzle configuration**
   - Create / update `packages/db/drizzle.config.ts`
   - Point to Neon connection string via environment variable (`DATABASE_URL`).

2. **Create full schema in `packages/db/src/schema.ts`**
   - Define the following tables with proper relations and `tenantId`:
     - `tenants`
     - `profiles`
     - `branches`
     - `categories`
     - `menu_items`
     - `menu_variants`
     - `toppings`
     - `recipes`
     - `recipe_ingredients`
     - `inventory`
     - `inventory_transactions`
     - `orders`
     - `order_items`
     - `shifts`
     - `shift_logs`
     - `audit_logs`
   - Add necessary indexes on `tenantId` columns.
   - Create proper Drizzle relations between tables.

3. **Create migration files**
   - Generate initial migration using Drizzle Kit.
   - Ensure the migration is clean and includes all tables.

4. **Create seed script**
   - Create `packages/db/scripts/seed-template.ts`
   - Seed realistic F&B data (categories, menu items with variants, toppings, sample recipes, and basic inventory) for testing.
   - The script should accept a `tenantId` parameter.

5. **Export types and utilities**
   - Create `packages/db/src/index.ts` to export schema, relations, and types.
   - Make `packages/db` importable from all apps.

---

## Phase 2: Tenant Resolver & Better Auth Integration

**Goal:** Make the entire application multi-tenant aware with proper authentication.

1. **Create shared tenant utilities**
   - In `packages/shared/src/tenant.ts`:
     - Create functions to parse tenant from hostname.
     - Create types: `Tenant`, `TenantContext`.

2. **Implement Tenant Middleware**
   - Update / create `middleware.ts` in each app (`customer`, `admin`, `owner`).
   - Middleware must:
     - Read hostname and resolve `tenantId` + `tenantSlug`.
     - Set headers (`x-tenant-id`, `x-tenant-slug`).
     - Redirect or block if tenant not found.
   - Create a shared middleware helper in `packages/shared`.

3. **Create Tenant Context**
   - Create `packages/shared/src/tenant-context.tsx` (Client Component context).
   - Create server-side helper to get current tenant from headers.

4. **Configure Better Auth**
   - Set up Better Auth with organization/tenant support.
   - Configure session cookies to work across subdomains (`.localhost` for dev, production domain later).
   - Create auth route handler in `apps/customer/app/api/auth/[...better-auth]/route.ts` (can be shared or duplicated per app if needed).
   - Update all protected routes to use Better Auth session + tenant check.

5. **Update environment variables**
   - Document required variables:
     - `DATABASE_URL` (Neon)
     - `BETTER_AUTH_SECRET`
     - `ABLY_API_KEY`
     - Domain-related variables for development.

---

## Phase 3: Owner Dashboard – Full Port from Vite Template

**Goal:** Port the clean Owner Dashboard from `apps/owner/_pages/` into proper Next.js structure.

1. **Setup Owner App Layout**
   - Create or clean `apps/owner/app/(dashboard)/layout.tsx`
   - Port Sidebar and Topbar from the Vite template (`apps/owner/_pages/components/layout/`).
   - Make layout tenant-aware (show current tenant branding).

2. **Port all Owner pages**
   Port the following pages from `apps/owner/_pages/` into `apps/owner/app/(dashboard)/`:
   - `ExecutiveCockpit.tsx` → `executive-cockpit/page.tsx`
   - `Cabang.tsx` → `cabang/page.tsx`
   - `MenuResep.tsx` → `menu/page.tsx`
   - `Persediaan.tsx` → `persediaan/page.tsx`
   - `Keuangan.tsx` → `keuangan/page.tsx`
   - `Produksi.tsx` → `produksi/page.tsx`
   - `Penjualan.tsx` → `penjualan/page.tsx`
   - `SDM.tsx` → `sdm/page.tsx`
   - `Persetujuan.tsx` → `persetujuan/page.tsx`
   - `AIInsights.tsx` → `ai/page.tsx`
   - `Pengaturan.tsx` → `pengaturan/page.tsx`

3. **Adaptations during porting**
   - Replace mock data with real Drizzle queries (tenant-filtered).
   - Convert class components / Vite patterns to Next.js Server + Client Components.
   - Use shadcn/ui components where possible while preserving the visual style from the Vite template.
   - Make charts (Recharts) work in Next.js (client components).
   - Add proper loading states and error handling.
   - Ensure all actions (create branch, approve, etc.) are tenant-aware.

4. **Add missing enterprise features** (if not in template)
   - Basic AI Insights section (can start with static + placeholder for Gemini).
   - Tenant branding support in header and settings.

---

## Phase 4: Bug Fixes & Alignment (Customer + Admin)

1. **Fix Customer App – Menu Images Not Showing**
   - Standardize all image usage to use `next/image`.
   - Ensure menu images are stored in `apps/customer/public/assets/menu/`.
   - Update `MenuCard.tsx`, `menu/page.tsx`, and `menu/[slug]/page.tsx`.
   - Fix any path issues between development and production.

2. **Fix Admin App – Stuck on Loading Spinner**
   - Investigate and fix session initialization in `adminStore.ts` and layout.
   - Replace all Supabase queries with Drizzle queries.
   - Fix Ably subscription initialization (make it tenant-aware and handle reconnection).
   - Ensure the app properly waits for Better Auth session before rendering main content.

3. **Align Customer and Admin with new stack**
   - Remove remaining Supabase calls.
   - Make order creation, status updates, and realtime use the new Drizzle + Ably approach.
   - Ensure cart, checkout, and order tracking are tenant-aware.

---

## Phase 5: Final Cleanup & Verification

1. **Remove leftover Supabase code**
   - Global search and remove any remaining Supabase imports or references.

2. **Update configuration files**
   - `next.config.ts` in each app (remove Supabase-related plugins if any).
   - `tsconfig.json` paths if needed.
   - Environment example files (`.env.example`).

3. **Create / update documentation**
   - Create `SETUP.md` explaining:
     - How to run the project locally with Neon.
     - How to seed data.
     - How Better Auth and Ably are configured.
   - Update root `README.md` with current architecture.

4. **Testing checklist (to be done after AI executes)**
   - Can create a new tenant and access all three apps.
   - Owner Dashboard pages load with correct data and branding.
   - Admin can receive realtime orders and update status.
   - Customer can place orders and track them.
   - Images display correctly in Customer app.
   - No Supabase errors in console.

---

## Execution Order (Strictly Recommended)

1. Phase 0 (Cleanup)
2. Phase 1 (Database + Schema + Seed)
3. Phase 2 (Tenant Resolver + Better Auth)
4. Phase 3 (Owner Dashboard Porting) ← Do this after foundation is solid
5. Phase 4 (Bug Fixes in Customer & Admin)
6. Phase 5 (Cleanup & Documentation)

Do not jump between phases. Complete foundation before porting the Owner UI.

---

**End of Implementation Plan**

This plan is designed to be followed sequentially by an AI coding agent. Each component builds on the previous one to avoid circular dependencies and broken states.