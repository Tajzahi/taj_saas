import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// For serverless/edge environments, configure connection pooling if needed
// neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

if (typeof window === 'undefined' && !databaseUrl) {
  console.warn('[db/index] DATABASE_URL environment variable is not defined.');
}

// Client-safe strongly-typed database instance. Bypasses neon() execution in the browser.
export const db: NeonHttpDatabase<typeof schema> = (typeof window === 'undefined')
  ? drizzle(neon(databaseUrl || 'postgresql://placeholder-user:placeholder-pass@placeholder-host.tld/neondb'), { schema })
  : null as any;

export * as schema from './schema';
export * from './schema';
