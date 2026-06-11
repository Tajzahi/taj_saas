import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// ─────────────────────────────────────────────────────────────
// RATE LIMITING — Fix Critical #3
// In-memory rate limiter: max 20 request per IP per 60 detik.
// Untuk produksi skala besar, gunakan Upstash Redis / Vercel KV.
// ─────────────────────────────────────────────────────────────
const RATE_LIMIT_MAX = 20;        // maks request per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 detik

interface RateLimitEntry {
  count: number;
  resetAt: number;
}
// Map: IP string → {count, resetAt}
// Dibersihkan otomatis saat resetAt terlewati
const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    // Window baru atau sudah expired
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(ip, newEntry);
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// Bersihkan entries yang sudah expired setiap 5 menit agar tidak memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore.entries()) {
    if (val.resetAt <= now) rateLimitStore.delete(key);
  }
}, 5 * 60_000);

// ─────────────────────────────────────────────────────────────
// INPUT VALIDATION
// ─────────────────────────────────────────────────────────────
const MAX_PROMPT_LENGTH = 1000; // karakter

function sanitizePrompt(raw: unknown): { valid: boolean; prompt: string; reason?: string } {
  if (typeof raw !== 'string') {
    return { valid: false, prompt: '', reason: 'Prompt harus berupa teks.' };
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { valid: false, prompt: '', reason: 'Pesan tidak boleh kosong.' };
  }
  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      prompt: '',
      reason: `Pesan terlalu panjang (maks. ${MAX_PROMPT_LENGTH} karakter).`,
    };
  }
  // Strip karakter null bytes dan control chars berbahaya
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return { valid: true, prompt: sanitized };
}

// Helper to query order status directly (Mocked)
async function getOrderStatusFromSupabase(orderCode: string) {
  try {
    const trimmedCode = orderCode.trim().toUpperCase();
    
    // Simulate order status response
    return {
      success: true,
      orderCode: trimmedCode,
      customerName: 'Budi Pelanggan',
      status: 'Sedang Diproses (sedang dimasak di dapur)',
      statusCode: 'processing',
      deliveryType: 'Pesan Antar (Delivery)',
      deliveryAddress: 'Jl. Demak No. 100, Surabaya',
      totalPrice: 45000,
      items: 'Martabak Telur Ayam - 2 Telur x1',
      notes: 'Ekstra daun bawang ya bang'
    };
  } catch (err: any) {
    console.error('Error in chatbot checkOrderStatus:', err);
    return { error: 'Gagal menghubungi database. Silakan coba kembali nanti.' };
  }
}

// Helper to search order codes by phone number directly (Mocked)
async function findOrderCodesByPhoneFromSupabase(customerPhone: string) {
  try {
    const trimmedPhone = customerPhone.trim().replace(/\s/g, '');
    
    const list = [
      {
        orderCode: `A6-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-8812`,
        customerName: 'Pelanggan',
        date: new Date().toLocaleDateString('id-ID'),
        total: 55000,
        status: 'received'
      }
    ];

    return { success: true, orders: list };
  } catch (err: any) {
    console.error('Error in chatbot findOrderCodesByPhone:', err);
    return { error: 'Gagal menghubungi database. Silakan coba kembali nanti.' };
  }
}

export async function POST(request: Request) {
  try {
    // ── Rate Limiting: cek per IP ──────────────────────────────
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rl = checkRateLimit(ip);

    if (!rl.allowed) {
      const retryAfterSec = Math.ceil((rl.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Silakan tunggu ${retryAfterSec} detik.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
    // ──────────────────────────────────────────────────────────

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key is missing' },
        { status: 500 }
      );
    }

    // ── Input Validation & Sanitization ───────────────────────
    const body = await request.json().catch(() => ({}));
    const { valid, prompt, reason } = sanitizePrompt(body?.prompt);

    if (!valid) {
      return NextResponse.json({ error: reason }, { status: 400 });
    }
    // ──────────────────────────────────────────────────────────

    // 1. Load dynamic knowledge base from markdown files if they exist
    let markdownKnowledge = '';
    const dataDir = path.join(process.cwd(), 'src/data');

    try {
      const deliveryPath = path.join(dataDir, 'delivery_rules.md');
      if (fs.existsSync(deliveryPath)) {
        markdownKnowledge += `\n\n=== ATURAN PENGIRIMAN & ONGKIR (DOKUMEN PENJUAL) ===\n${fs.readFileSync(deliveryPath, 'utf8')}`;
      }
      const storePath = path.join(dataDir, 'store_info.md');
      if (fs.existsSync(storePath)) {
        markdownKnowledge += `\n\n=== INFORMASI TOKO & OPERASIONAL ===\n${fs.readFileSync(storePath, 'utf8')}`;
      }
      const menuPath = path.join(dataDir, 'menu_knowledge.md');
      if (fs.existsSync(menuPath)) {
        markdownKnowledge += `\n\n=== PENGETAHUAN MENU & TOPPING ===\n${fs.readFileSync(menuPath, 'utf8')}`;
      }
    } catch (e) {
      console.warn('Gagal memuat markdown knowledge base:', e);
    }

    // 2. Build system instructions
    const systemInstruction = `
      Anda adalah asisten cerdas untuk "Martabak & Terang Bulan A6 Nyuss".
      Jawab pelanggan secara ringkas, ramah, santun, dan profesional layaknya manusia yang tulus melayani.

      Pedoman perilaku Anda:
      - **Rekomendasi Menu**: Berikan menu Terang Bulan (kombinasi topping) atau Martabak Telur (pilihan daging ayam/bebek dari harga murah ke mahal).
      - **Kombinasi Topping**: Jika ditanya saran topping, berikan saran kombinasi rasa yang enak (seperti coklat + keju, pisang + coklat, dll).
      - **Bahasa**: Gunakan bahasa Indonesia yang santai tapi sopan (gunakan panggilan "Kak" atau "Kakak").
      - **Formatting**: Jangan pernah menggunakan tanda format asterisks (seperti * atau **) untuk membuat cetak tebal (bold) di dalam balasan status pesanan atau teks pembatalan. Tuliskan kata-kata secara biasa dan rapi agar ramah dibaca manusia.
      - **Ketentuan Pembatalan**: Pesanan hanya bisa dibatalkan secara mandiri di halaman Lacak Pesanan jika statusnya belum masuk ke tahap "Siap Diambil / Diantar" (atau status database: ready/completed).
      - **Lupa Kode Pesanan**: Jika pelanggan lupa atau kehilangan kode pesanan mereka:
        1. Arahkan mereka dengan sangat ramah untuk pergi ke halaman Lacak Pesanan (/tracking).
        2. Jelaskan bahwa di halaman tersebut ada kolom khusus "Cari Kode (Lupa Kode?)" di mana mereka tinggal memasukkan nomor HP yang digunakan saat memesan untuk memunculkan riwayat kode pesanan mereka.
        3. Jika pelanggan memberikan nomor HP langsung kepada Anda di obrolan ini, Anda bisa membantunya mencari menggunakan fungsi "findOrderCodesByPhone" untuk mencarikan kode pesanan terkait secara otomatis.
      
      Jika pengguna menanyakan status pesanan mereka atau ingin melacak pesanan (misal menyertakan kode order seperti A6-XXXXXX):
      1. Beritahukan dengan ramah bahwa Anda akan membantu mencarikan data tersebut.
      2. Gunakan fungsi "checkOrderStatus" untuk mengambil status rill pesanan dari database.
      3. Laporkan hasilnya secara ringkas and ramah kepada pelanggan berdasarkan data rill dari fungsi tersebut. Jangan pernah mengarang kode pesanan atau status.
      
      Pengetahuan tambahan dari admin toko (jika ada):
      ${markdownKnowledge || 'Toko buka Setiap Hari pukul 17:00 - 01:00. Alamat: Jl. Demak Surabaya.'}
    `;

    // 3. First Generation Call to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [
          {
            functionDeclarations: [
              {
                name: 'checkOrderStatus',
                description: 'Mengecek status pesanan pelanggan secara realtime di database berdasarkan kode order unik (contoh: A6-20260101-1234)',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    orderCode: {
                      type: Type.STRING,
                      description: 'Kode order lengkap pesanan pelanggan yang diawali dengan A6-'
                    }
                  },
                  required: ['orderCode']
                }
              },
              {
                name: 'findOrderCodesByPhone',
                description: 'Mencari kode pesanan pelanggan di database berdasarkan nomor HP yang digunakan saat melakukan pemesanan (contoh: 081234567890)',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    customerPhone: {
                      type: Type.STRING,
                      description: 'Nomor HP lengkap pelanggan saat melakukan checkout'
                    }
                  },
                  required: ['customerPhone']
                }
              }
            ]
          }
        ]
      }
    });

    // 4. Handle Function Calling if requested by Gemini
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'checkOrderStatus') {
        const { orderCode } = call.args as any;
        
        const candidateContent = response.candidates?.[0]?.content;
        if (!candidateContent) {
          return NextResponse.json({ message: 'Maaf, asisten sedang memproses permintaan. Silakan tanyakan kembali.' });
        }

        // Execute Supabase function
        const orderResult = await getOrderStatusFromSupabase(orderCode);
        
        // Send the function response back to Gemini to generate the final response
        const secondResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: prompt }] },
            candidateContent, // Send the model's function call request back
            {
              role: 'tool',
              parts: [
                {
                  functionResponse: {
                    name: 'checkOrderStatus',
                    response: { result: orderResult }
                  }
                }
              ]
            }
          ] as any,
          config: {
            systemInstruction: systemInstruction
          }
        });

        return NextResponse.json({ message: secondResponse.text });
      } else if (call.name === 'findOrderCodesByPhone') {
        const { customerPhone } = call.args as any;
        
        const candidateContent = response.candidates?.[0]?.content;
        if (!candidateContent) {
          return NextResponse.json({ message: 'Maaf, asisten sedang memproses permintaan. Silakan tanyakan kembali.' });
        }

        // Execute Supabase function
        const searchResult = await findOrderCodesByPhoneFromSupabase(customerPhone);
        
        // Send the function response back to Gemini to generate the final response
        const secondResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: prompt }] },
            candidateContent, // Send the model's function call request back
            {
              role: 'tool',
              parts: [
                {
                  functionResponse: {
                    name: 'findOrderCodesByPhone',
                    response: { result: searchResult }
                  }
                }
              ]
            }
          ] as any,
          config: {
            systemInstruction: systemInstruction
          }
        });

        return NextResponse.json({ message: secondResponse.text });
      }
    }

    // Standard conversational response
    return NextResponse.json({ message: response.text });
  } catch (error: any) {
    console.error('AI Chatbot API Error (Graceful Fallback):', error);
    
    // Graceful fallback message to assist user and avoid 500 error page
    const fallbackMessage = 
      "Halo! Mohon maaf, saat ini asisten AI kami sedang mengalami kendala koneksi atau batas kuota. " +
      "Untuk bantuan langsung mengenai pesanan, ketersediaan menu, atau status order, silakan hubungi " +
      "admin kami via WhatsApp di nomor +6287811123482. Terima kasih atas pengertiannya! 🙏";
      
    return NextResponse.json({ message: fallbackMessage });
  }
}
