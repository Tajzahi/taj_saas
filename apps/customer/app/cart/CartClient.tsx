"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/menu';

export default function CartClient() {
  const { items, removeItem, updateQuantity, generalNote, setGeneralNote, getTotalPrice, getTotalItems } = useCartStore();
  const router = useRouter();
  const subtotal = getTotalPrice();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4">
        <div className="max-w-2xl mx-auto py-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#8E0E0E] transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span className="text-sm font-bold">Kembali</span>
          </button>

          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-550 mb-8">Belum ada menu yang dipilih. Yuk, pilih martabak favoritmu!</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all"
            >
              Lihat Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#8E0E0E] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span className="text-sm font-bold">Kembali</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Keranjang</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {getTotalItems()} item
          </span>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => {
            const variantSummary = item.selectedVariants
              .map((v) => v.option.name)
              .join(', ');
            return (
              <div key={item.cartId} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  {/* Image */}
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                      {item.menuItem.name}
                    </h3>
                    {variantSummary && (
                      <p className="text-xs text-gray-500 mt-0.5">{variantSummary}</p>
                    )}
                    {item.note && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">Catatan: {item.note}</p>
                    )}
                    <p className="font-bold text-[#8E0E0E] mt-1">{formatPrice(item.totalPrice)}</p>

                    {/* Quantity + Delete */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-[#8E0E0E] transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8E0E0E] hover:bg-[#9C1B0B] transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* General Note */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <label className="block font-semibold text-gray-800 mb-2 text-sm">
            Catatan untuk Seluruh Pesanan
          </label>
          <textarea
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            placeholder="Catatan umum, contoh: mohon dikemas rapi, jangan terlalu manis, dll..."
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
            rows={3}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({getTotalItems()} item)</span>
              <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ongkir</span>
              <span className="text-gray-400 text-xs italic">(Dihitung saat checkout)</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total Sementara</span>
              <span className="font-black text-[#8E0E0E] text-lg">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* Add more items */}
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-[#8E0E0E] hover:text-[#8E0E0E] transition-colors text-sm font-medium mb-6"
        >
          + Tambah Menu Lain
        </Link>

        {/* Checkout CTA */}
        <button
          onClick={() => router.push('/checkout')}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold text-base hover:from-[#9C1B0B] hover:to-[#D94708] transition-all shadow-lg hover:shadow-xl"
        >
          <span>Lanjut ke Checkout</span>
          <div className="flex items-center gap-2">
            <span className="font-black">{formatPrice(subtotal)}</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
