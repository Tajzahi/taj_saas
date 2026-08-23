import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { db, schema } from "@taj-saas/db";
import { and, eq } from "drizzle-orm";
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
    const storeHours = branding.openingHours || "Setiap Hari";
    const storeAddress = branding.storeAddress || "Cabang Utama";

    // Build system instructions dynamically for this tenant
    const systemInstruction = `
      Anda adalah asisten cerdas dan ramah untuk "${storeName}".
      Jawab pelanggan secara ringkas, ramah, santun, dan solutif layaknya manusia yang tulus melayani.

      Pedoman perilaku Anda:
      - **Bahasa**: Gunakan bahasa Indonesia yang santai tapi sopan (gunakan panggilan "Kak" atau "Kakak").
      - **Informasi Toko**: Toko buka ${storeHours}. Alamat: ${storeAddress}.
      - **Formatting**: Tuliskan kata-kata secara rapi dan bersahabat.
      - **Status Pesanan**: Jika pengguna menanyakan status pesanan mereka dengan menyertakan kode order (contoh: A6-XXXXXX atau POS-XXXXXX), gunakan tool "checkOrderStatus" untuk mencari statusnya di database.
      - **Keamanan & Privasi**: Jangan pernah mengembalikan nomor telepon, alamat lengkap rumah, atau data sensitif pelanggan lain di chat.
    `;

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
        tools: [
          {
            functionDeclarations: [
              {
                name: "checkOrderStatus",
                description:
                  "Mengecek status pesanan pelanggan secara realtime di database berdasarkan kode order unik",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    orderCode: {
                      type: Type.STRING,
                      description: "Kode order lengkap pesanan pelanggan",
                    },
                  },
                  required: ["orderCode"],
                },
              },
            ],
          },
        ],
      },
    });

    // Handle Function Calling
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "checkOrderStatus") {
        const { orderCode } = call.args as any;

        const candidateContent = response.candidates?.[0]?.content;
        if (!candidateContent) {
          return NextResponse.json({
            message: "Maaf, asisten sedang memproses permintaan. Silakan tanyakan kembali.",
          });
        }

        // Execute database query strictly scoped to current tenant
        let functionResult: any = { error: "Pesanan tidak ditemukan." };
        if (orderCode) {
          const cleanCode = String(orderCode).trim().toUpperCase();
          const [order] = await db
            .select({
              orderCode: schema.orders.orderCode,
              status: schema.orders.status,
              paymentStatus: schema.orders.paymentStatus,
              createdAt: schema.orders.createdAt,
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
              note: "Untuk rincian harga lengkap dan detail pesanan, silakan cek halaman Lacak Pesanan resmi.",
            };
          }
        }

        // Send function response back to Gemini
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
              parts: [
                {
                  functionResponse: {
                    name: "checkOrderStatus",
                    response: functionResult,
                  },
                },
              ],
            },
          ] as any,
          config: {
            systemInstruction,
          },
        });

        return NextResponse.json({ message: secondResponse.text || "Status pesanan berhasil diperiksa." });
      }
    }

    return NextResponse.json({ message: response.text || "Ada yang bisa saya bantu, Kak?" });
  } catch (err: unknown) {
    console.error("[chat/route] Error:", err);
    return NextResponse.json(
      { message: "Maaf, terjadi kesalahan pada layanan bantuan. Silakan hubungi kami langsung via WhatsApp." },
      { status: 500 }
    );
  }
}
