"use strict";
const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

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
  console.warn("Failed to load .env file:", e);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log("🔄 Updating database with PIC Zahi and Netlify URLs...");
  
  await sql`UPDATE branches SET pic_name = 'Zahi';`;
  await sql`UPDATE tenants SET domain = 'tajsaas.netlify.app', admin_subdomain = 'https://tajadmin.netlify.app/', owner_subdomain = 'https://tajsaas.netlify.app/' WHERE slug = 'taj-saas';`;
  
  console.log("✅ Database successfully updated!");
}

main().catch((err) => {
  console.error("❌ Update Error:", err);
  process.exit(1);
});
