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

let _dbInstance: NeonDatabase<typeof schema> | null = null;
let _poolInstance: Pool | null = null;

function getDbInstance(): NeonDatabase<typeof schema> {
  if (typeof window !== 'undefined') {
    return null as any;
  }
  if (!_dbInstance) {
    const databaseUrl = (typeof process !== 'undefined' && process.env?.DATABASE_URL)
      ? process.env.DATABASE_URL.trim()
      : undefined;

    _poolInstance = new Pool({
      connectionString: databaseUrl || 'postgresql://placeholder-user:placeholder-pass@placeholder-host.tld/neondb',
    });
    _dbInstance = drizzle(_poolInstance, { schema });
  }
  return _dbInstance;
}

// Lazy Proxy: prevents Neon Pool WebSocket background connection at module import time during Next.js builds
export const db: NeonDatabase<typeof schema> = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDbInstance();
    if (!instance) return undefined;
    const value = (instance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export * as schema from './schema';
export * from './schema';
