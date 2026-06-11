"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/data/menu';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cart = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartTotal = useCartStore((state) => state.getTotalPrice());
  const cartCount = useCartStore((state) => state.getTotalItems());
  const promoCode = useCartStore((state) => state.promoCode);
  const clearPromoCode = useCartStore((state) => state.clearPromoCode);
  const setServerValidatedPromo = useCartStore((state) => state.setServerValidatedPromo);
  // Gunakan diskon yang dikonfirmasi server — bukan kalkulasi client-side
  const promoDiscount = useCartStore((state) => state.serverPromoDiscount);
  const router = useRouter();

  const [applyingPromo, setApplyingPromo] = useState(false);
  const finalTotal = Math.max(0, cartTotal - promoDiscount);

  // Close drawer on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose]);

  const handleCheckoutClick = () => {
    onClose();
    router.push('/checkout');
  };

  const handleBrowseClick = () => {
    onClose();
    router.push('/menu');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer container with slide animation */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-stone-900 flex flex-col shadow-2xl relative h-full"
            >
              {/* HEADER */}
              <div className="px-4 py-6 sm:px-6 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5.5 h-5.5" />
                  <h2 className="text-lg font-bold text-white" id="slide-over-title">
                    Keranjang Belanja ({cartCount})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* LIST OF ITEMS */}
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-4 animate-bounce-short">
                      <ShoppingBag size={36} />
                    </div>
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">Keranjang Anda Kosong</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 mb-6">
                      Nikmati Terang Bulan manis & Martabak gurih adonan terbaik kami dengan menambahkannya sekarang.
                    </p>
                    <button
                      onClick={handleBrowseClick}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Jelajahi Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => {
                      const itemPriceEach = item.totalPrice / item.quantity;

                      return (
                        <div 
                          key={item.cartId} 
                          className="flex py-3.5 pb-4 border-b border-stone-100 dark:border-stone-800 items-start gap-4"
                        >
                          {/* Product Image */}
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-stone-50 shrink-0 border border-stone-100 dark:border-stone-850 shadow-xs"
                            referrerPolicy="no-referrer"
                          />

                          {/* Details block */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">
                              {item.menuItem.name}
                            </h4>
                            
                            {/* Selected Options / Variants */}
                            {item.selectedVariants && item.selectedVariants.length > 0 && (
                              <div className="text-xs text-[#E05009] font-medium mt-0.5 space-y-0.5">
                                {item.selectedVariants.map((v, idx) => (
                                  <p key={idx}>
                                    {v.label}: {v.option.name}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Special request notes */}
                            {item.note && item.note.trim() && (
                              <div className="text-[10px] bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 italic px-2 py-1 rounded border border-stone-150 dark:border-stone-800 mt-1.5 max-w-full break-words">
                                "{item.note}"
                              </div>
                            )}

                            {/* Price & Stepper row */}
                            <div className="flex justify-between items-center mt-3">
                              {/* Stepper counter */}
                              <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden h-7 sm:h-8 bg-stone-50 dark:bg-stone-850">
                                <button
                                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                  className="px-2.5 h-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-3 bg-white dark:bg-stone-900 font-bold text-xs text-stone-850 dark:text-stone-150 flex items-center justify-center h-full min-w-8">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                  className="px-2.5 h-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Price */}
                              <p className="text-sm font-extrabold text-stone-900 dark:text-white font-mono">
                                {formatPrice(item.totalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* Trash action */}
                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="text-stone-400 hover:text-[#8E0E0E] p-1 rounded transition-colors self-start cursor-pointer mt-0.5"
                            aria-label="Hapus dari keranjang"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FOOTER TOTALS */}
              {cart.length > 0 && (
                <div className="border-t border-stone-200 dark:border-stone-800 py-6 px-4 sm:px-6 bg-stone-50 dark:bg-stone-900">
                  {/* Coupon Area inside Drawer */}
                  <div className="mb-4 pb-4 border-b border-stone-200 dark:border-stone-850">
                    {promoCode ? (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-2.5 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-green-800 dark:text-green-400">Kupon Aktif: {promoCode}</p>
                          <p className="text-[10px] text-green-700 dark:text-green-500 mt-0.5">
                            {promoDiscount > 0 ? `Diskon -${formatPrice(promoDiscount)}` : 'Syarat kupon belum terpenuhi'}
                          </p>
                        </div>
                        <button
                          onClick={clearPromoCode}
                          className="text-[11px] font-bold text-red-650 hover:underline shrink-0 bg-white dark:bg-stone-800 px-2 py-1 border rounded-lg cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Kode kupon (ANNIV25)..."
                          id="drawerCouponInput"
                          className="flex-1 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none uppercase font-mono tracking-wider"
                        />
                        <button
                          type="button"
                          disabled={applyingPromo}
                          onClick={async () => {
                            const el = document.getElementById('drawerCouponInput') as HTMLInputElement;
                            if (!el?.value.trim()) {
                              toast.error('Silakan ketik kode kupon');
                              return;
                            }
                            setApplyingPromo(true);
                            try {
                              const res = await fetch('/api/validate-promo', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  code: el.value.trim(),
                                  subtotal: cartTotal,
                                  items: cart.map((i) => ({
                                    slug: i.menuItem.slug,
                                    category: i.menuItem.category,
                                    totalPrice: i.totalPrice,
                                  })),
                                }),
                              });
                              const data = await res.json();
                              if (data.valid) {
                                setServerValidatedPromo(data.promoCode, data.discountAmount);
                                toast.success(data.message);
                              } else {
                                toast.error(data.message || 'Kode promo tidak valid.');
                              }
                              el.value = '';
                            } catch {
                              toast.error('Gagal memvalidasi promo. Periksa koneksi.');
                            } finally {
                              setApplyingPromo(false);
                            }
                          }}
                          className="bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-800 dark:hover:bg-stone-750 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {applyingPromo ? '...' : 'Terapkan'}
                        </button>
                      </div>
                    )}
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 font-semibold mb-2">
                      <span>Kupon ({promoCode})</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-stone-950 dark:text-white">
                    <span>Subtotal</span>
                    <span className="font-mono text-lg text-[#8E0E0E] dark:text-[#E05009]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Pajak toko sudah termasuk. Biaya pengiriman dihitung saat checkout.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      id="checkout-button-from-drawer"
                      onClick={handleCheckoutClick}
                      className="w-full h-12 flex justify-center items-center gap-2 px-6 rounded-full bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:opacity-95 text-white font-bold text-base shadow-md cursor-pointer transition-transform duration-100 scale-100 active:scale-98"
                    >
                      Lanjut ke Checkout
                      <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full text-center py-2.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-bold transition-colors cursor-pointer"
                    >
                      Kembali ke Belanja
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
