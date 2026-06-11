"use client";
import Link from 'next/link';

import { ArrowRight, Award, Sprout, Heart, Handshake, User } from 'lucide-react';

const timeline = [
  { year: '2000', event: 'A6 Nyuss didirikan di Surabaya', desc: 'Berawal dari gerobak sederhana di Jl. Demak, A6 Nyuss mulai melayani warga Surabaya.' },
  { year: '2005', event: 'Menu Terang Bulan diluncurkan', desc: 'Memperluas menu dengan Terang Bulan yang langsung menjadi favorit pelanggan.' },
  { year: '2010', event: 'Tempat buka pertama kali permanen', desc: 'Pindah ke lokasi yang lebih strategis, semakin mudah dijangkau pelanggan.' },
  { year: '2015', event: 'Pelanggan ke-10.000', desc: 'Mencapai milestone 10.000 pelanggan setia. Terima kasih atas kepercayaan Anda!' },
  { year: '2020', event: '20 Tahun Melayani Surabaya', desc: 'Merayakan ulang tahun ke-20 dengan menu spesial dan promo anniversary.' },
  { year: '2026', event: 'Hadir di Platform Digital', desc: 'Kini A6 Nyuss hadir secara online untuk memudahkan Anda pesan kapan saja!' },
];

const values = [
  { icon: 'Award', title: 'Rasa Autentik', desc: 'Resep original yang tidak pernah berubah sejak 2000. Cita rasa yang bikin kangen!' },
  { icon: 'Sprout', title: 'Bahan Pilihan', desc: 'Kami hanya menggunakan bahan-bahan berkualitas dan segar setiap harinya.' },
  { icon: 'Heart', title: 'Dengan Kasih Sayang', desc: 'Setiap martabak dibuat dengan penuh dedikasi dan cinta untuk kepuasan pelanggan.' },
  { icon: 'Handshake', title: 'Pelayanan Ramah', desc: 'Kami selalu siap melayani dengan senyum dan memastikan pengalaman terbaik.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Award className="w-4 h-4" /> Est. 2000 — 25+ Tahun Melayani Surabaya
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Cerita di Balik<br />
            <span className="text-yellow-300">A6 Nyuss</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Dari gerobak sederhana hingga menjadi ikon martabak Surabaya. 
            Ini adalah perjalanan 25 tahun penuh cinta dan dedikasi.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Kisah Kami</span>
              <h2 className="text-3xl font-black text-gray-900 mt-1 mb-4">Bermula dari Mimpi Sederhana</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Tahun 2000, dengan modal terbatas dan tekad yang besar, A6 Nyuss lahir di sudut Jalan Demak, Surabaya. 
                  Bapak pendiri kami — seorang putra asli Surabaya — memulai segalanya dari sebuah gerobak kayu sederhana 
                  dengan resep martabak yang diwariskan turun-temurun dari keluarga.
                </p>
                <p>
                  Nama "A6 Nyuss" bukan sekadar nama. Angka 6 melambangkan lokasi awal kami, sementara "Nyuss" adalah 
                  cara orang Surabaya mengekspresikan sesuatu yang luar biasa enak. Dan memang, dari hari pertama, 
                  pelanggan langsung jatuh cinta dengan cita rasanya.
                </p>
                <p>
                  25 tahun berlalu, kami tetap mempertahankan resep original yang sama. Tidak ada kompromi dalam soal 
                  rasa. Setiap malam, kami memastikan bahwa setiap martabak yang keluar dari dapur kami adalah yang 
                  terbaik yang bisa kami sajikan.
                </p>
                <p>
                  Kini, di era digital, kami hadir lebih dekat dengan Anda melalui platform online ini. 
                  Tapi satu hal yang tidak berubah: semangat dan dedikasi kami untuk selalu menghadirkan 
                  martabak terlezat untuk keluarga Surabaya.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] rounded-3xl p-8 text-center text-white">
                <div className="text-7xl font-black mb-2">25</div>
                <div className="text-xl font-bold mb-1">Tahun Melayani</div>
                <div className="text-white/80 text-sm">Warga Surabaya Tercinta</div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { num: '10K+', label: 'Pelanggan Setia' },
                    { num: '50K+', label: 'Pesanan Terlayani' },
                    { num: '4.9/5', label: 'Rating' },
                    { num: '100%', label: 'Halal' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/20 rounded-xl p-3">
                      <div className="text-xl font-black">{stat.num}</div>
                      <div className="text-xs text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      {false && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Perjalanan Kami</span>
              <h2 className="text-3xl font-black text-gray-900 mt-1">Milestone A6 Nyuss</h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
              <div className="space-y-8">
                {timeline.map((item, idx) => (
                  <div key={item.year} className={`flex gap-4 sm:gap-0 ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start relative`}>
                    {/* Content */}
                    <div className={`flex-1 ${idx % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'} pl-16 sm:pl-0`}>
                      <div className={`bg-white rounded-2xl p-4 shadow-md ${idx % 2 === 0 ? '' : 'sm:ml-4'}`}>
                        <div className="text-[#E05009] font-black text-xl mb-1">{item.year}</div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.event}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-8 sm:left-1/2 top-4 w-5 h-5 rounded-full bg-[#8E0E0E] border-4 border-white shadow -translate-x-1/2 z-10" />
                    <div className="flex-1 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Yang Kami Pegang</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">Nilai-Nilai A6 Nyuss</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl bg-gradient-to-b from-[#8E0E0E]/5 to-transparent border border-[#8E0E0E]/10 flex flex-col items-center">
                <div className="text-[#E05009] p-3 bg-[#E05009]/10 rounded-2xl mb-3">
                  {v.icon === 'Award' && <Award className="w-8 h-8" />}
                  {v.icon === 'Sprout' && <Sprout className="w-8 h-8" />}
                  {v.icon === 'Heart' && <Heart className="w-8 h-8" />}
                  {v.icon === 'Handshake' && <Handshake className="w-8 h-8" />}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Orang di Balik Layar</span>
          <h2 className="text-3xl font-black text-gray-900 mt-1 mb-10">Tim A6 Nyuss</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Pak Ahmad', role: 'Founder & Head Chef', quote: '"Setiap martabak adalah karya seni yang harus sempurna."' },
              { name: 'Bu Sari', role: 'Operasional & Layanan', quote: '"Pelanggan yang puas adalah kebanggaan terbesar kami."' },
              { name: 'Mas Reza', role: 'Quality Control', quote: '"Bahan terbaik menghasilkan rasa terbaik, selalu."' },
            ].map((person) => (
              <div key={person.name} className="bg-white rounded-2xl p-6 shadow-md text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#8E0E0E]/10 flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-[#8E0E0E]" />
                </div>
                <h3 className="font-bold text-gray-900">{person.name}</h3>
                <p className="text-[#E05009] text-sm font-medium mb-3">{person.role}</p>
                <p className="text-gray-500 text-sm italic">"{person.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#8E0E0E] to-[#E05009]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Siap Merasakan Bedanya?</h2>
          <p className="text-white/80 mb-8">Coba sendiri mengapa kami dipercaya ribuan keluarga Surabaya selama 25 tahun.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#8E0E0E] font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            Coba Menu Kami <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
