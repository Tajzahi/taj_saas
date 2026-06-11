"use client";
import { useState } from 'react';
import { CheckCircle, Send, Package, Truck, DollarSign, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const packages = [
  {
    name: 'Paket Mini',
    quantity: '10 Box',
    price: 'Rp 450.000',
    priceNote: 'Rp 45.000/box',
    items: ['Terang Bulan pilihan x7', 'Martabak Telur (Ayam/Bebek) x3'],
    highlight: false,
  },
  {
    name: 'Paket Medium',
    quantity: '20 Box',
    price: 'Rp 850.000',
    priceNote: 'Rp 42.500/box',
    items: ['Terang Bulan pilihan x14', 'Martabak Telur (Ayam/Bebek) x6'],
    highlight: true,
  },
  {
    name: 'Paket Besar',
    quantity: '50 Box',
    price: 'Rp 1.900.000',
    priceNote: 'Rp 38.000/box',
    items: ['Terang Bulan pilihan x35', 'Martabak Telur (Ayam/Bebek) x15'],
    highlight: false,
  },
];

export default function Catering() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    quantity: '',
    date: '',
    event: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.quantity || !form.date) {
      toast.error('Mohon lengkapi data yang diperlukan!');
      return;
    }
    // Build WhatsApp message
    const msg = `Halo A6 Nyuss! Saya ingin inquiry catering:%0A%0A` +
      `Nama: ${form.name}%0A` +
      `Perusahaan/Instansi: ${form.company || '-'}%0A` +
      `No. HP: ${form.phone}%0A` +
      `Jumlah Box: ${form.quantity}%0A` +
      `Tanggal Event: ${form.date}%0A` +
      `Jenis Event: ${form.event || '-'}%0A` +
      `Catatan: ${form.note || '-'}%0A%0A` +
      `Mohon info lebih lanjut. Terima kasih!`;
    window.open(`https://wa.me/6287811123482?text=${msg}`, '_blank');
    setSubmitted(true);
    toast.success('Inquiry terkirim! Tim kami akan segera menghubungi Anda.');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="text-[200px] font-black text-white select-none text-center leading-none">A6</div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-5">
            Untuk Event & Corporate
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Catering &<br />Corporate Order
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Hadirkan cita rasa A6 Nyuss untuk acara special Anda. 
            Cocok untuk gathering, seminar, ulang tahun, dan acara korporat.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Why Catering */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '/Halal logo.jfif', label: 'Halal & Higienis', isImg: true },
            { icon: 'Package', label: 'Dikemas Rapi' },
            { icon: 'Truck', label: 'Bisa Delivery' },
            { icon: 'DollarSign', label: 'Harga Spesial' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
              <div className="h-10 flex items-center justify-center mb-2 text-[#E05009]">
                {item.isImg ? (
                  <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain rounded" />
                ) : (
                  <>
                    {item.icon === 'Package' && <Package className="w-8 h-8" />}
                    {item.icon === 'Truck' && <Truck className="w-8 h-8" />}
                    {item.icon === 'DollarSign' && <DollarSign className="w-8 h-8" />}
                  </>
                )}
              </div>
              <p className="font-semibold text-gray-700 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Paket Catering</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl overflow-hidden shadow-lg ${
                  pkg.highlight
                    ? 'bg-gradient-to-b from-[#8E0E0E] to-[#E05009] text-white ring-4 ring-[#E05009]/30'
                    : 'bg-white'
                }`}
              >
                {pkg.highlight && (
                  <div className="bg-yellow-400 text-[#8E0E0E] text-xs font-black text-center py-1 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-[#8E0E0E] text-[#8E0E0E]" /> PALING POPULER
                  </div>
                )}
                <div className="p-6">
                  <h3 className={`text-xl font-black mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-3xl font-black mb-0.5 ${pkg.highlight ? 'text-white' : 'text-[#8E0E0E]'}`}>
                    {pkg.quantity}
                  </p>
                  <p className={`text-sm mb-4 ${pkg.highlight ? 'text-white/80' : 'text-gray-500'}`}>{pkg.priceNote}</p>
                  <div className={`text-2xl font-black mb-5 ${pkg.highlight ? 'text-yellow-300' : 'text-gray-900'}`}>
                    {pkg.price}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.items.map((item) => (
                      <li key={item} className={`flex items-center gap-2 text-sm ${pkg.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pkg.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">* Harga sudah termasuk kemasan. Ongkir menyesuaikan lokasi.</p>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-6">
            <h2 className="text-2xl font-black text-white">Form Inquiry Catering</h2>
            <p className="text-white/80 text-sm mt-1">Isi form di bawah dan tim kami akan menghubungi Anda segera!</p>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Terkirim!</h3>
              <p className="text-gray-500 text-sm">WhatsApp sudah terbuka. Tim kami akan segera merespons dalam 1×24 jam.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan / Instansi</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Nama perusahaan (opsional)"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Box <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="Minimal 10 box"
                    min="10"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Event <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Event</label>
                  <input
                    type="text"
                    value={form.event}
                    onChange={(e) => handleChange('event', e.target.value)}
                    placeholder="Ulang tahun, seminar, gathering..."
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                <textarea
                  value={form.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  placeholder="Permintaan khusus, preferensi menu, dll..."
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold hover:from-[#9C1B0B] hover:to-[#D94708] transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
                Kirim Inquiry via WhatsApp
              </button>
            </form>
          )}
        </div>

        {/* Direct WhatsApp */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Atau konsultasi langsung:</p>
          <a
            href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20konsultasi%20untuk%20catering"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg"
          >
            <MessageSquare className="w-5 h-5" /> Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
