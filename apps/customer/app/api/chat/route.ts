import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { db, schema } from "@taj-saas/db";
import { and, eq, ilike, or } from "drizzle-orm";
import { resolveTenantFromRequestHost } from "@lib/tenant-authorization";
import { rateLimiter } from "@lib/server/rate-limiter";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MAX_PROMPT_LENGTH = 1000;

function sanitizePrompt(raw: unknown): { valid: boolean; prompt: string; reason?: string } {
  if (typeof raw !== "string") {
    return { valid: false, prompt: "", reason: "Prompt harus berupa teks." };
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { valid: false, prompt: "", reason: "Pesan tidak boleh kosong." };
  }
  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      prompt: "",
      reason: `Pesan terlalu panjang (maksimal ${MAX_PROMPT_LENGTH} karakter).`,
    };
  }
  // Sanitize control characters
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return { valid: true, prompt: sanitized };
}

export async function POST(request: Request) {
  try {
    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    // Distributed Rate Limiting (SEC-007)
    const rateResult = await rateLimiter.check(clientIp, "customer_chat");
    if (!rateResult.allowed) {
      return NextResponse.json(
        { message: "Terlalu banyak pesan. Silakan tunggu beberapa detik sebelum mengirim pesan lagi." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const { valid, prompt, reason } = sanitizePrompt(body?.prompt);
    if (!valid) {
      return NextResponse.json({ message: reason || "Input tidak valid." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        message: `Halo! Selamat datang di ${tenant.name}. Asisten AI saat ini sedang offline, silakan hubungi admin kami melalui WhatsApp.`,
      });
    }

    const branding = tenant.branding || {};
    const storeName = branding.businessName || tenant.name;
    const storeHours = branding.openingHours || "Setiap Hari (08:00 - 22:00)";
    const storeAddress = branding.storeAddress || "Cabang Utama";
    const waNumber = branding.whatsappNumber || "-";

    // Build system instructions dynamically for this tenant
    const systemInstruction = `
      Anda adalah Asisten Virtual resmi dan cerdas untuk "${storeName}".
      Tugas utama Anda adalah melayani pelanggan dengan ramah, santun, solutif, dan cepat layaknya staf profesional.

      Pedoman perilaku & gaya komunikasi:
      - **Gaya Bicara**: Gunakan bahasa Indonesia yang ramah, sopan, dan hangat. Sapa pelanggan dengan panggilan "Kak" atau "Kakak".
      - **Informasi Toko**:
        * Nama Toko: ${storeName}
        * Jam Buka Utama: ${storeHours}
        * Alamat: ${storeAddress}
        * WhatsApp Bantuan: ${waNumber}
      - **Integrasi Database (Gunakan Tools yang Disediakan)**:
        1. **Melihat/Rekomendasi Menu**: Selalu gunakan tool "getAvailableMenu" untuk melihat daftar menu, harga resmi, dan status ketersediaan saat pelanggan bertanya tentang menu, rekomendasi, harga, atau varian. JANGAN MENGARANG MENU YANG TIDAK ADA DI DATABASE!
        2. **Cek Promo/Diskon**: Gunakan tool "getActivePromos" saat pelanggan menanyakan promo, diskon, atau kupon voucher yang berlaku hari ini.
        3. **Informasi Cabang & Lokasi**: Gunakan tool "getBranches" saat pelanggan menanyakan lokasi cabang lain, kota, atau link Google Maps.
        4. **Status Pesanan**: Gunakan tool "checkOrderStatus" jika pelanggan menyertakan kode order (misal: A6-XXXXXX atau POS-XXXXXX).
      - **Privasi & Keamanan**: Jangan pernah membeberkan nomor telepon, alamat rumah pribadi, atau data transaksi pelanggan lain.
      - **Call to Action**: Setelah menjawab menu atau promo, ajak pelanggan dengan santun untuk memesan langsung melalui tombol menu di website atau WhatsApp.
    `;

    // Tool declarations
    const tools = [
      {
        functionDeclarations: [
          {
            name: "checkOrderStatus",
            description: "Mengecek status pesanan pelanggan secara realtime di database berdasarkan kode order unik",
            parameters: {
              type: Type.OBJECT,
              properties: {
                orderCode: {
                  type: Type.STRING,
                  description: "Kode order unik pesanan pelanggan",
                },
              },
              required: ["orderCode"],
            },
          },
          {
            name: "getAvailableMenu",
            description: "Mengambil daftar menu makanan/minuman aktif, harga resmi, dan status ketersediaan dari database restoran",
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: {
                  type: Type.STRING,
                  description: "Kata kunci pencarian menu makanan/minuman (opsional)",
                },
              },
            },
          },
          {
            name: "getActivePromos",
            description: "Mengambil daftar kupon diskon dan promo yang sedang aktif dan berlaku hari ini",
            parameters: {
              type: Type.OBJECT,
              properties: {},
            },
          },
          {
            name: "getBranches",
            description: "Mengambil daftar seluruh cabang resmi, alamat lengkap, kota, jam buka, dan link Google Maps",
            parameters: {
              type: Type.OBJECT,
              properties: {},
            },
          },
        ],
      },
    ];

    // First Generation Call to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        } as any,
      ],
      config: {
        systemInstruction,
        tools,
      },
    });

    // Handle Function Calling if Gemini requested database tools
    if (response.functionCalls && response.functionCalls.length > 0) {
      const candidateContent = response.candidates?.[0]?.content;
      if (!candidateContent) {
        return NextResponse.json({
          message: "Maaf, asisten sedang memproses permintaan. Silakan tanyakan kembali.",
        });
      }

      const functionResponseParts = await Promise.all(
        response.functionCalls.map(async (call) => {
          let functionResult: any = { error: "Fungsi tidak ditemukan" };

          // 1. Tool checkOrderStatus
          if (call.name === "checkOrderStatus") {
            const { orderCode } = (call.args as any) || {};
            if (orderCode) {
              const cleanCode = String(orderCode).trim().toUpperCase();
              const [order] = await db
                .select({
                  orderCode: schema.orders.orderCode,
                  status: schema.orders.status,
                  paymentStatus: schema.orders.paymentStatus,
                  createdAt: schema.orders.createdAt,
                  totalPrice: schema.orders.totalPrice,
                })
                .from(schema.orders)
                .where(and(eq(schema.orders.orderCode, cleanCode), eq(schema.orders.tenantId, tenant.id)))
                .limit(1);

              if (order) {
                functionResult = {
                  found: true,
                  orderCode: order.orderCode,
                  status: order.status,
                  paymentStatus: order.paymentStatus,
                  orderDate: order.createdAt.toISOString(),
                  totalPrice: order.totalPrice,
                  note: "Pesanan ditemukan di sistem.",
                };
              } else {
                functionResult = { found: false, error: `Pesanan dengan kode ${cleanCode} tidak ditemukan.` };
              }
            }
          }

          // 2. Tool getAvailableMenu
          else if (call.name === "getAvailableMenu") {
            const { query } = (call.args as any) || {};
            let conditions = [
              eq(schema.menuItems.tenantId, tenant.id),
              eq(schema.menuItems.isAvailable, true),
            ];

            if (query && typeof query === "string" && query.trim().length > 0) {
              const searchPattern = `%${query.trim()}%`;
              const filterOr = or(
                ilike(schema.menuItems.name, searchPattern),
                ilike(schema.menuItems.description, searchPattern)
              );
              if (filterOr) {
                conditions.push(filterOr);
              }
            }

            const items = await db
              .select({
                name: schema.menuItems.name,
                price: schema.menuItems.price,
                description: schema.menuItems.description,
                isBestSeller: schema.menuItems.isBestSeller,
                isNew: schema.menuItems.isNew,
                variants: schema.menuItems.variants,
              })
              .from(schema.menuItems)
              .where(and(...conditions))
              .limit(15);

            functionResult = {
              totalFound: items.length,
              menuList: items.map((m) => ({
                nama: m.name,
                harga: `Rp ${Number(m.price).toLocaleString("id-ID")}`,
                keterangan: m.description || "-",
                unggulan: m.isBestSeller ? "Best Seller" : m.isNew ? "Menu Baru" : "Standar",
              })),
            };
          }

          // 3. Tool getActivePromos
          else if (call.name === "getActivePromos") {
            const activePromos = await db
              .select({
                code: schema.promos.code,
                type: schema.promos.type,
                value: schema.promos.value,
                minOrder: schema.promos.minOrder,
                expiresAt: schema.promos.expiresAt,
              })
              .from(schema.promos)
              .where(and(eq(schema.promos.tenantId, tenant.id), eq(schema.promos.isActive, true)))
              .limit(5);

            functionResult = {
              availablePromos: activePromos.map((p) => ({
                kodeKupon: p.code,
                diskon: p.type === "percent" ? `${p.value}%` : `Rp ${Number(p.value).toLocaleString("id-ID")}`,
                minimalBelanja: `Rp ${Number(p.minOrder).toLocaleString("id-ID")}`,
                berlakuHingga: p.expiresAt ? p.expiresAt.toISOString().split("T")[0] : "Selama persediaan ada",
              })),
            };
          }

          // 4. Tool getBranches
          else if (call.name === "getBranches") {
            const activeBranches = await db
              .select({
                name: schema.branches.name,
                city: schema.branches.city,
                address: schema.branches.address,
                phone: schema.branches.phone,
                googleMapsUrl: schema.branches.googleMapsUrl,
                operationalHours: schema.branches.operationalHours,
              })
              .from(schema.branches)
              .where(and(eq(schema.branches.tenantId, tenant.id), eq(schema.branches.status, "active")))
              .limit(10);

            functionResult = {
              branches: activeBranches.map((b) => ({
                namaCabang: b.name,
                kota: b.city,
                alamat: b.address || "-",
                telepon: b.phone || "-",
                linkMaps: b.googleMapsUrl || "-",
                jamBuka: b.operationalHours || "08:00 - 22:00",
              })),
            };
          }

          return {
            functionResponse: {
              name: call.name,
              response: functionResult,
            },
          };
        })
      );

      // Send function execution results back to Gemini for the final cohesive answer
      const secondResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
          candidateContent,
          {
            role: "tool",
            parts: functionResponseParts,
          },
        ] as any,
        config: {
          systemInstruction,
        },
      });

      return NextResponse.json({ message: secondResponse.text || "Informasi berhasil ditemukan." });
    }

    return NextResponse.json({ message: response.text || "Ada yang bisa saya bantu, Kak?" });
  } catch (err: unknown) {
    console.error("[chat/route] Error:", err);
    return NextResponse.json(
      { message: "Maaf, terjadi kendala teknis pada layanan asisten AI. Silakan hubungi kami via WhatsApp." },
      { status: 500 }
    );
  }
}
