import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Load env variables
try {
  const envPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
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
  console.warn('Failed to load root .env file:', e);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

// Helper to parse currency strings like "Rp 25.000" or "25.000 / kg"
function parseMoney(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

// Bcrypt hash for password123 (Updated to Argon2id hash for Better Auth compatibility)
const DEFAULT_PASSWORD_HASH = '$argon2id$v=19$m=65536,t=3,p=4$R5v0bX47MmlwS3p5eWZ3MQ$3x/pI24H8d7/H3z1nUuV0sC6X.c6iC';

async function main() {
  console.log('Starting seed process for Martabak Terang Bulan A6 Nyuss...');

  // 1. Ensure Tenant exists or update it (Primary slug: taj-saas)
  let tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, 'taj-saas'),
  });

  const tenantBranding = {
    businessName: 'Martabak Terang Bulan A6 Nyuss',
    primaryColor: '#D94708',
    secondaryColor: '#E05009',
    logo: '🥞',
    whatsappNumber: '6287811123482',
    flatDeliveryFee: 10000,
    minimumOrderAmount: 0,
    storeAddress: 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya',
    openingHours: 'Setiap Hari: 17:00 – 01:00',
  };

  if (!tenant) {
    console.log('Creating new tenant: taj-saas');
    const [newTenant] = await db.insert(schema.tenants).values({
      name: 'Taj SaaS - Martabak A6 Nyuss',
      slug: 'taj-saas',
      domain: 'tajsaas.com',
      adminSubdomain: 'admin',
      ownerSubdomain: 'owner',
      branding: tenantBranding,
      packageType: 'enterprise',
      isActive: true,
    }).returning();
    tenant = newTenant;
  } else {
    console.log('Updating existing tenant branding');
    await db.update(schema.tenants).set({
      name: 'Taj SaaS - Martabak A6 Nyuss',
      branding: tenantBranding,
    }).where(eq(schema.tenants.id, tenant.id));
  }

  const tenantId = tenant.id;
  console.log(`Tenant ID: ${tenantId}`);

  // 2. Clean existing data for this tenant
  console.log('Cleaning existing data...');
  await db.delete(schema.orderItems).where(eq(schema.orderItems.orderId, schema.orderItems.orderId)); // delete all items
  await db.delete(schema.orders).where(eq(schema.orders.tenantId, tenantId));
  await db.delete(schema.shiftLogs).where(eq(schema.shiftLogs.tenantId, tenantId));
  await db.delete(schema.shifts).where(eq(schema.shifts.tenantId, tenantId));
  await db.delete(schema.inventoryTransactions).where(eq(schema.inventoryTransactions.tenantId, tenantId));
  await db.delete(schema.inventory).where(eq(schema.inventory.tenantId, tenantId));
  await db.delete(schema.recipeIngredients).where(eq(schema.recipeIngredients.recipeId, schema.recipeIngredients.recipeId)); // delete all
  await db.delete(schema.recipes).where(eq(schema.recipes.tenantId, tenantId));
  await db.delete(schema.menuItems).where(eq(schema.menuItems.tenantId, tenantId));
  await db.delete(schema.categories).where(eq(schema.categories.tenantId, tenantId));
  await db.delete(schema.approvals).where(eq(schema.approvals.tenantId, tenantId));
  await db.delete(schema.profiles).where(eq(schema.profiles.tenantId, tenantId));
  await db.delete(schema.branches).where(eq(schema.branches.tenantId, tenantId));
  console.log('Database cleaned.');

  // 3. Seed Branches
  console.log('Seeding branches...');
  const [bDemak] = await db.insert(schema.branches).values({
    tenantId,
    name: 'Demak',
    city: 'Surabaya',
    address: 'Jl. Demak No. 253, Dupak, Kec. Krembangan, Kota Surabaya, Jawa Timur 60179 (Patokan: Tepat di depan Mess DITPOLAIRUD POLDA JATIM Surabaya).',
    phone: '087811123482',
    picName: 'Dedi',
    status: 'active',
  }).returning();

  const [bPasarKembang] = await db.insert(schema.branches).values({
    tenantId,
    name: 'Pasar Kembang',
    city: 'Surabaya',
    address: 'Surabaya, Jawa Timur',
    phone: '',
    picName: 'Deni',
    status: 'active',
  }).returning();

  const branchesMap = {
    'Demak': bDemak,
    'Pasar Kembang': bPasarKembang,
  };
  console.log('Branches seeded.');

  // 4. Seed SDM / Users & Profiles
  console.log('Seeding SDM...');
  const sdmData = [
    { name: 'Khoirul Anam', email: 'a6nyusss@gmail.com', role: 'owner', salary: 0, branchId: null, id: 'u-khoirul-anam' },
    { name: 'Zahi', email: 'tajzahielhuda@gmail.com', role: 'manager', salary: 3000000, branchId: null, id: 'u-zahi-el-huda' },
    { name: 'Dedi', email: 'dedimulyadi@gail.com', role: 'kasir', salary: 2500000, branchId: bDemak.id, id: 'u-dedi-mulyadi' },
    { name: 'Deni', email: 'denisetiadi@gmail.com', role: 'kasir', salary: 2500000, branchId: bPasarKembang.id, id: 'u-deni-setiadi' },
  ];

  for (const sdm of sdmData) {
    // Delete existing user by email if any
    const existingUser = await db.query.user.findFirst({ where: eq(schema.user.email, sdm.email) });
    if (existingUser) {
      await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id));
      await db.delete(schema.account).where(eq(schema.account.userId, existingUser.id));
      await db.delete(schema.user).where(eq(schema.user.id, existingUser.id));
    }

    // Insert user
    await db.insert(schema.user).values({
      id: sdm.id,
      name: sdm.name,
      email: sdm.email,
      emailVerified: true,
    });

    // Insert account for password
    await db.insert(schema.account).values({
      id: `acc-${sdm.id}`,
      userId: sdm.id,
      accountId: sdm.email,
      providerId: 'credential',
      password: DEFAULT_PASSWORD_HASH,
      updatedAt: new Date(),
    });

    // Insert profile
    await db.insert(schema.profiles).values({
      id: sdm.id,
      tenantId,
      email: sdm.email,
      role: sdm.role,
    });
  }
  console.log('SDM profiles seeded.');

  // 5. Seed Inventory / Bahan Baku
  console.log('Seeding inventory...');
  const inventoryFile = path.resolve(__dirname, '../../../docs/Daftar_Bahan_Baku_Martabak_dan_Terang_Bulan.md');
  const inventoryContent = fs.readFileSync(inventoryFile, 'utf-8');
  const inventoryLines = inventoryContent.split('\n');

  const parsedInventory: Array<{
    name: string;
    category: string;
    unit: string;
    stokDemak: number;
    stokPasarKembang: number;
    minStock: number;
    cost: number;
    supplier: string;
  }> = [];

  for (const line of inventoryLines) {
    if (line.trim().startsWith('|') && !line.includes('Nama Bahan Baku') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 10) {
        const name = parts[2];
        const category = parts[3];
        const unit = parts[4];
        const stokDemak = parseFloat(parts[5].replace(',', '.')) || 0;
        const stokPasarKembang = parseFloat(parts[6].replace(',', '.')) || 0;
        const minStock = parseFloat(parts[7].replace(',', '.')) || 0;
        const cost = parseMoney(parts[8].split('/')[0]);
        const supplier = parts[9].replace(/_/g, '').trim() || 'Supplier Umum';
        parsedInventory.push({ name, category, unit, stokDemak, stokPasarKembang, minStock, cost, supplier });
      }
    }
  }

  // Insert inventory records for both branches
  const inventoryMap: Record<string, Record<string, string>> = {
    [bDemak.id]: {},
    [bPasarKembang.id]: {},
  };

  for (const item of parsedInventory) {
    // Demak branch inventory
    const [invDemak] = await db.insert(schema.inventory).values({
      tenantId,
      branchId: bDemak.id,
      name: item.name,
      category: item.category,
      stock: item.stokDemak.toString(),
      minStock: item.minStock.toString(),
      unit: item.unit,
      cost: item.cost.toString(),
      supplier: item.supplier,
    }).returning();
    inventoryMap[bDemak.id][item.name] = invDemak.id;

    // Pasar Kembang branch inventory
    const [invPK] = await db.insert(schema.inventory).values({
      tenantId,
      branchId: bPasarKembang.id,
      name: item.name,
      category: item.category,
      stock: item.stokPasarKembang.toString(),
      minStock: item.minStock.toString(),
      unit: item.unit,
      cost: item.cost.toString(),
      supplier: item.supplier,
    }).returning();
    inventoryMap[bPasarKembang.id][item.name] = invPK.id;
  }
  console.log(`Inventory seeded: ${parsedInventory.length} items per branch.`);

  // 6. Seed Categories, Menu Items & Recipes (BOM)
  console.log('Seeding menu and recipes...');
  const menuFile = path.resolve(__dirname, '../../../docs/menu_items_dan_recipes_BOM.md');
  const menuContent = fs.readFileSync(menuFile, 'utf-8');
  const menuLines = menuContent.split('\n');

  // Insert Categories
  const [catMartabakTelur] = await db.insert(schema.categories).values({
    tenantId,
    name: 'Martabak Telur',
    slug: 'martabak-telur',
    sortOrder: 1,
  }).returning();

  const [catTerangBulan] = await db.insert(schema.categories).values({
    tenantId,
    name: 'Terang Bulan',
    slug: 'terang-bulan',
    sortOrder: 2,
  }).returning();

  const [catAddon] = await db.insert(schema.categories).values({
    tenantId,
    name: 'Add-on',
    slug: 'add-on',
    sortOrder: 3,
  }).returning();

  const categoriesMap = {
    'Martabak Telur': catMartabakTelur,
    'Terang Bulan': catTerangBulan,
    'Add-on': catAddon,
  };

  const parsedMenuItems: Array<{
    code: string;
    name: string;
    category: string;
    topping: string;
    tier: string;
    price: number;
  }> = [];

  let inTable1 = false;
  for (const line of menuLines) {
    if (line.includes('TABEL 1')) {
      inTable1 = true;
      continue;
    }
    if (inTable1 && line.trim().startsWith('---')) {
      inTable1 = false;
    }
    if (inTable1 && line.trim().startsWith('|') && !line.includes('menu_code') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 7) {
        const code = parts[1];
        const name = parts[2];
        const category = parts[3];
        const topping = parts[4];
        const tier = parts[5];
        const price = parseMoney(parts[6]);
        parsedMenuItems.push({ code, name, category, topping, tier, price });
      }
    }
  }

  const menuItemsMap: Record<string, schema.MenuItem> = {};

  for (const item of parsedMenuItems) {
    const categoryObj = categoriesMap[item.category as keyof typeof categoriesMap] || catMartabakTelur;
    const [insertedItem] = await db.insert(schema.menuItems).values({
      tenantId,
      categoryId: categoryObj.id,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: item.price.toString(),
      description: `Varian menu ${item.name} dengan kualitas rasa premium.`,
    }).returning();
    menuItemsMap[item.code] = insertedItem;
  }
  console.log(`Menu items seeded: ${parsedMenuItems.length} items.`);

  // Parse and seed recipes (BOM)
  console.log('Seeding recipes (BOM)...');
  const parsedRecipes: Record<string, Array<{ bahan: string; qty: number; unit: string }>> = {};
  let currentMenuCode = '';

  for (const line of menuLines) {
    if (line.trim().startsWith('|') && line.includes('**') && !line.includes('menu_code') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim());
      const rawCode = parts[1].replace(/\*\*/g, '').split(' ')[0];
      if (rawCode) {
        currentMenuCode = rawCode;
        parsedRecipes[currentMenuCode] = [];
      }
      
      const bahan = parts[2];
      const unit = parts[3];
      const qty = parseFloat(parts[4].replace(',', '.')) || 0;
      if (bahan && qty > 0) {
        parsedRecipes[currentMenuCode].push({ bahan, qty, unit });
      }
    } else if (line.trim().startsWith('|') && currentMenuCode && !line.includes('menu_code') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim());
      const bahan = parts[2];
      const unit = parts[3];
      const qty = parseFloat(parts[4].replace(',', '.')) || 0;
      if (bahan && qty > 0) {
        parsedRecipes[currentMenuCode].push({ bahan, qty, unit });
      }
    }
  }

  // Insert recipes into database
  for (const [code, ingredients] of Object.entries(parsedRecipes)) {
    const menuItem = menuItemsMap[code];
    if (!menuItem) continue;

    const [recipe] = await db.insert(schema.recipes).values({
      tenantId,
      menuItemId: menuItem.id,
      name: `BOM Resep ${menuItem.name}`,
    }).returning();

    for (const ing of ingredients) {
      await db.insert(schema.recipeIngredients).values({
        recipeId: recipe.id,
        ingredientName: ing.bahan,
        quantity: ing.qty.toString(),
        unit: ing.unit,
      });
    }
  }
  console.log('Recipes (BOM) seeded successfully.');

  // 7. Seed Approvals
  console.log('Seeding approvals...');
  const approvalData = [
    { tenantId, branchId: bDemak.id, type: 'purchase_order', title: 'Belanja Gas LPG 3kg & Daun Bawang', requestedBy: 'Dedi', amount: '120000', priority: 'medium', status: 'pending', notes: 'Sisa stok gas menipis' },
    { tenantId, branchId: bPasarKembang.id, type: 'purchase_order', title: 'Restock Kemasan Terang Bulan', requestedBy: 'Deni', amount: '280000', priority: 'high', status: 'pending', notes: 'Persediaan box tinggal 10 pcs' },
    { tenantId, branchId: bDemak.id, type: 'discount', title: 'Diskon Kemitraan Ultah Cabang 10%', requestedBy: 'Dedi', amount: '0', priority: 'low', status: 'approved', notes: 'Sudah disetujui owner via WA' },
    { tenantId, branchId: bPasarKembang.id, type: 'refund', title: 'Refund Order Terang Bulan Gosong', requestedBy: 'Deni', amount: '25000', priority: 'medium', status: 'rejected', notes: 'Salah input menu saja' },
  ];
  await db.insert(schema.approvals).values(approvalData);
  console.log('Approvals seeded.');

  // 8. Generate 90 Days of Sales History (Orders & Order Items) in Batch
  console.log('Generating 90 days of sales history in memory...');
  const today = new Date();
  const menuItemsList = Object.values(menuItemsMap);

  const allShifts: Array<any> = [];
  const allOrders: Array<any> = [];
  const allOrderItems: Array<any> = [];
  const allShiftLogs: Array<any> = [];

  for (let i = 90; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);

    for (const [branchName, branch] of Object.entries(branchesMap)) {
      const avgOrders = branchName === 'Demak' ? 22 : 11;
      const orderCount = Math.floor(avgOrders * (0.8 + Math.random() * 0.4));

      const pic = branchName === 'Demak' ? 'Dedi' : 'Deni';
      const shiftId = randomUUID();

      const openedAt = new Date(currentDate);
      openedAt.setHours(16, 0, 0, 0);

      const closedAt = new Date(currentDate);
      closedAt.setHours(23, 0, 0, 0);

      let shiftTotalSales = 0;

      for (let o = 0; o < orderCount; o++) {
        const orderTime = new Date(currentDate);
        orderTime.setHours(16 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 60), 0, 0);

        const paymentMethod = Math.random() > 0.4 ? 'qris' : 'cash';
        const numItems = Math.floor(1 + Math.random() * 3);
        const selectedItems: Array<{ item: schema.MenuItem; qty: number }> = [];
        let subtotal = 0;

        for (let k = 0; k < numItems; k++) {
          const randomItem = menuItemsList[Math.floor(Math.random() * menuItemsList.length)];
          const qty = 1;
          selectedItems.push({ item: randomItem, qty });
          subtotal += parseFloat(randomItem.price) * qty;
        }

        const discount = 0;
        const tax = Math.floor(subtotal * 0.1);
        const total = subtotal + tax - discount;

        const orderId = randomUUID();
        shiftTotalSales += total;

        allOrders.push({
          id: orderId,
          tenantId,
          branchId: branch.id,
          shiftId,
          orderCode: `ORD-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${branchName[0]}-${o + 1}`,
          customerName: 'Pelanggan Umum',
          customerPhone: '-',
          deliveryType: 'pickup',
          status: 'completed',
          subtotal: subtotal.toString(),
          totalPrice: total.toString(),
          paymentMethod,
          paymentStatus: 'paid',
          createdAt: orderTime,
        });

        for (const sel of selectedItems) {
          allOrderItems.push({
            id: randomUUID(),
            orderId,
            menuItemId: sel.item.id,
            menuItemName: sel.item.name,
            quantity: sel.qty,
            unitPrice: sel.item.price,
            totalPrice: (parseFloat(sel.item.price) * sel.qty).toString(),
          });
        }
      }

      const actualCash = 100000 + (pic === 'Dedi' ? shiftTotalSales : 0); // let's say only Demak accumulates actual cash, or adjust accordingly

      allShifts.push({
        id: shiftId,
        tenantId,
        branchId: branch.id,
        cashierId: pic === 'Dedi' ? 'u-dedi-mulyadi' : 'u-deni-setiadi',
        operatorName: pic,
        openedAt,
        closedAt,
        status: 'closed',
        startingCash: '100000',
        actualCash: actualCash.toString(),
        drift: '0',
      });

      allShiftLogs.push({
        id: randomUUID(),
        tenantId,
        shiftId,
        action: 'Close Shift',
        amount: shiftTotalSales.toString(),
        notes: `Tutup shift malam. Penjualan Rp ${shiftTotalSales.toLocaleString('id-ID')}`,
        createdAt: closedAt,
      });
    }
  }

  console.log(`Memory generation completed: ${allShifts.length} shifts, ${allOrders.length} orders, ${allOrderItems.length} order items.`);

  // Write shifts
  console.log('Writing shifts to database...');
  const CHUNK_SIZE = 100;
  for (let i = 0; i < allShifts.length; i += CHUNK_SIZE) {
    await db.insert(schema.shifts).values(allShifts.slice(i, i + CHUNK_SIZE));
  }

  // Write orders
  console.log('Writing orders to database...');
  for (let i = 0; i < allOrders.length; i += CHUNK_SIZE) {
    await db.insert(schema.orders).values(allOrders.slice(i, i + CHUNK_SIZE));
  }

  // Write order items
  console.log('Writing order items to database...');
  for (let i = 0; i < allOrderItems.length; i += CHUNK_SIZE) {
    await db.insert(schema.orderItems).values(allOrderItems.slice(i, i + CHUNK_SIZE));
  }

  // Write shift logs
  console.log('Writing shift logs to database...');
  for (let i = 0; i < allShiftLogs.length; i += CHUNK_SIZE) {
    await db.insert(schema.shiftLogs).values(allShiftLogs.slice(i, i + CHUNK_SIZE));
  }

  const totalRev = allOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);
  console.log(`Generated and inserted: ${allOrders.length} sales transactions across 90 days.`);
  console.log(`Total generated revenue: Rp ${totalRev.toLocaleString('id-ID')}`);

  console.log('Database seeding completed successfully for Martabak Terang Bulan A6 Nyuss!');
}

main().catch(err => {
  console.error('Seeding process failed:', err);
  process.exit(1);
});
