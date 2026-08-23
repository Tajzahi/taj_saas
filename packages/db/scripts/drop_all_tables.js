"use strict";
const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

// Load env variables
try {
  const envPath = path.resolve(__dirname, "../../../.env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    for (const line of envConfig.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn("Failed to load root .env file:", e);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

// 🛡️ CRITICAL SAFETY GUARD: Prevent accidental execution in production / staging
if (process.env.NODE_ENV === "production" || !process.env.ALLOW_DESTRUCTIVE_DB_RESET) {
  console.error(
    "⛔ BLOCKED: drop_all_tables.js is a dangerous destructive operation.\n" +
    "Execution is blocked in production environments and requires explicit confirmation.\n" +
    "To run locally in development, set: ALLOW_DESTRUCTIVE_DB_RESET=true"
  );
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log("🔥 Dropping and recreating public schema in Neon DB...");
  await sql`DROP SCHEMA IF EXISTS public CASCADE;`;
  await sql`CREATE SCHEMA public;`;
  await sql`GRANT ALL ON SCHEMA public TO public;`;
  console.log("✅ Schema public reset completely!");
}

main().catch((err) => {
  console.error("❌ Drop Error:", err);
  process.exit(1);
});
