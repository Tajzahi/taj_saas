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

async function main() {
  console.log("🧹 1. Clearing ALL existing database tables...");

  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.inventoryTransactions);
  await db.delete(schema.inventory);
  await db.delete(schema.recipeIngredients);
  await db.delete(schema.recipes);
  await db.delete(schema.menuVariants);
  await db.delete(schema.toppings);
  await db.delete(schema.menuItems);
  await db.delete(schema.categories);
  await db.delete(schema.approvals);
  await db.delete(schema.shifts);
  await db.delete(schema.branches);
  await db.delete(schema.auditLogs);
  await db.delete(schema.profiles);
  await db.delete(schema.account);
  await db.delete(schema.session);
  await db.delete(schema.user);
  await db.delete(schema.tenants);

  console.log("✅ All tables cleared!");

  console.log("🌱 2. Creating Primary Tenant: taj-saas (Martabak A6 Nyuss)...");
  const [tenant] = await db
    .insert(schema.tenants)
    .values({
      name: "Martabak A6 Nyuss",
      slug: "taj-saas",
      domain: "taj-saas.localhost",
      adminSubdomain: "admin",
      ownerSubdomain: "owner",
      branding: {
        logoUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=150",
        primaryColor: "#D94708",
        secondaryColor: "#E05009",
        businessName: "Martabak A6 Nyuss",
        whatsappNumber: "6287811123482",
        storeAddress: "Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya",
        openingHours: "16:00 - 01:00",
      },
      packageType: "enterprise",
      isActive: true,
    })
    .returning();

  console.log(`✅ Tenant created: ${tenant.name} (ID: ${tenant.id})`);

  console.log("🌱 3. Creating Default Branch...");
  const [branch] = await db
    .insert(schema.branches)
    .values({
      tenantId: tenant.id,
      name: "Cabang Utama Demak",
      city: "Surabaya",
      address: "Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya",
      phone: "087811123482",
      picName: "Dedi",
      status: "active",
    })
    .returning();

  console.log(`✅ Branch created: ${branch.name}`);

  console.log("🌱 4. Creating Categories from docs/daftar_menu.md...");
  const [catAyam] = await db
    .insert(schema.categories)
    .values({
      tenantId: tenant.id,
      name: "Martabak Telur Ayam",
      slug: "martabak-telur-ayam",
      sortOrder: 1,
    })
    .returning();

  const [catBebek] = await db
    .insert(schema.categories)
    .values({
      tenantId: tenant.id,
      name: "Martabak Telur Bebek",
      slug: "martabak-telur-bebek",
      sortOrder: 2,
    })
    .returning();

  const [catTerangBulan] = await db
    .insert(schema.categories)
    .values({
      tenantId: tenant.id,
      name: "Terang Bulan",
      slug: "terang-bulan",
      sortOrder: 3,
    })
    .returning();

  const [catTopping] = await db
    .insert(schema.categories)
    .values({
      tenantId: tenant.id,
      name: "Tambahan Topping",
      slug: "tambahan-topping",
      sortOrder: 4,
    })
    .returning();

  console.log("✅ Categories created!");

  console.log("🌱 5. Seeding Menu Items from docs/daftar_menu.md...");

  // Category 1: Martabak Telur Ayam
  const ayamItems = [
    { name: "Martabak Telur Ayam (1 Butir)", price: "20000", isBestSeller: false },
    { name: "Martabak Telur Ayam (2 Butir)", price: "25000", isBestSeller: false },
    { name: "Martabak Telur Ayam Special (2 Butir)", price: "30000", isBestSeller: true },
    { name: "Martabak Telur Ayam (3 Butir)", price: "35000", isBestSeller: false },
    { name: "Martabak Telur Ayam Super (3 Butir)", price: "40000", isBestSeller: true },
    { name: "Martabak Telur Ayam (4 Butir)", price: "45000", isBestSeller: false },
    { name: "Martabak Telur Ayam Istimewa (4 Butir)", price: "50000", isBestSeller: true },
    { name: "Martabak Telur Ayam (5 Butir)", price: "55000", isBestSeller: false },
    { name: "Martabak Telur Ayam Jumbo (5 Butir)", price: "60000", isBestSeller: false },
    { name: "Martabak Telur Ayam (6 Butir)", price: "65000", isBestSeller: false },
    { name: "Martabak Telur Ayam Royal (6 Butir)", price: "70000", isBestSeller: false },
    { name: "Martabak Telur Ayam Extra (7 Butir)", price: "75000", isBestSeller: false },
  ];

  for (const item of ayamItems) {
    await db.insert(schema.menuItems).values({
      tenantId: tenant.id,
      categoryId: catAyam.id,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `Martabak Telur Ayam gurih dengan resep racikan khas A6 Nyuss`,
      price: item.price,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
      isAvailable: true,
      isBestSeller: item.isBestSeller,
      isNew: false,
    });
  }

  // Category 2: Martabak Telur Bebek
  const bebekItems = [
    { name: "Martabak Telur Bebek (1 Butir)", price: "20000", isBestSeller: false },
    { name: "Martabak Telur Bebek (2 Butir)", price: "40000", isBestSeller: true },
    { name: "Martabak Telur Bebek (3 Butir)", price: "50000", isBestSeller: true },
    { name: "Martabak Telur Bebek (4 Butir)", price: "60000", isBestSeller: false },
    { name: "Martabak Telur Bebek (5 Butir)", price: "70000", isBestSeller: false },
    { name: "Martabak Telur Bebek Jumbo (6 Butir)", price: "80000", isBestSeller: false },
    { name: "Martabak Telur Bebek Royal", price: "90000", isBestSeller: false },
  ];

  for (const item of bebekItems) {
    await db.insert(schema.menuItems).values({
      tenantId: tenant.id,
      categoryId: catBebek.id,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `Martabak Telur Bebek lezat, lebih gurih dan mantap`,
      price: item.price,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
      isAvailable: true,
      isBestSeller: item.isBestSeller,
      isNew: false,
    });
  }

  // Category 3: Terang Bulan
  const terangBulanItems = [
    { name: "Terang Bulan 2 Variant Topping", price: "20000", isBestSeller: true },
    { name: "Terang Bulan Milo + 1 Topping", price: "25000", isBestSeller: true },
    { name: "Terang Bulan Oreo + 1 Topping", price: "25000", isBestSeller: false },
    { name: "Terang Bulan Nutella + 1 Topping", price: "30000", isBestSeller: true },
    { name: "Terang Bulan SilverQueen + 1 Topping", price: "50000", isBestSeller: false },
  ];

  for (const item of terangBulanItems) {
    await db.insert(schema.menuItems).values({
      tenantId: tenant.id,
      categoryId: catTerangBulan.id,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `Terang Bulan manis lembut dengan adonan lezat`,
      price: item.price,
      imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500",
      isAvailable: true,
      isBestSeller: item.isBestSeller,
      isNew: false,
    });
  }

  // Category 4: Tambahan Topping
  await db.insert(schema.menuItems).values({
    tenantId: tenant.id,
    categoryId: catTopping.id,
    name: "Tambahan Topping (Ekstra)",
    slug: "tambahan-topping-ekstra",
    description: "Pilihan: Kacang, Meses, Keju, Pisang, Melon, Strawberry, Selai Coklat, Nanas, Vanilla, Blueberry, Tiramisu, Green Tea, Kismis",
    price: "5000",
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500",
    isAvailable: true,
    isBestSeller: false,
    isNew: false,
  });

  // Seed Toppings Master List
  const toppingList = [
    "Kacang", "Meses", "Keju", "Pisang", "Melon", "Strawberry",
    "Selai Coklat", "Nanas", "Vanilla", "Blueberry", "Tiramisu", "Green Tea", "Kismis"
  ];

  for (const t of toppingList) {
    await db.insert(schema.toppings).values({
      tenantId: tenant.id,
      code: t.toLowerCase().replace(/\s+/g, "_"),
      name: t,
      isAvailable: true,
    });
  }

  console.log("✅ Menu items and toppings successfully seeded!");
  console.log("🎉 Database cleared & Menu re-populated strictly according to docs/daftar_menu.md!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed Error:", err);
  process.exit(1);
});
