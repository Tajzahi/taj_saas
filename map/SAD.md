# 🏗️ Dokumentasi System Architecture Diagram (SAD) Complete - Taj SaaS Platform

Dokumen resmi **System Architecture Diagram (SAD)** ini mendokumentasikan arsitektur sistem tingkat tinggi (*high-level topology*), komponen monorepo, aliran data multi-tenant, batas keamanan (*security boundaries*), sistem real-time, dan integrasi kecerdasan buatan (AI) pada **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**.

---

## 📑 Daftar Isi System Architecture Document
1. [Visi & Ringkasan Arsitektur Sistem](#1-visi--ringkasan-arsitektur-sistem)
2. [Topologi Arsitektur Tingkat Tinggi (High-Level Topology)](#2-topologi-arsitektur-tingkat-tinggi-high-level-topology)
3. [Arsitektur Resolution & Routing Multi-Tenant](#3-arsitektur-resolution--routing-multi-tenant)
4. [Struktur Monorepo & Dependensi Antar Paket](#4-struktur-monorepo--dependensi-antar-paket)
5. [Arsitektur Notifikasi Real-time (Ably PubSub Broker)](#5-arsitektur-notifikasi-real-time-ably-pubsub-broker)
6. [Arsitektur Otentikasi & Keamanan (Better Auth & Subdomain Cookies)](#6-arsitektur-otentikasi--keamanan-better-auth--subdomain-cookies)
7. [Arsitektur Data & Persistence Layer (Drizzle ORM + Neon Postgres)](#7-arsitektur-data--persistence-layer-drizzle-orm--neon-postgres)
8. [Arsitektur Integrasi AI Assistant (Google Gemini AI)](#8-arsitektur-integrasi-ai-assistant-google-gemini-ai)
9. **[Matriks Keputusan Arsitektur & Technology Stack (Architectural Matrix)](#9-matriks-keputusan-arsitektur--technology-stack-architectural-matrix)**

---

## 1. Visi & Ringkasan Arsitektur Sistem

**Taj SaaS** dibangun dengan arsitektur **Zero-Supabase Multi-Tenant SaaS** berkinerja tinggi untuk bisnis Food & Beverage (F&B). Sistem ini sepenuhnya terisolasi antar penyewa (*tenant-isolated*) dari tingkat routing HTTP, ORM query scope, channel notifikasi real-time, hingga cookie otentikasi.

- **Monorepo Engine:** Turborepo + pnpm Workspaces
- **Frontend App Router:** Next.js (TypeScript)
- **Database Engine:** Neon Serverless Postgres
- **ORM & Data Mapper:** Drizzle ORM
- **Auth Provider:** Better Auth (dengan Subdomain Session Sharing)
- **Real-time PubSub Broker:** Ably Cloud Channels
- **AI Intelligence Engine:** Google Gemini AI API

---

## 2. Topologi Arsitektur Tingkat Tinggi (High-Level Topology)

Diagram berikut menggambarkan secara menyeluruh struktur 5-tier dari Client Layer hingga External Cloud Infrastructure.

```mermaid
graph TD
    subgraph TIER1 [Client Tier / End-User Devices]
        C1[🌐 Pelanggan Web / Mobile]
        C2[📟 Kasir POS Terminal]
        C3[👑 Owner / Executive Cockpit]
    end

    subgraph TIER2 [Routing & Middleware Tier]
        DNS[🌐 DNS / Subdomain Resolver]
        MW[⚡ Next.js Resolver Middleware]
    end

    subgraph TIER3 [Monorepo Application Tier - apps/]
        APP_CUST[🛒 Customer App - Port 3000]
        APP_ADMIN[📟 Admin POS App - Port 3001]
        APP_OWNER[👑 Owner Cockpit App - Port 3002]
    end

    subgraph TIER4 [Workspace Packages Tier - packages/]
        PKG_SHARED[🔄 @taj-saas/shared: Tenant Context & Utilities]
        PKG_DB[🗄️ @taj-saas/db: Drizzle Schema & Client]
        PKG_UI[🎨 @taj-saas/ui: Shared Component Library]
    end

    subgraph TIER5 [Persistence & External Cloud Services Tier]
        NEON[(🗄️ Neon Serverless Postgres DB)]
        BETTER_AUTH[🔒 Better Auth Engine]
        ABLY[📡 Ably Realtime PubSub Broker]
        GEMINI[🧠 Google Gemini AI Cloud]
    end

    C1 --> DNS
    C2 --> DNS
    C3 --> DNS

    DNS --> MW
    MW -->|Port 3000| APP_CUST
    MW -->|Port 3001| APP_ADMIN
    MW -->|Port 3002| APP_OWNER

    APP_CUST --> PKG_SHARED
    APP_CUST --> PKG_DB
    APP_CUST --> PKG_UI

    APP_ADMIN --> PKG_SHARED
    APP_ADMIN --> PKG_DB
    APP_ADMIN --> PKG_UI

    APP_OWNER --> PKG_SHARED
    APP_OWNER --> PKG_DB
    APP_OWNER --> PKG_UI

    PKG_DB --> NEON
    APP_CUST --> ABLY
    APP_ADMIN --> ABLY
    APP_CUST --> BETTER_AUTH
    APP_ADMIN --> BETTER_AUTH
    APP_OWNER --> BETTER_AUTH
    APP_OWNER --> GEMINI
```

---

## 3. Arsitektur Resolution & Routing Multi-Tenant

Sistem resolusi multi-tenant dinamis tanpa perlu konfigurasi file `hosts` sistem operasi pada lingkungan pengembangan lokal.

```mermaid
flowchart TD
    A[Request HTTP Masuk] --> B[Next.js Middleware Interceptor]
    B --> C[parseTenantFromHostname: Subdomain & Port Detector]
    
    C -->|Port 3000 / Main Domain| D[Customer Application Space]
    C -->|Port 3001 / admin.subdomain| E[Admin POS Application Space]
    C -->|Port 3002 / owner.subdomain| F[Owner Cockpit Application Space]

    D & E & F --> G[Query Tenant Slug ke Neon Postgres]
    
    G -->|Found & Active| H[Injeksi Headers HTTP: x-tenant-id & x-tenant-slug]
    G -->|Tenant Inactive| I[Return HTTP 403 Forbidden]
    G -->|Tenant Not Found| J[Return HTTP 404 Not Found]

    H --> K[Teruskan Request ke Next.js Page Component / API Route]
```

---

## 4. Struktur Monorepo & Dependensi Antar Paket

Grafik ketergantungan internal pada Turborepo workspace.

```mermaid
graph LR
    subgraph Applications [apps/]
        A1[apps/customer]
        A2[apps/admin]
        A3[apps/owner]
    end

    subgraph Internal_Packages [packages/]
        P1[packages/shared]
        P2[packages/db]
        P3[packages/ui]
    end

    A1 --> P1
    A1 --> P2
    A1 --> P3

    A2 --> P1
    A2 --> P2
    A2 --> P3

    A3 --> P1
    A3 --> P2
    A3 --> P3

    P1 --> P2
```

---

## 5. Arsitektur Notifikasi Real-time (Ably PubSub Broker)

Arsitektur pesan pub/sub tanpa polling database (*Zero DB Polling*) untuk menyiarkan pesanan baru dari pelanggan ke layar POS kasir.

```mermaid
sequenceDiagram
    autonumber
    participant Cust as 🛒 Customer App (:3000)
    participant API as 🚀 POST /api/orders Handler
    participant Ably as 📡 Ably Realtime Cloud Broker
    participant Admin as 📟 Admin POS App (:3001)

    Cust->>API: Submit Order Baru (Payload JSON)
    API->>API: Simpan Order ke Neon Postgres DB
    API->>Ably: Ably.Rest.publish('new-order', { orderData })
    activate Ably
    Ably-->>API: ACK Message Published
    deactivate Ably
    API-->>Cust: Return HTTP 201 Created

    Ably->>Admin: Push Event via Channel WebSocket 'orders:tenantSlug'
    activate Admin
    Admin->>Admin: Trigger Beep Sound + Popup Toast + Refresh Order Queue
    deactivate Admin
```

---

## 6. Arsitektur Otentikasi & Keamanan (Better Auth & Subdomain Cookies)

Skema keamanan otentikasi lintas subdomain menggunakan `COOKIE_DOMAIN=.localhost` dan pengecekan Role-Based Access Control (RBAC).

```mermaid
flowchart TD
    A[Pengguna Akses Form Login] --> B[Submit Email & Password]
    B --> C[Better Auth Server Engine]
    C --> D[Verifikasi Kredensial di Neon DB user & account]
    
    D -->|Valid| E[Terbitkan Token Session Login]
    E --> F[Set Cookie Sesi: domain='.localhost' & SameSite='Lax']
    
    F --> G{Pemeriksaan Role Pengguna}
    G -->|Role: owner / manager| H[Izinkan Akses Owner Cockpit :3002]
    G -->|Role: kasir| I[Izinkan Akses Admin POS :3001]
    G -->|Role Tidak Sesuai| J[Redirect ke /unauthorized]
```

---

## 7. Arsitektur Data & Persistence Layer (Drizzle ORM + Neon Postgres)

Arsitektur lapisan data menggunakan **Drizzle ORM** dan **Neon Serverless Postgres** dengan jaminan kueri terisolasi per tenant.

```mermaid
graph TD
    subgraph Application_Layer [Application Layer]
        SA[Next.js Server Actions / API Routes]
    end

    subgraph Data_Access_Layer [@taj-saas/db Package]
        DRIZZLE[Drizzle ORM Client]
        SCHEMA[Drizzle Schema Definitions]
    end

    subgraph Database_Layer [Neon Postgres Serverless]
        PG_POOL[Neon HTTP / Serverless Connection Pool]
        TABLES[(23 Tabel Multi-Tenant Data Isolated)]
    end

    SA --> DRIZZLE
    DRIZZLE --> SCHEMA
    SCHEMA --> PG_POOL
    PG_POOL --> TABLES
```

---

## 8. Arsitektur Integrasi AI Assistant (Google Gemini AI)

Integrasi kecerdasan buatan pada Owner Cockpit untuk analisis tren penjualan dan rekomendasi inventori.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as 👑 Owner Dashboard
    participant API as 🚀 POST /api/chat Handler
    participant GeminiSDK as 🧠 GoogleGenAI SDK
    participant GeminiAPI as ☁️ Google Gemini Cloud Model

    Owner->>API: Kirim Prompt Analitis ("Analisis tren penjualan minggu ini")
    activate API
    API->>API: Injeksi Prompt System Context & Konfigurasi Parameter Model
    API->>GeminiSDK: ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
    activate GeminiSDK
    GeminiSDK->>GeminiAPI: model.generateContent(prompt)
    activate GeminiAPI
    GeminiAPI-->>GeminiSDK: Stream / Return Text Response
    deactivate GeminiAPI
    GeminiSDK-->>API: Return Insight Result
    deactivate GeminiSDK
    API-->>Owner: Render Rekomendasi AI di Dashboard
    deactivate API
```

---

## 9. Matriks Keputusan Arsitektur & Technology Stack (Architectural Matrix)

Tabel berikut merangkum keputusan arsitektural utama, teknologi yang dipilih, alasan pemilihan, dan manfaat bagi platform Taj SaaS.

| Komponen Arsitektur | Teknologi Terpilih | Alasan & Rasionalisasi Desain | Manfaat Utama |
| :--- | :--- | :--- | :--- |
| **Monorepo Manager** | Turborepo + pnpm | Mengelola 3 aplikasi Next.js & 3 shared packages dalam 1 repository. | Build Caching super cepat, shared code reuse 100%. |
| **Application Framework**| Next.js App Router | Pemanfaatan Server Components & Server Actions modern. | SEO optimal di customer app, performa tinggi di dashboard. |
| **Database Engine** | Neon Serverless Postgres | Database Postgres serverless yang dapat menskala otomatis secara independen. | Koneksi HTTP serverless, efisiensi biaya, auto-scaling. |
| **ORM & Query Mapper** | Drizzle ORM | Type-safe SQL query builder tanpa overhead runtime heavyweight. | Type-safety 100%, kueri eksplisit berkinerja tinggi. |
| **Authentication Engine**| Better Auth Engine | Pengganti Supabase Auth dengan fleksibilitas hook database kustom. | Otomatisasi pembagian sesi cookie di seluruh subdomain. |
| **Realtime PubSub** | Ably Realtime Cloud | Serverless WebSocket messaging terisolasi per channel tenant. | POS menerima pesanan instan tanpa polling database. |
| **Artificial Intelligence**| Google Gemini AI SDK | Engine pemrosesan AI tingkat lanjut untuk insight analitik F&B. | Owner mendapat asisten AI untuk optimasi bisnis. |

---

*Dokumen System Architecture Diagram (SAD) ini dibuat secara otomatis dan komprehensif untuk Taj SaaS Platform.*
