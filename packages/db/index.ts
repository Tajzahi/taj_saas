import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// For serverless/edge environments, configure connection pooling if needed
// neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export * as schema from './schema';
export * from './schema';
