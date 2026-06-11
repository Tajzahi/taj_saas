"use client";
'use client';

import React, { useState } from 'react';
import { Plus, Check, Info, AlertTriangle } from 'lucide-react';
import { MenuItem, MenuVariant } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/format';
import useCart from '@/hooks/useCart';

interface MenuCardProps {
  item: MenuItem;
  variants: MenuVariant[];
}

export function MenuCard({ item, variants }: MenuCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCart((state) => state.addItem);

  // Filter variants for this item
  const itemVariants = variants.filter((v) => v.menu_item_id === item.id && v.is_available);

  // Initialize selected variant on open if available
  const handleOpen = () => {
    if (!item.is_available) return;
    if (itemVariants.length > 0) {
      // Find first variant (often reguler/medium)
      setSelectedVariant(itemVariants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
    setNotes('');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddToCart = () => {
    addItem(item, selectedVariant, quantity, notes);
    setJustAdded(true);
    setIsOpen(false);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // Calculate price to show
  const currentPrice = Number(item.price) + Number(selectedVariant?.price_adjustment || 0);

  return (
    <>
      {/* Menu Card Wrapper */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary hover:shadow-xl dark:bg-stone-900/50">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {item.is_best_seller && (
            <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground uppercase tracking-wider shadow-sm">
              Terlaris 🔥
            </span>
          )}
          {item.is_new && (
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-wider shadow-sm">
              Baru ✨
            </span>
          )}
          {!item.is_available && (
            <span className="inline-flex items-center rounded-full bg-stone-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              Habis 🚫
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Image Placeholder or Actual Image */}
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800 relative">
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-stone-400">
                <span className="text-4xl font-extrabold text-stone-300/80 dark:text-stone-700/80 select-none">A6</span>
                <span className="text-[10px] uppercase tracking-widest mt-1 text-stone-400/60 font-semibold">A6 NYUSS</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-stone-850 dark:text-stone-100 group-hover:text-primary transition-colors text-base line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
              {item.description || 'Martabak legendaris buatan A6 Nyuss.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Mulai dari</span>
            <span className="text-base font-extrabold text-foreground mt-0.5">
              {formatRupiah(Number(item.price))}
            </span>
          </div>

          <button
            onClick={handleOpen}
            disabled={!item.is_available}
            className={`flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm ${
              justAdded
                ? 'bg-green-600 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/95 active:scale-95 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:text-stone-500 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Ditambahkan
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Pesan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal Dialog for Product Configuration */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-250 border border-border dark:bg-stone-900">
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                ✕
              </button>
            </div>

            {/* Selection Options */}
            <div className="mt-6 space-y-6">
              {/* Variants Section */}
              {itemVariants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Pilih Varian / Ukuran
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {itemVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex flex-col items-start gap-1 rounded-xl p-3 border text-left transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <span className="text-xs font-bold">{variant.name}</span>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {variant.price_adjustment > 0
                            ? `+ ${formatRupiah(Number(variant.price_adjustment))}`
                            : 'Harga Base'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Jumlah Pesanan
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted disabled:opacity-40 transition"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kurangi mentega, parutan keju agak banyak, dll."
                  rows={2}
                  className="w-full rounded-xl border border-border bg-transparent p-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Sticky Buy Button */}
            <div className="mt-8 border-t border-border pt-4 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Total Harga</span>
                <span className="text-xl font-black text-foreground mt-1">
                  {formatRupiah(currentPrice * quantity)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-primary py-3 px-5 text-center text-xs font-bold text-primary-foreground hover:bg-primary/95 active:scale-98 transition shadow-md"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuCard;
