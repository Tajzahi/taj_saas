import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

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

const TOPPING_NAMES = [
  'Kacang', 'Meses', 'Keju', 'Pisang', 'Melon', 'Strawberry',
  'Selai Coklat', 'Nanas', 'Vanilla', 'Blueberry', 'Tiramisu', 'Green Tea', 'Kismis'
];

const freeToppingOptions = TOPPING_NAMES.map(name => ({ name, price: 0 }));
const extraToppingOptions = [
  { name: 'Tanpa Extra Topping', price: 0 },
  ...TOPPING_NAMES.map(name => ({ name: `Extra ${name}`, price: 5000 }))
];

async function main() {
  console.log('🚀 Starting Full Seeding into Fresh Neon Database...');

  // 1. Create or Update Tenant
  const tenantBranding = {
    brandName: 'Martabak Terang Bulan A6 Nyuss',
    businessName: 'Martabak & Terang Bulan A6 Nyuss',
    tagline: 'Nyuss Rasanya, Juara Lezatnya!',
    primaryColor: '#8E0E0E',
    secondaryColor: '#E05009',
    logoUrl: '/logo.png',
    faviconUrl: '/logo.png',
    logo: '🥞',
    socialInstagram: 'a6nyusss',
    socialFacebook: 'Martabak Nyuss',
    socialTiktok: '@a6nyuss',
    whatsappNumber: '6287811123482',
    storeAddress: 'Depan Mess DITPOLARIUD POLDA JATIM SURABAYA, Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya',
    openingHours: 'setiap hari, 17.00 - 01.00',
    storeOpen: true,
    aboutTitle: 'Tentang Martabak Terang Bulan A6 Nyuss',
    aboutStory: 'Berdiri sejak tahun 2000, Martabak & Terang Bulan A6 Nyuss menyajikan sajian martabak telur gurih renyah dan terang bulan lembut bersarang dengan aneka topping pilihan kualitas terbaik untuk pelanggan setia di Surabaya.',
    heroTitle: 'Selamat Datang di Martabak Terang Bulan A6 Nyuss',
    heroSubtitle: 'Nyuss Rasanya, Juara Lezatnya! Cita rasa otentik dan sajian berkualitas tinggi sejak 2000.',
    flatDeliveryFee: 5000,
    maxDeliveryRadiusKm: 10,
    taxRate: 0,
    taxRateBps: 0,
    serviceChargeRate: 0,
    serviceChargeRateBps: 0,
    enableCash: true,
    enableQris: true,
    enableBankTransfer: true,
    bankInfo: 'BCA 1234567890 a/n Martabak A6 Nyuss',
    receiptHeader: 'MARTABAK & TERANG BULAN A6 NYUSS',
    receiptFooter: 'Terima Kasih Atas Kunjungan Anda\nNikmati Kelezatannya!',
    receiptPaperWidth: 58,
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12224.382967100217!2d112.70217337610994!3d-7.243232041243666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e1!3m2!1sid!2sid!4v1788992972540!5m2!1sid!2sid',
    outletLat: -7.243232041243666,
    outletLng: 112.70217337610994,
  };

  let [tenant] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, 'taj-saas')).limit(1);
  if (!tenant) {
    [tenant] = await db.insert(schema.tenants).values({
      name: 'Martabak & Terang Bulan A6 Nyuss',
      slug: 'taj-saas',
      domain: 'tajsaas.com',
      adminSubdomain: 'admin',
      ownerSubdomain: 'owner',
      branding: tenantBranding,
      packageType: 'enterprise',
      isActive: true,
    }).returning();
    console.log(`✓ Tenant created: ${tenant.name} (ID: ${tenant.id})`);
  } else {
    await db.update(schema.tenants).set({
      name: 'Martabak & Terang Bulan A6 Nyuss',
      branding: tenantBranding,
      isActive: true,
    }).where(eq(schema.tenants.id, tenant.id));
    console.log(`✓ Tenant updated: ${tenant.name}`);
  }

  const tenantId = tenant.id;

  // 2. Create Branch: Demak
  let [bDemak] = await db.select().from(schema.branches).where(eq(schema.branches.tenantId, tenantId)).limit(1);
  if (!bDemak) {
    [bDemak] = await db.insert(schema.branches).values({
      tenantId,
      name: 'Demak',
      city: 'Surabaya',
      address: 'Depan Mess DITPOLARIUD POLDA JATIM SURABAYA, Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179',
      phone: '087811123482',
      picName: 'Khoirul Anam',
      outletLat: '-7.243232041243666',
      outletLng: '112.70217337610994',
      status: 'active',
      isPrimary: true,
      acceptsOnlineOrders: true,
    }).returning();
    console.log(`✓ Branch Demak created (ID: ${bDemak.id})`);
  } else {
    await db.update(schema.branches).set({
      name: 'Demak',
      address: 'Depan Mess DITPOLARIUD POLDA JATIM SURABAYA, Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179',
      phone: '087811123482',
      status: 'active',
      isPrimary: true,
      acceptsOnlineOrders: true,
    }).where(eq(schema.branches.id, bDemak.id));
    console.log(`✓ Branch Demak updated`);
  }

  // 3. Create User and Account for Owner: martabaka6nyusss@gmail.com
  // Using Better-Auth standard scrypt/argon2 hash or password hash
  const email = 'martabaka6nyusss@gmail.com';
  // Standard scrypt hash used by better-auth for "A6nyuss."
  // Better Auth stores passwords in the `account` table with providerId='credential'
  const userId = 'u-owner-a6nyuss';
  
  // Clean old user record if exists
  await db.delete(schema.session).where(eq(schema.session.userId, userId));
  await db.delete(schema.account).where(eq(schema.account.userId, userId));
  await db.delete(schema.profiles).where(eq(schema.profiles.id, userId));
  await db.delete(schema.user).where(eq(schema.user.id, userId));

  // Better-Auth format hash for "A6nyuss."
  const argonHash = 'df54b7753da54cd30cedc0246558b226:ce28044a0ee4987914ea282d0cc1eb73fd6b8d8eb126a6857d04b4c135cf548a20892cb241df4c67cc63c0ac68c62c520d914868dee9f2caa9e0c27aefe8cc27';

  await db.insert(schema.user).values({
    id: userId,
    name: 'Khoirul Anam (A6 Nyuss)',
    email,
    emailVerified: true,
    role: 'owner',
  });

  await db.insert(schema.account).values({
    id: `acc-${userId}`,
    userId,
    accountId: email,
    providerId: 'credential',
    password: argonHash,
    updatedAt: new Date(),
  });

  await db.insert(schema.profiles).values({
    id: userId,
    tenantId,
    email,
    name: 'Khoirul Anam (A6 Nyuss)',
    role: 'owner',
    status: 'active',
    salary: '0',
    branchId: bDemak.id,
  });
  console.log(`✓ Owner account ready: ${email}`);

  // Also create a cashier profile for Demak
  const cashierId = 'u-kasir-demak';
  const cashierEmail = 'kasir.demak@a6nyuss.com';
  await db.delete(schema.session).where(eq(schema.session.userId, cashierId));
  await db.delete(schema.account).where(eq(schema.account.userId, cashierId));
  await db.delete(schema.profiles).where(eq(schema.profiles.id, cashierId));
  await db.delete(schema.user).where(eq(schema.user.id, cashierId));

  await db.insert(schema.user).values({
    id: cashierId,
    name: 'Kasir Demak',
    email: cashierEmail,
    emailVerified: true,
    role: 'kasir',
  });

  await db.insert(schema.account).values({
    id: `acc-${cashierId}`,
    userId: cashierId,
    accountId: cashierEmail,
    providerId: 'credential',
    password: argonHash,
    updatedAt: new Date(),
  });

  await db.insert(schema.profiles).values({
    id: cashierId,
    tenantId,
    email: cashierEmail,
    name: 'Kasir Demak',
    role: 'kasir',
    status: 'active',
    salary: '2500000',
    branchId: bDemak.id,
  });
  console.log(`✓ Cashier account ready: ${cashierEmail}`);

  // 4. Categories
  let [catMartabak] = await db.select().from(schema.categories).where(eq(schema.categories.slug, 'martabak-telur')).limit(1);
  if (!catMartabak) {
    [catMartabak] = await db.insert(schema.categories).values({
      tenantId,
      name: 'Martabak Telur',
      slug: 'martabak-telur',
      sortOrder: 1,
    }).returning();
  }

  let [catTerangBulan] = await db.select().from(schema.categories).where(eq(schema.categories.slug, 'terang-bulan')).limit(1);
  if (!catTerangBulan) {
    [catTerangBulan] = await db.insert(schema.categories).values({
      tenantId,
      name: 'Terang Bulan',
      slug: 'terang-bulan',
      sortOrder: 2,
    }).returning();
  }
  console.log('✓ Categories ready');

  // 5. Menu Items Helper
  async function upsertMenuItem(data: {
    categoryId: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    isBestSeller?: boolean;
    isNew?: boolean;
  }) {
    let [item] = await db.select().from(schema.menuItems).where(eq(schema.menuItems.slug, data.slug)).limit(1);
    if (item) {
      await db.update(schema.menuItems).set({
        name: data.name,
        categoryId: data.categoryId,
        price: data.price.toString(),
        description: data.description,
        isBestSeller: data.isBestSeller || false,
        isNew: data.isNew || false,
        isAvailable: true,
      }).where(eq(schema.menuItems.id, item.id));
    } else {
      [item] = await db.insert(schema.menuItems).values({
        tenantId,
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        price: data.price.toString(),
        description: data.description,
        isBestSeller: data.isBestSeller || false,
        isNew: data.isNew || false,
        isAvailable: true,
      }).returning();
    }
    return item.id;
  }

  // 1. Martabak Telur Ayam
  await upsertMenuItem({
    categoryId: catMartabak.id,
    name: 'Martabak Telur Ayam',
    slug: 'martabak-telur-ayam',
    price: 20000,
    description: 'Martabak telur ayam gurih renyah dengan isian daging cincang & daun bawang segar pilihan. Tersedia varian 1 hingga 7 butir telur.',
    isBestSeller: true,
  });

  // 2. Martabak Telur Bebek
  await upsertMenuItem({
    categoryId: catMartabak.id,
    name: 'Martabak Telur Bebek',
    slug: 'martabak-telur-bebek',
    price: 20000,
    description: 'Martabak telur bebek premium yang lebih gurih, tebal, dan mantap. Tersedia varian 1 hingga 6 butir telur bebek.',
    isBestSeller: true,
  });

  // 3. Terang Bulan 2 Variant Topping
  await upsertMenuItem({
    categoryId: catTerangBulan.id,
    name: 'Terang Bulan 2 Variant Topping',
    slug: 'terang-bulan-2-variant-topping',
    price: 20000,
    description: 'Kue terang bulan lembut bersarang dengan kombinasi 2 pilihan topping favorit pilihan Anda.',
    isBestSeller: true,
  });

  // 4. Terang Bulan Milo + 1 Topping
  await upsertMenuItem({
    categoryId: catTerangBulan.id,
    name: 'Terang Bulan Milo + 1 Topping',
    slug: 'terang-bulan-milo-1-topping',
    price: 25000,
    description: 'Terang bulan dengan taburan bubuk Milo coklat lezat ditambah 1 pilihan topping.',
  });

  // 5. Terang Bulan Oreo + 1 Topping
  await upsertMenuItem({
    categoryId: catTerangBulan.id,
    name: 'Terang Bulan Oreo + 1 Topping',
    slug: 'terang-bulan-oreo-1-topping',
    price: 25000,
    description: 'Terang bulan dengan taburan remah biskuit Oreo crunchy dan 1 pilihan topping.',
  });

  // 6. Terang Bulan Nutella + 1 Topping
  await upsertMenuItem({
    categoryId: catTerangBulan.id,
    name: 'Terang Bulan Nutella + 1 Topping',
    slug: 'terang-bulan-nutella-1-topping',
    price: 30000,
    description: 'Terang bulan dengan olesan selai Nutella hazelnut premium dan 1 pilihan topping.',
    isNew: true,
  });

  // 7. Terang Bulan SilverQueen + 1 Topping
  await upsertMenuItem({
    categoryId: catTerangBulan.id,
    name: 'Terang Bulan SilverQueen + 1 Topping',
    slug: 'terang-bulan-silverqueen-1-topping',
    price: 50000,
    description: 'Terang bulan spesial dengan taburan coklat SilverQueen chunky leleh dan 1 pilihan topping.',
    isBestSeller: true,
  });

  console.log('✓ All 7 menu items seeded successfully');

  // 6. Create active shift for cashier
  const [activeShift] = await db.select().from(schema.shifts).where(eq(schema.shifts.tenantId, tenantId)).limit(1);
  if (!activeShift) {
    await db.insert(schema.shifts).values({
      tenantId,
      branchId: bDemak.id,
      operatorId: cashierId,
      operatorName: 'Kasir Demak',
      status: 'open',
      startingCash: '200000',
    });
    console.log('✓ Active shift initialized');
  }

  console.log('\n🎉 ALL MASTER DATA SEEDED SUCCESSFULLY INTO FRESH DATABASE!');
}

main().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
