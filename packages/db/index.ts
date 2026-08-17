import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// Configure WebSocket constructor for Node.js runtime
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const databaseUrl = process.env.DATABASE_URL;

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
