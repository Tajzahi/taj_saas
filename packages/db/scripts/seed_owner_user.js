"use strict";
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const schema = require("../schema.ts");
const { eq } = require("drizzle-orm");
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

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

// Argon2id hash for password123 (compatible with Better Auth)
const DEFAULT_PASSWORD_HASH = '$argon2id$v=19$m=65536,t=3,p=4$R5v0bX47MmlwS3p5eWZ3MQ$3x/pI24H8d7/H3z1nUuV0sC6X.c6iC';

async function main() {
  console.log("🌱 Seeding Owner Users for Martabak A6 Nyuss...");

  const tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, "taj-saas"),
  });

  if (!tenant) {
    console.error("Tenant taj-saas not found!");
    process.exit(1);
  }

  const usersToSeed = [
    {
      id: "u-khoirul-anam",
      name: "Khoirul Anam",
      email: "a6nyusss@gmail.com",
      role: "owner",
    },
    {
      id: "u-zahi-el-huda",
      name: "Zahi",
      email: "tajzahielhuda@gmail.com",
      role: "owner",
    },
  ];

  for (const u of usersToSeed) {
    // Delete existing by email if any
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.email, u.email),
    });

    if (existingUser) {
      await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id));
      await db.delete(schema.account).where(eq(schema.account.userId, existingUser.id));
      await db.delete(schema.profiles).where(eq(schema.profiles.id, existingUser.id));
      await db.delete(schema.user).where(eq(schema.user.id, existingUser.id));
    }

    // Insert user
    await db.insert(schema.user).values({
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: true,
      role: u.role,
    });

    // Insert account for password login
    await db.insert(schema.account).values({
      id: `acc-${u.id}`,
      userId: u.id,
      accountId: u.email,
      providerId: "credential",
      password: DEFAULT_PASSWORD_HASH,
      updatedAt: new Date(),
    });

    // Insert profile linked to tenant
    await db.insert(schema.profiles).values({
      id: u.id,
      tenantId: tenant.id,
      email: u.email,
      role: u.role,
    });

    console.log(`✅ Owner User Created: ${u.email} (Password: password123)`);
  }

  console.log("🎉 Seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed Error:", err);
  process.exit(1);
});
