# Taj SaaS - Local Setup & Development Guide

This guide describes how to configure, seed, and run the multi-tenant F&B SaaS platform locally.

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18+ recommended)
- **pnpm** (Package manager used for the workspaces)
- **Neon Console Account** (Serverless Postgres database)
- **Better Auth** (Configured for organization and subdomain session sharing)
- **Ably Account** (For real-time cashier order notifications)

---

## 🚀 Step-by-Step Installation

### 1. Clone & Install Dependencies
First, install all monorepo dependencies from the root directory:
```bash
npx pnpm install
```

### 2. Configure Environment Variables
Copy the global environment template to create your `.env` file:
```bash
cp .env.example .env
```
Fill in the following values in your `.env`:
- `DATABASE_URL`: Your Neon connection string (e.g. `postgresql://...`).
- `BETTER_AUTH_SECRET`: A secure 32-character secret key.
- `BETTER_AUTH_URL`: The base URL of your client auth app (usually `http://a6-nyuss.localhost:3000`).
- `COOKIE_DOMAIN`: Set this to `.localhost` in development to share authentication sessions across subdomains.
- `ABLY_API_KEY` & `NEXT_PUBLIC_ABLY_API_KEY`: Your Ably API key from the Ably dashboard.
- `GEMINI_API_KEY`: Your Google Gemini API key to enable AI-powered chatbot insights.

### 3. Database Schema Migrations
Generate Drizzle SQL files and apply them to your Neon database:
```bash
# Generate the migration files based on the Drizzle schema
npx pnpm --filter @taj-saas/db db:generate

# Apply migrations to your Neon database
npx pnpm --filter @taj-saas/db db:migrate
```

### 4. Database Seeding
Seed template tenant data (such as default branches, menus, categories, inventory, and recipes) for testing:
```bash
npx pnpm --filter @taj-saas/db seed
```
This script creates a default tenant `Martabak Terbul A6 Nyuss` with the slug `a6-nyuss`.

### 5. Setup Local Subdomains (Hosts File)
Because the platform resolves tenants dynamically using the hostname, you need to map local loopback addresses to hostnames in your OS `hosts` file:

**On Windows (Run Notepad as Administrator):**
Open `C:\Windows\System32\drivers\etc\hosts` and add the following lines:
```text
127.0.0.1    a6-nyuss.localhost
127.0.0.1    admin.a6-nyuss.localhost
127.0.0.1    owner.a6-nyuss.localhost
```

**On Linux/macOS:**
Open `/etc/hosts` and add the same records:
```text
127.0.0.1    a6-nyuss.localhost
127.0.0.1    admin.a6-nyuss.localhost
127.0.0.1    owner.a6-nyuss.localhost
```

---

## 💻 Running the Applications

Start all applications in development mode simultaneously using Turborepo:
```bash
npx pnpm dev
```

The apps will be available at:
- 🛒 **Customer App (Port 3000):** [http://a6-nyuss.localhost:3000](http://a6-nyuss.localhost:3000)
- 🏢 **Admin App (Port 3001):** [http://admin.a6-nyuss.localhost:3001](http://admin.a6-nyuss.localhost:3001)
- 👑 **Owner App (Port 3002):** [http://owner.a6-nyuss.localhost:3002](http://owner.a6-nyuss.localhost:3002)

---

## 🛠️ Multi-Tenant Architecture & Resolution

### Tenant Resolver Flow
1. **Hostname Interception:** The Next.js Middleware in each app parses the hostname of the incoming request.
2. **Branding & Config Query:** It extracts the subdomain prefix (e.g. `a6-nyuss`, `admin.a6-nyuss`, `owner.a6-nyuss`) and matches it with the database tenant slug.
3. **Request Header Propagation:** The middleware attaches headers (`x-tenant-id`, `x-tenant-slug`) to the request before forwarding it to pages/API routes.
4. **Data Isolation:** All database transactions and queries use Drizzle ORM to filter data exclusively by `tenantId`.

### Session & Cookie Sharing
By setting `COOKIE_DOMAIN` to `.localhost` (or your root production domain), Better Auth issues session cookies that are automatically sent by the browser to all subdomains (e.g. `admin.a6-nyuss.localhost` and `owner.a6-nyuss.localhost`).

---

## 🔔 Realtime Ably Notifications
Realtime cashier functionality is Ably-based and completely tenant-aware:
- The cashier dashboard subscribes to channels prefixed with the current tenant's slug (e.g., `a6-nyuss:orders`).
- When a customer submits an order or updates a payment proof, a webhook or Server Action triggers an event on that tenant channel.
- Cashier applications receive the update instantly without polling.
