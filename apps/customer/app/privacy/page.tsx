"use client";
import Link from 'next/link';
import { FileText, Mail, MessageSquare, MapPin } from 'lucide-react';


export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="w-8 h-8" /> Kebijakan Privasi
          </h1>
          <p className="text-white/80 mt-1 text-sm">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 prose prose-gray max-w-none">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Data yang Kami Kumpulkan</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dalam rangka memproses pesanan Anda, kami mengumpulkan data berikut:
            </p>
            <ul className="text-gray-600 text-sm space-y-1 mt-2 list-disc list-inside">
              <li><strong>Nama lengkap</strong> — untuk identifikasi pesanan</li>
              <li><strong>Nomor WhatsApp</strong> — untuk konfirmasi dan komunikasi pesanan</li>
              <li><strong>Alamat pengiriman</strong> — hanya untuk pesanan delivery</li>
              <li><strong>Detail pesanan</strong> — menu, jumlah, total harga</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Cara Kami Menggunakan Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Data yang Anda berikan hanya digunakan untuk:</p>
            <ul className="text-gray-600 text-sm space-y-1 mt-2 list-disc list-inside">
              <li>Memproses dan menyelesaikan pesanan Anda</li>
              <li>Menghubungi Anda terkait status pesanan</li>
              <li>Konfirmasi pengiriman dan pickup</li>
              <li>Merespons pertanyaan dan keluhan Anda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Kerahasiaan Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Kami berkomitmen untuk menjaga kerahasiaan data Anda. <strong>Data Anda tidak akan dibagikan, dijual, atau dipinjamkan kepada pihak ketiga</strong> manapun tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum yang berlaku di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Penyimpanan Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Data pesanan disimpan secara lokal di perangkat Anda (browser storage) untuk keperluan tracking pesanan. Data ini tidak dikirimkan ke server eksternal dan akan otomatis terhapus saat Anda membersihkan data browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Hak Anda atas Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Anda memiliki hak untuk:</p>
            <ul className="text-gray-600 text-sm space-y-1 mt-2 list-disc list-inside">
              <li>Mengetahui data apa yang kami simpan tentang Anda</li>
              <li>Meminta penghapusan data Anda dari sistem kami</li>
              <li>Menolak penggunaan data untuk tujuan tertentu</li>
            </ul>
            <p className="text-gray-600 text-sm mt-2">
              Untuk mengajukan permintaan tersebut, hubungi kami di <a href="mailto:martabaka6nyusss@gmail.com" className="text-[#8E0E0E] font-medium">martabaka6nyusss@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Cookie & Teknologi Tracking</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Website kami menggunakan localStorage browser untuk menyimpan data keranjang belanja dan pesanan Anda secara lokal. Kami tidak menggunakan cookie tracking pihak ketiga atau iklan bertarget.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Perubahan Kebijakan</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diumumkan melalui website atau WhatsApp. Penggunaan layanan kami setelah perubahan dianggap sebagai persetujuan terhadap kebijakan baru.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Hubungi Kami</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Jika ada pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami:
            </p>
            <ul className="text-gray-600 text-sm space-y-2 mt-3">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span>Silakan hubungi layanan pelanggan resmi kami melalui menu <Link href="/contact" className="text-[#8E0E0E] font-bold hover:underline">Kontak & WhatsApp</Link>.</span>
              </li>
            </ul>
          </section>

          <div className="border-t pt-4">
            <Link href="/terms" className="text-[#8E0E0E] text-sm font-medium hover:underline">
              Lihat juga: Syarat & Ketentuan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
