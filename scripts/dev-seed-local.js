/**
 * Seed data minimal untuk menjalankan app secara lokal (Postgres lokal, bukan Neon).
 * Dipakai untuk smoke-test/debug via Chrome DevTools Protocol.
 * Jalankan: node scripts/dev-seed-local.js
 */
const { Client } = require('pg');

const conn = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/taj';
const SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'a6-nyuss';

(async () => {
  const c = new Client({ connectionString: conn });
  await c.connect();

  const branding = {
    businessName: 'A6 Nyuss',
    brandName: 'A6 Nyuss',
    primaryColor: '#c2410c',
    secondaryColor: '#f59e0b',
    whatsappNumber: '628123456789',
    flatDeliveryFee: 10000,
    minimumOrderAmount: 20000,
    storeAddress: 'Jl. Raya Darmo No. 6, Surabaya',
    openingHours: '10:00 - 22:00',
    storeOpen: true,
    enableQris: true,
    enableBankTransfer: true,
    enableCash: true,
    taxRate: 0,
    serviceChargeRate: 0,
    outletLat: -7.2905,
    outletLng: 112.7345,
  };

  const t = await c.query(
    `INSERT INTO tenants (name, slug, domain, admin_subdomain, owner_subdomain, branding, package_type, is_active)
     VALUES ($1,$2,$3,$4,$5,$6::jsonb,'startup',true)
     ON CONFLICT (slug) DO UPDATE SET branding = EXCLUDED.branding, is_active = true
     RETURNING id`,
    ['A6 Nyuss', SLUG, `${SLUG}.localhost`, `admin.${SLUG}`, `owner.${SLUG}`, JSON.stringify(branding)]
  );
  const tenantId = t.rows[0].id;
  console.log('tenant', tenantId);

  const cats = [
    ['Martabak Manis', 'martabak-manis', 1],
    ['Martabak Telur', 'martabak-telur', 2],
    ['Minuman', 'minuman', 3],
  ];
  const catIds = {};
  for (const [name, slug, sort] of cats) {
    const r = await c.query(
      `INSERT INTO categories (tenant_id, name, slug, sort_order) VALUES ($1,$2,$3,$4)
       ON CONFLICT DO NOTHING RETURNING id`,
      [tenantId, name, slug, sort]
    );
    catIds[slug] =
      r.rows[0]?.id ||
      (await c.query('SELECT id FROM categories WHERE tenant_id=$1 AND slug=$2', [tenantId, slug])).rows[0].id;
  }

  const items = [
    ['martabak-manis', 'Martabak Coklat Keju', 'martabak-coklat-keju', 'Adonan lembut dengan coklat dan keju melimpah.', 45000, true, false],
    ['martabak-manis', 'Martabak Kacang Wijen', 'martabak-kacang-wijen', 'Klasik dengan kacang tanah dan wijen sangrai.', 38000, false, true],
    ['martabak-telur', 'Martabak Telur Sapi', 'martabak-telur-sapi', 'Isi daging sapi cincang dan daun bawang.', 50000, true, false],
    ['martabak-telur', 'Martabak Telur Ayam', 'martabak-telur-ayam', 'Isi ayam cincang gurih.', 45000, false, false],
    ['minuman', 'Es Teh Manis', 'es-teh-manis', 'Segar dingin.', 8000, false, false],
    ['minuman', 'Kopi Susu', 'kopi-susu', 'Kopi susu gula aren.', 18000, false, true],
  ];

  for (const [cat, name, slug, desc, price, best, isNew] of items) {
    const r = await c.query(
      `INSERT INTO menu_items (tenant_id, category_id, name, slug, description, price, image_url, is_available, is_best_seller, is_new)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$9)
       ON CONFLICT DO NOTHING RETURNING id`,
      [tenantId, catIds[cat], name, slug, desc, price, 'https://placehold.co/600x400/png', best, isNew]
    );
    const itemId =
      r.rows[0]?.id ||
      (await c.query('SELECT id FROM menu_items WHERE tenant_id=$1 AND slug=$2', [tenantId, slug])).rows[0].id;

    if (cat !== 'minuman') {
      await c.query(
        `INSERT INTO menu_variants (tenant_id, menu_item_id, label, required, options)
         VALUES ($1,$2,'Ukuran',true,$3::jsonb) ON CONFLICT DO NOTHING`,
        [tenantId, itemId, JSON.stringify([{ name: 'Sedang', price: 0 }, { name: 'Jumbo', price: 15000 }])]
      );
    }
  }

  await c.query(
    `INSERT INTO branches (tenant_id, name, city, address, phone, status, is_primary, accepts_online_orders, outlet_lat, outlet_lng)
     VALUES ($1,'Outlet Darmo','Surabaya','Jl. Raya Darmo No. 6','031-1234567','active',true,true,-7.2905,112.7345)
     ON CONFLICT DO NOTHING`,
    [tenantId]
  );

  await c.query(
    `INSERT INTO promos (tenant_id, code, type, value, min_order, target_category, is_active)
     VALUES ($1,'HEMAT10','percentage',10,50000,'all',true) ON CONFLICT DO NOTHING`,
    [tenantId]
  );

  const counts = await c.query(
    `SELECT (SELECT count(*) FROM categories WHERE tenant_id=$1) cats,
            (SELECT count(*) FROM menu_items WHERE tenant_id=$1) items,
            (SELECT count(*) FROM branches WHERE tenant_id=$1) branches`,
    [tenantId]
  );
  console.log(counts.rows[0]);
  await c.end();
})();
