export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-md">
        Maaf, halaman atau menu yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-md"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
