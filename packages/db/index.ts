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
