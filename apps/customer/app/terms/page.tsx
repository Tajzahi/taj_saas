"use client";
import Link from 'next/link';
import { FileText, Mail, MessageSquare, MapPin } from 'lucide-react';


export default function Terms() {
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
              Dengan menggunakan layanan pemesanan online Martabak & Terang Bulan A6 Nyuss, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku. Layanan ini dioperasikan oleh A6 Nyuss yang berkedudukan di Surabaya, Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Ketentuan Pemesanan</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pesanan hanya dapat dilakukan selama jam operasional toko (Setiap Hari: 17:00–01:00)</li>
              <li>Setiap pesanan yang diterima akan dikonfirmasi melalui WhatsApp</li>
              <li>A6 Nyuss berhak menolak pesanan yang tidak dapat dipenuhi</li>
              <li>Pelanggan tidak perlu membuat akun untuk melakukan pemesanan</li>
              <li>Informasi yang diberikan saat pemesanan harus akurat dan benar</li>
              <li>Minimum order untuk delivery adalah Rp 30.000 (belum termasuk ongkir)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Kebijakan Pembatalan</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pembatalan pesanan dapat dilakukan dalam 5 menit setelah pemesanan dengan menghubungi kami via WhatsApp</li>
              <li>Pesanan yang sudah dalam proses pembuatan tidak dapat dibatalkan</li>
              <li>A6 Nyuss berhak membatalkan pesanan jika terjadi kehabisan bahan atau force majeure</li>
              <li>Refund dilakukan dalam 1–3 hari kerja untuk pembayaran transfer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Kebijakan Pengiriman & Pickup</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pickup: Pesanan siap diambil dalam ~20 menit setelah dikonfirmasi</li>
              <li>Delivery: Estimasi pengiriman ~40 menit, dapat bervariasi tergantung kondisi lalu lintas</li>
              <li>Ongkir dihitung berdasarkan zona pengiriman yang dipilih saat checkout</li>
              <li>Jika alamat tidak dapat dijangkau atau tidak ditemukan, pesanan akan dikembalikan ke toko</li>
              <li>A6 Nyuss tidak bertanggung jawab atas keterlambatan yang disebabkan oleh kondisi luar biasa (banjir, kemacetan parah, dll.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Kebijakan Harga</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Harga yang tertera di website adalah harga terkini dan bersifat mengikat untuk pesanan yang sudah dikonfirmasi</li>
              <li>A6 Nyuss berhak mengubah harga sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
              <li>Perubahan harga tidak berlaku untuk pesanan yang sudah dikonfirmasi sebelum perubahan</li>
              <li>Harga sudah termasuk PPN jika berlaku</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Kualitas Produk & Garansi</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>A6 Nyuss menjamin seluruh produk dibuat dari bahan halal dan berkualitas</li>
              <li>Jika produk yang diterima tidak sesuai pesanan atau rusak, segera hubungi kami dalam 30 menit</li>
              <li>Klaim ketidaksesuaian harus disertai foto sebagai bukti</li>
              <li>Produk yang sudah dimakan lebih dari 50% tidak dapat diklaim</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Batasan Tanggung Jawab</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A6 Nyuss tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan ini. Tanggung jawab kami terbatas pada nilai pesanan yang bersangkutan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Kebijakan Privasi</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Penggunaan data pribadi Anda diatur dalam{' '}
              <Link href="/privacy" className="text-[#8E0E0E] font-medium hover:underline">Kebijakan Privasi</Link>{' '}
              kami yang merupakan bagian tidak terpisahkan dari syarat dan ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">9. Kontak & Pengaduan</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Untuk pertanyaan, keluhan, atau saran terkait layanan kami:
            </p>
            <ul className="text-gray-600 text-sm space-y-2 mt-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <strong>Email:</strong> <a href="mailto:martabaka6nyusss@gmail.com" className="text-[#8E0E0E] hover:underline">martabaka6nyusss@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <strong>WhatsApp:</strong> <a href="https://wa.me/6287811123482" className="text-[#8E0E0E] hover:underline">0878-1112-3482</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span><strong>Alamat:</strong> Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179 (Depan Mess DITPOLARIUD POLDA JATIM SURABAYA)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">10. Hukum yang Berlaku</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Syarat dan ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia. Segala sengketa diselesaikan melalui musyawarah mufakat, dan jika tidak tercapai, diselesaikan melalui jalur hukum di Pengadilan Negeri Surabaya.
            </p>
          </section>

          <div className="border-t pt-4">
            <Link href="/privacy" className="text-[#8E0E0E] text-sm font-medium hover:underline">
              Lihat juga: Kebijakan Privasi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
