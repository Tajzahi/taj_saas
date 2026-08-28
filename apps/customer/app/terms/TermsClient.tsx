"use client";
import Link from 'next/link';
import { FileText, Mail, MessageSquare, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
type DbStoreSettings = any;

export default function TermsClient() {
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(console.error);
  }, []);

  const storeName = settings?.store_name || "Layanan Toko Kami";
  const hours = settings?.opening_hours || "Jam Operasional Resmi Toko";

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="w-8 h-8" /> Syarat & Ketentuan
          </h1>
          <p className="text-white/80 mt-1 text-sm">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Ketentuan Umum</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dengan menggunakan layanan pemesanan online {storeName}, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku. Layanan ini dioperasikan secara resmi oleh manajemen {storeName}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Ketentuan Pemesanan</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pesanan hanya dapat dipproses selama jam operasional toko ({hours})</li>
              <li>Setiap pesanan yang diterima akan dikonfirmasi melalui notifikasi sistem & WhatsApp</li>
              <li>Pihak pengelola berhak menolak pesanan yang tidak dapat dipenuhi karena alasan operasional</li>
              <li>Pelanggan dapat melakukan pemesanan tanpa perlu registrasi akun yang rumit</li>
              <li>Informasi yang diberikan saat pemesanan harus akurat dan benar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Kebijakan Pembatalan</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pembatalan pesanan dapat dilakukan sesaat setelah pemesanan dengan menghubungi kami via WhatsApp</li>
              <li>Pesanan yang sudah dalam proses pembuatan/masak di dapur tidak dapat dibatalkan</li>
              <li>Toko berhak membatalkan pesanan jika terjadi kehabisan bahan baku mendadak atau force majeure</li>
              <li>Proses pengembalian dana dilakukan sesuai prosedur pembayaran yang dipilih</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Kebijakan Pengiriman & Pickup</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pickup: Pesanan siap diambil di gerai setelah status pesanan berubah menjadi Siap</li>
              <li>Delivery: Estimasi waktu pengiriman bervariasi tergantung jarak dan kondisi lalu lintas</li>
              <li>Ongkir dihitung berdasarkan zona pengiriman atau tarif tetap yang ditentukan toko</li>
              <li>Jika alamat tidak dapat dijangkau atau pemesan tidak merespon kurir, pesanan akan diamankan di toko</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Kebijakan Harga</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Harga yang tertera di website adalah harga terkini dan bersifat mengikat untuk pesanan yang sudah dikonfirmasi</li>
              <li>Manajemen toko berhak memperbarui daftar harga sewaktu-waktu melalui sistem admin</li>
              <li>Perubahan harga tidak mempengaruhi pesanan yang telah lunas dan terkonfirmasi sebelumnya</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Kualitas Produk & Garansi</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>{storeName} menjamin seluruh produk dibuat dari bahan baku berkualitas dan higienis</li>
              <li>Jika produk yang diterima tidak sesuai pesanan atau terdapat kerusakan, segera hubungi kami dalam 30 menit</li>
              <li>Klaim ketidaksesuaian wajib disertai bukti foto produk yang bersangkutan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Batasan Tanggung Jawab</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manajemen {storeName} tidak bertanggung jawab atas kerugian tidak langsung atau keterlambatan akibat bencana alam atau kendala teknis jaringan di luar kendali wajar. Tanggung jawab kami terbatas pada penggantian nilai pesanan yang bersangkutan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Kebijakan Privasi</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Penggunaan data pribadi Anda diatur dalam{' '}
              <Link href="/privacy" className="text-[#8E0E0E] font-medium hover:underline">Kebijakan Privasi</Link>{' '}
              kami yang menjamin keamanan data pelanggan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
