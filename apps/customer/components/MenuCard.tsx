"use client";
import Link from 'next/link';
import { useState } from 'react';

import { ShoppingCart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { MenuItem, formatPrice } from '@/data/menu';
import { useCartStore } from '@/store/cartStore';
import AddToCartModal from './AddToCartModal';

interface MenuCardProps {
  item: MenuItem;
  showDetail?: boolean;
}

const badgeConfig = {
  terlaris: { label: '🔥 Terlaris', cls: 'bg-orange-500 text-white' },
  baru: { label: '✨ Baru', cls: 'bg-blue-500 text-white' },
  habis: { label: '❌ Habis', cls: 'bg-gray-500 text-white' },
};

export default function MenuCard({ item, showDetail = true }: MenuCardProps) {
  const [showModal, setShowModal] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isHabis = item.badge === 'habis';

  const handleQuickAdd = () => {
    if (item.variants && item.variants.length > 0) {
      setShowModal(true);
    } else {
      addItem(item, [], 1, '');
      toast.success(`✅ ${item.name} ditambahkan ke keranjang!`, {
        duration: 2000,
        style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' },
      });
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group ${
          isHabis ? 'opacity-70' : 'hover:-translate-y-1'
        }`}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-44 sm:h-48 bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isHabis ? 'grayscale' : ''
            }`}
            loading="lazy"
          />
          {item.badge && (
            <span
              className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${badgeConfig[item.badge].cls}`}
            >
              {badgeConfig[item.badge].label}
            </span>
          )}
          <span className="absolute top-2 right-2 text-xs bg-white/90 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {item.categoryLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2 flex-1">
            {item.name}
          </h3>
          <p className="text-[#8E0E0E] font-bold text-base sm:text-lg mb-3">
            {formatPrice(item.price)}
            {item.variants && item.variants[0]?.options[1] && (
              <span className="text-xs text-gray-400 font-normal ml-1">/ mulai dari</span>
            )}
          </p>

          <div className="flex gap-2">
            {showDetail && (
              <Link
                href={`/menu/${item.slug}`}
                className="flex-1 text-center py-2 border border-[#8E0E0E] text-[#8E0E0E] rounded-xl text-xs sm:text-sm font-medium hover:bg-[#8E0E0E]/5 transition-colors"
              >
                Detail
              </Link>
            )}
            <button
              onClick={handleQuickAdd}
              disabled={isHabis}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                showDetail ? 'px-3' : 'flex-1'
              } ${
                isHabis
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white'
              }`}
            >
              {isHabis ? (
                'Habis'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {!showDetail && <span>Tambah</span>}
                  {showDetail && <ShoppingCart className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddToCartModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
