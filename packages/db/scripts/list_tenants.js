const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../../../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      process.env[match[1]] = val;
    }
  }
}

const sql = neon(process.env.DATABASE_URL);
async function run() {
  const tenants = await sql`SELECT id, name, slug, domain, admin_subdomain, owner_subdomain, is_active, created_at FROM tenants ORDER BY created_at DESC;`;
  console.log("TENANTS:", JSON.stringify(tenants, null, 2));
}
run();
