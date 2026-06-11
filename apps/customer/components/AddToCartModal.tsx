"use client";
import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { MenuItem, formatPrice } from '@/data/menu';
import { useCartStore, CartItemVariant } from '@/store/cartStore';

interface AddToCartModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function AddToCartModal({ item, onClose }: AddToCartModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, CartItemVariant>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

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
  const allRequiredSelected = requiredVariants.every(
    (v) => selectedVariants[v.label]
  );

  const handleAddToCart = () => {
    if (!allRequiredSelected) {
      toast.error('Pilih semua varian yang diperlukan!');
      return;
    }
    addItem(item, Object.values(selectedVariants), quantity, note);
    toast.success(`${item.name} ditambahkan ke keranjang!`, {
      duration: 2000,
      style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-gray-900 text-base">Pilih Opsi</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Item Preview */}
          <div className="flex gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
              <p className="text-[#8E0E0E] font-bold text-base">{formatPrice(item.price)}</p>
            </div>
          </div>

          {/* Variants */}
          {item.variants?.map((variant) => (
            <div key={variant.label} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-gray-800 text-sm">{variant.label}</p>
                {variant.required && (
                  <span className="text-xs text-red-500 font-medium">* Wajib</span>
                )}
              </div>
              <div className="space-y-2">
                {variant.options.map((opt) => {
                  const isSelected = selectedVariants[variant.label]?.option.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVariantSelect(variant.label, opt)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-[#8E0E0E] bg-[#8E0E0E]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#8E0E0E] bg-[#8E0E0E]' : 'border-gray-400'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{opt.name}</span>
                      </div>
                      {opt.priceModifier > 0 && (
                        <span className="text-sm text-[#E05009] font-semibold">
                          +{formatPrice(opt.priceModifier)}
                        </span>
                      )}
                      {opt.priceModifier === 0 && (
                        <span className="text-sm text-gray-400">Termasuk</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Note */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: extra pedas, tanpa bawang..."
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
              rows={2}
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700 text-sm">Jumlah</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-[#8E0E0E] transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8E0E0E] hover:bg-[#9C1B0B] transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={handleAddToCart}
            disabled={!allRequiredSelected}
            className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-between px-4 transition-all ${
              allRequiredSelected
                ? 'bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Tambah ke Keranjang</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
