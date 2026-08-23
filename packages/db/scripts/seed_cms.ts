import { db, schema } from '../index';
import { eq } from 'drizzle-orm';

async function main() {
  let tenants = await db.select().from(schema.tenants).limit(1);
  let tenant: any;
  if (tenants.length === 0) {
  let users = await db.select().from(schema.user).where(eq(schema.user.email, 'a6nyusss@gmail.com')).limit(1);
  let createdUser: any;
  if (users.length === 0) {
    const [u] = await db.insert(schema.user).values({
      id: 'owner_anam_01',
      name: 'Khoirul Anam',
      email: 'a6nyusss@gmail.com',
      emailVerified: true,
      role: 'owner',
    }).returning();
    createdUser = u;
  } else {
    createdUser = users[0];
  }

    const [createdTenant] = await db.insert(schema.tenants).values({
      name: 'Martabak A6 Nyuss',
      slug: 'taj-saas',
      domain: 'taj-saas.local',
      adminSubdomain: 'admin',
      ownerSubdomain: 'owner',
      isActive: true,
    }).returning();

    await db.insert(schema.profiles).values({
      id: createdUser.id,
      tenantId: createdTenant.id,
      role: 'owner',
      phone: '087811123482',
    });

    tenant = createdTenant;
  } else {
    tenant = tenants[0];
  }

  // 1. Update branding with 100% full CMS content
  await db.update(schema.tenants).set({
    branding: {
      businessName: 'Martabak A6 Nyuss',
      brandName: 'A6 Nyuss',
      tagline: 'Martabak & Terang Bulan Spesial Sejak 2000',
      whatsappNumber: '6287811123482',
      storeAddress: 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179',
      openingHours: 'Setiap Hari: 17:00 – 01:00',
      taxRateBps: 1000,
      serviceChargeRateBps: 0,
      flatDeliveryFee: 8000,
      storeOpen: true,
      qrisImageUrl: '/qris.png',
      bankInfo: 'BCA 123-456-7890 a/n Martabak A6 Nyuss',
      outletLat: -7.2432537,
      outletLng: 112.7206275,
      heroTitle: 'Martabak & Terang Bulan Spesial',
      heroSubtitle: 'Cita rasa otentik khas Surabaya sejak tahun 2000. Dibuat dengan bahan pilihan dan resep turun-temurun.',
      heroBadgeText: 'Authentic Indonesian Taste Since 2000',
      aboutTitle: 'Cerita di Balik A6 Nyuss',
      aboutStory: 'Tahun 2000, dengan modal tekad dan resep keluarga yang kuat, kami memulai perjalanan kuliner di sudut Jalan Demak, Surabaya. Berawal dari gerobak sederhana, kami terus berkomitmen menjaga keaslian rasa dan kualitas bahan baku terbaik hingga kini.',
      aboutHighlights: ['100% Halal Certified', 'Bahan Baku Fresh Setiap Hari', 'Resep Asli Turun-Temurun 25 Tahun', 'Pelayanan Ramah & Higienis'],
      faqs: [
        { id: '1', question: 'Apakah adonan dibuat setiap hari?', answer: 'Ya, 100% segar setiap hari tanpa bahan pengawet.', category: 'Produk' },
        { id: '2', question: 'Berapa radius pengiriman delivery?', answer: 'Kami melayani pesan antar hingga radius 10 km dengan perhitungan ongkir otomatis.', category: 'Pengiriman' },
      ],
      cateringPackages: [
        { id: '1', name: 'Paket Pesta Kemerdekaan', minPortion: 15, pricePerPortion: 20000, description: '10 Martabak Telur Spesial + 5 Terang Bulan Coklat Keju' },
        { id: '2', name: 'Paket Kantor & Gathering', minPortion: 30, pricePerPortion: 22000, description: 'Porsi hemat untuk acara kantor, ulang tahun, dan arisan keluarga.' }
      ],
      gallery: [
        { id: '1', src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop', category: 'Martabak Viral TikTok', caption: 'Sensasi lumer coklat keju yang viral di TikTok!' },
        { id: '2', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', category: 'Produk', caption: 'Martabak Telur Ayam Spesial Daging Gurih' }
      ]
    }
  }).where(eq(schema.tenants.id, tenant.id));

  // 2. Create Branch
  const [branch] = await db.insert(schema.branches).values({
    tenantId: tenant.id,
    name: 'Cabang Pusat Demak Surabaya',
    code: 'DEMAK-01',
    address: 'Jl. Demak No.253, Dupak, Krembangan, Surabaya',
    city: 'Surabaya',
    phone: '087811123482',
    isActive: true,
  }).returning();

  // 3. Create Category
  const [catMartabak] = await db.insert(schema.categories).values({
    tenantId: tenant.id,
    name: 'Martabak Telur',
    slug: 'martabak-telur',
    sortOrder: 1,
  }).returning();

  const [catTerbul] = await db.insert(schema.categories).values({
    tenantId: tenant.id,
    name: 'Terang Bulan',
    slug: 'terang-bulan',
    sortOrder: 2,
  }).returning();

  // 4. Create Menu Items
  const [menu1] = await db.insert(schema.menuItems).values({
    tenantId: tenant.id,
    categoryId: catMartabak.id,
    name: 'Martabak Telur Ayam Spesial',
    slug: 'martabak-telur-ayam-spesial',
    description: 'Martabak telur dengan isian daging ayam cincang gurih dan daun bawang segar.',
    price: '35000.00',
    costPrice: '15000.00',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
    isAvailable: true,
    sortOrder: 1,
  }).returning();

  const [menu2] = await db.insert(schema.menuItems).values({
    tenantId: tenant.id,
    categoryId: catTerbul.id,
    name: 'Terang Bulan Coklat Keju Lumer',
    slug: 'terang-bulan-coklat-keju-lumer',
    description: 'Terang bulan tebal lembut dengan taburan meses coklat premium dan parutan keju melimpah.',
    price: '30000.00',
    costPrice: '12000.00',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop',
    isAvailable: true,
    sortOrder: 2,
  }).returning();

  // 5. Create Promo MERDEKA20
  const [promo] = await db.insert(schema.promos).values({
    tenantId: tenant.id,
    code: 'MERDEKA20',
    type: 'percent',
    value: '20.00',
    minOrder: '30000.00',
    targetCategory: 'all',
    isActive: true,
  }).returning();

  console.log('SUCCESSFULLY_INITIALIZED:', {
    tenant: tenant.name,
    branch: branch.name,
    categories: [catMartabak.name, catTerbul.name],
    menus: [menu1.name, menu2.name],
    promo: promo.code,
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
