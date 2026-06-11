"use client";
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Bookmark, CreditCard, Truck, Flame, MessageSquare, MapPin } from 'lucide-react';


interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  label: string;
  icon: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    label: 'Umum',
    icon: 'Bookmark',
    items: [
      { q: 'Jam operasional A6 Nyuss?', a: 'Setiap Hari: 17:00–01:00. Kami buka setiap hari kecuali ada pengumuman khusus via WhatsApp atau Instagram.' },
      { q: 'Apakah A6 Nyuss sudah halal?', a: 'Ya! Seluruh bahan baku dan proses pembuatan A6 Nyuss telah bersertifikat halal. Aman dan nyaman untuk seluruh keluarga Muslim.' },
      { q: 'Sejak kapan A6 Nyuss berdiri?', a: 'A6 Nyuss berdiri sejak tahun 2000. Kami telah melayani warga Surabaya selama lebih dari 25 tahun dengan cita rasa yang konsisten.' },
      { q: 'Di mana lokasi A6 Nyuss?', a: 'Kami berlokasi di Depan Mess DITPOLARIUD POLDA JATIM SURABAYA, Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179. Mudah ditemukan dan strategis!' },
    ],
  },
  {
    label: 'Order & Pembayaran',
    icon: 'CreditCard',
    items: [
      { q: 'Bagaimana cara pesan online?', a: 'Sangat mudah! Pilih menu yang kamu inginkan → Tambah ke keranjang → Isi data & pilih pickup/delivery → Checkout. Selesai! Kamu akan dapat kode order untuk tracking.' },
      { q: 'Apakah harus punya akun untuk pesan?', a: 'Tidak perlu! Kamu bisa langsung pesan hanya dengan mengisi nama dan nomor WhatsApp. Simpel dan cepat tanpa registrasi.' },
      { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menyediakan metode pembayaran yang fleksibel sesuai jenis pesanan Anda: (1) Untuk Pickup (ambil di gerai), kami menerima Tunai dan QRIS. (2) Untuk Delivery (pesan antar), kami menerima Tunai COD dan QRIS.' },
      { q: 'Bagaimana cara melacak pesanan?', a: 'Setelah checkout, kamu akan mendapat kode order (contoh: A6-20260101-1234). Gunakan kode tersebut di halaman Tracking untuk melihat status pesanan secara real-time.' },
      { q: 'Bisa pesan via WhatsApp?', a: 'Bisa! Klik tombol WhatsApp di website kami atau langsung hubungi 0878-1112-3482. Tim kami siap membantu.' },
      { q: 'Apakah ada minimum order?', a: 'Tidak ada minimum order untuk pickup. Untuk delivery, minimum order Rp 30.000 (belum termasuk ongkir).' },
    ],
  },
  {
    label: 'Pengiriman',
    icon: 'Truck',
    items: [
      { q: 'Area delivery sampai mana?', a: 'Kami melayani delivery di wilayah Surabaya dan sekitarnya dalam radius 10 km dari toko. Hubungi kami via WhatsApp untuk konfirmasi area Anda.' },
      { q: 'Berapa ongkir pengirimannya?', a: 'Zona 1 (0–3 km): Rp 8.000 | Zona 2 (3–6 km): Rp 13.000 | Zona 3 (6–10 km): Rp 18.000. Ongkir dihitung saat checkout.' },
      { q: 'Bisa pickup / ambil sendiri?', a: 'Bisa dan dianjurkan! Pickup lebih hemat (gratis ongkir) dan pesanan biasanya siap dalam ~20 menit. Cukup tunjukkan kode order di toko.' },
      { q: 'Berapa lama estimasi delivery?', a: 'Estimasi delivery adalah ~40 menit dari waktu order dikonfirmasi, tergantung kondisi lalu lintas. Pickup sekitar ~20 menit.' },
    ],
  },
  {
    label: 'Produk',
    icon: 'Flame',
    items: [
      { q: 'Ada varian menu apa saja?', a: 'Kami menyediakan: Terang Bulan (coklat keju, keju full, kacang, original wijen), Martabak Telur Ayam, Martabak Telur Bebek (biasa, spesial, istimewa, super), Paket Bundling, dan Minuman.' },
      { q: 'Bisa request custom?', a: 'Bisa! Saat pemesanan, ada kolom catatan khusus. Tulis preferensi kamu seperti "extra pedas", "tanpa bawang", "keju double", dsb. Kami akan berusaha mengakomodasi.' },
      { q: 'Apakah produk dibuat fresh?', a: 'Ya! Semua produk kami dibuat fresh setiap saat menggunakan bahan-bahan segar pilihan. Tidak ada produk yang dipanaskan ulang.' },
      { q: 'Bagaimana jika menu yang dipesan habis?', a: 'Tim kami akan segera menghubungi kamu via WhatsApp untuk konfirmasi dan menawarkan alternatif atau refund penuh.' },
    ],
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{item.q}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#8E0E0E] flex-shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`}
            />
          </button>
          {openIdx === idx && (
            <div className="px-4 pb-4 border-t border-gray-50">
              <p className="text-gray-600 text-sm leading-relaxed pt-3">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">FAQ</h1>
          <p className="text-white/80">Pertanyaan yang sering ditanyakan pelanggan kami</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {faqData.map((cat, idx) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(idx)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === idx
                  ? 'bg-[#8E0E0E] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="flex items-center">
                {cat.icon === 'Bookmark' && <Bookmark className="w-4 h-4" />}
                {cat.icon === 'CreditCard' && <CreditCard className="w-4 h-4" />}
                {cat.icon === 'Truck' && <Truck className="w-4 h-4" />}
                {cat.icon === 'Flame' && <Flame className="w-4 h-4" />}
              </span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <FAQAccordion items={faqData[activeCategory].items} />

        {/* Still have questions */}
        <div className="mt-10 bg-gradient-to-br from-[#8E0E0E]/10 to-[#E05009]/5 border border-[#8E0E0E]/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#8E0E0E]/10 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-[#8E0E0E]" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Masih ada pertanyaan?</h3>
          <p className="text-gray-600 text-sm mb-4">Tim kami siap membantu via WhatsApp setiap hari selama jam operasional</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20bertanya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Chat WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <MapPin className="w-4 h-4" /> Lihat Kontak
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
