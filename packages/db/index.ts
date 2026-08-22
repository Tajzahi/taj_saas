import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

// Robust WebSocket constructor resolution for Node.js / Edge / Serverless runtimes
if (typeof window === 'undefined') {
  if (typeof globalThis.WebSocket !== 'undefined') {
    neonConfig.webSocketConstructor = globalThis.WebSocket;
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      neonConfig.webSocketConstructor = require('ws');
    } catch {
      // WebSocket fallback
    }
  }
}

const databaseUrl = (typeof process !== 'undefined' && process.env?.DATABASE_URL)
  ? process.env.DATABASE_URL.trim()
  : undefined;

if (typeof window === 'undefined' && !databaseUrl) {
  console.warn('[db/index] DATABASE_URL environment variable is not defined.');
}

// Dev-only: arahkan Neon serverless driver ke Postgres lokal lewat WebSocket proxy
// (lihat scripts/dev-neon-ws-proxy.js). Aktif hanya jika NEON_WS_PROXY di-set,
// sehingga perilaku produksi (Neon) tidak berubah sama sekali.
const devWsProxy = typeof process !== 'undefined' ? process.env?.NEON_WS_PROXY?.trim() : undefined;
if (typeof window === 'undefined' && devWsProxy) {
  neonConfig.wsProxy = () => devWsProxy;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = (typeof window === 'undefined')
  ? new Pool({
      connectionString: databaseUrl || 'postgresql://placeholder-user:placeholder-pass@placeholder-host.tld/neondb',
    })
  : null as any;

// Client-safe strongly-typed database instance with multi-statement ACID transaction support
export const db: NeonDatabase<typeof schema> = (typeof window === 'undefined')
  ? drizzle(pool, { schema })
  : null as any;

export * as schema from './schema';
export * from './schema';
