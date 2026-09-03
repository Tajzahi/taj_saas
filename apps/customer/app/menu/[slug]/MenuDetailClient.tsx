"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ArrowLeft, Minus, Plus, ShoppingCart, Utensils, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice, MenuItem } from '@/data/menu';
import { useCartStore, CartItemVariant } from '@/store/cartStore';
import MenuCard from '@/components/MenuCard';

interface MenuDetailClientProps {
  slug?: string;
  initialItem: MenuItem | null;
  initialRelated: MenuItem[];
}

export default function MenuDetailClient({ initialItem, initialRelated }: MenuDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  // Data sudah dari SSR — tidak perlu fetch atau loading state
  const item = initialItem;
  const relatedMenus = initialRelated;

  const [selectedVariants, setSelectedVariants] = useState<Record<string, CartItemVariant>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');


  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Menu tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">Menu yang kamu cari tidak tersedia.</p>
          <Link
            href="/menu"
            className="px-6 py-3 bg-[#8E0E0E] text-white rounded-xl font-semibold hover:bg-[#9C1B0B] transition-colors"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  const isHabis = item.badge === 'habis';

  const variantModifiers = Object.values(selectedVariants).reduce(
    (sum, v) => sum + v.option.priceModifier,
    0
  );
  const totalPrice = (item.price + variantModifiers) * quantity;

  const handleVariantSelect = (variantLabel: string, option: { id: string; name: string; priceModifier: number }) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantLabel]: { label: variantLabel, option },
    }));
  };

  const requiredVariants = item.variants?.filter((v) => v.required) ?? [];
  const allRequiredSelected = requiredVariants.every((v) => selectedVariants[v.label]);

  const handleAddToCart = () => {
    if (!allRequiredSelected && item.variants && item.variants.filter(v => v.required).length > 0) {
      toast.error('Pilih semua varian yang diperlukan!');
      return;
    }
    addItem(item, Object.values(selectedVariants), quantity, note);
    toast.success(`${item.name} ditambahkan ke keranjang!`, {
      duration: 2000,
      style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' },
    });
    router.push('/cart');
  };

  const badgeConfig = {
    terlaris: { label: 'Terlaris', cls: 'bg-orange-500 text-white' },
    baru: { label: 'Baru', cls: 'bg-blue-500 text-white' },
    habis: { label: 'Habis', cls: 'bg-gray-500 text-white' },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#8E0E0E] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-32">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-8">
          {/* Image */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100">
            <Image
              src={item.image || '/assets/menu/placeholder.jpg'}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              priority
              className={`object-cover ${isHabis ? 'grayscale' : ''}`}
            />
            {item.badge && (
              <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full ${badgeConfig[item.badge].cls}`}>
                {badgeConfig[item.badge].label}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mb-2 inline-block">
                  {item.categoryLabel}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{item.name}</h1>
              </div>
              {item.badge && (
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${badgeConfig[item.badge].cls}`}>
                  {badgeConfig[item.badge].label}
                </span>
              )}
            </div>

            <p className="text-2xl sm:text-3xl font-black text-[#8E0E0E] mb-4">
              {formatPrice(item.price)}
              {item.variants && item.variants[0]?.options[1] && (
                <span className="text-sm text-gray-400 font-normal ml-1">/ mulai dari</span>
              )}
            </p>

            {item.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
            )}

            {isHabis && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center flex flex-col items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2 shrink-0" />
                <p className="text-red-600 font-bold">Maaf, menu ini sedang habis</p>
                <p className="text-red-400 text-sm mt-1">Coba cek lagi besok atau pilih menu lainnya</p>
              </div>
            )}

            {!isHabis && (
              <>
                {/* Variants */}
                {item.variants?.map((variant) => (
                  <div key={variant.label} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="font-bold text-gray-800">{variant.label}</p>
                      {variant.required && (
                        <span className="text-xs text-red-500 font-medium">* Wajib pilih</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.label]?.option.id === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleVariantSelect(variant.label, opt)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#8E0E0E] bg-[#8E0E0E]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#8E0E0E] bg-[#8E0E0E]' : 'border-gray-400'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{opt.name}</span>
                            </div>
                            {opt.priceModifier > 0 ? (
                              <span className="text-sm text-[#E05009] font-semibold">+{formatPrice(opt.priceModifier)}</span>
                            ) : (
                              <span className="text-sm text-gray-400">Termasuk</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Special Note */}
                <div className="mb-6">
                  <label className="block font-bold text-gray-800 mb-2">
                    Catatan Khusus <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: extra pedas, tanpa bawang, dll..."
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
                    rows={2}
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
                  <span className="font-bold text-gray-800">Jumlah</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-[#8E0E0E] transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-black text-xl text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#8E0E0E] hover:bg-[#9C1B0B] transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart button inside card */}
                <button
                  onClick={handleAddToCart}
                  disabled={!allRequiredSelected && requiredVariants.length > 0}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all text-base ${
                    allRequiredSelected || requiredVariants.length === 0
                      ? 'bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white hover:from-[#9C1B0B] hover:to-[#D94708] shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Tambah ke Keranjang</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Related Menus */}
        {relatedMenus.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 mb-4">Menu Terkait</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {relatedMenus.map((related) => (
                <MenuCard key={related.id} item={related} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
