"use client";
'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Plus, Minus, MapPin, Check, Phone, User, MessageSquare, Loader } from 'lucide-react';
import useCart from '@/hooks/useCart';
import { formatRupiah, generateOrderCode } from '@/lib/utils/format';
import { StoreSettings } from '@/types/database.types';
import supabase from '@/lib/supabase/client';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings | null;
}

export function CartDrawer({ isOpen, onClose, settings }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getCartSubtotal,
    getCartTotalCount,
  } = useCart();

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null); // Order Code

  // Constants from settings
  const deliveryFee = deliveryType === 'delivery' ? Number(settings?.flat_delivery_fee || 10000) : 0;
  const subtotal = getCartSubtotal();
  const total = subtotal + deliveryFee;
  const whatsappNumber = settings?.whatsapp_number || '6287811123482';
  const minimumOrder = Number(settings?.minimum_order_amount || 0);

  // Close drawer on success
  useEffect(() => {
    if (orderSuccess) {
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setNotes('');
    }
  }, [orderSuccess]);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Validate minimum order
    if (subtotal < minimumOrder) {
      alert(`Minimal pemesanan adalah ${formatRupiah(minimumOrder)}. Total belanja Anda saat ini adalah ${formatRupiah(subtotal)}.`);
      return;
    }

    if (!customerName || !customerPhone) {
      alert('Nama dan Nomor HP wajib diisi!');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress) {
      alert('Alamat pengiriman wajib diisi untuk layanan Delivery!');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderCode = generateOrderCode();

      // 1. Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_code: orderCode,
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_type: deliveryType,
          delivery_address: deliveryType === 'delivery' ? deliveryAddress : null,
          delivery_fee: deliveryFee,
          subtotal: subtotal,
          total_price: total,
          status: 'received',
          notes: notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Prepare order items
      const orderItemsInsert = items.map((item) => {
        const itemBasePrice = Number(item.menuItem.price);
        const itemAdjustment = Number(item.selectedVariant?.price_adjustment || 0);
        const itemPrice = itemBasePrice + itemAdjustment;
        
        return {
          order_id: orderData.id,
          menu_item_id: item.menuItem.id,
          menu_item_name: item.menuItem.name,
          variant_name: item.selectedVariant?.name || null,
          quantity: item.quantity,
          unit_price: itemPrice,
          total_price: itemPrice * item.quantity,
          customer_name: customerName,
        };
      });

      // 3. Insert into order_items table
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsInsert);

      if (itemsError) throw itemsError;

      // 4. Construct WhatsApp Message text
      let waMessage = `*Pesan Martabak A6 Nyuss*\n`;
      waMessage += `-----------------------------------------\n`;
      waMessage += `*Kode Order:* \`${orderCode}\`\n`;
      waMessage += `*Nama:* ${customerName}\n`;
      waMessage += `*No. HP:* ${customerPhone}\n`;
      waMessage += `*Metode:* ${deliveryType === 'delivery' ? '🚗 Delivery' : '🏪 Ambil Sendiri (Pickup)'}\n`;
      
      if (deliveryType === 'delivery') {
        waMessage += `*Alamat:* ${deliveryAddress}\n`;
      }
      
      waMessage += `-----------------------------------------\n`;
      waMessage += `*Detail Pesanan:*\n`;
      
      items.forEach((item) => {
        const variantStr = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
        const itemBasePrice = Number(item.menuItem.price);
        const itemAdjustment = Number(item.selectedVariant?.price_adjustment || 0);
        const itemPrice = itemBasePrice + itemAdjustment;
        
        waMessage += `• ${item.quantity}x ${item.menuItem.name}${variantStr}\n`;
        if (item.notes) {
          waMessage += `   _Catatan: ${item.notes}_\n`;
        }
        waMessage += `   @ ${formatRupiah(itemPrice)} = ${formatRupiah(itemPrice * item.quantity)}\n`;
      });
      
      waMessage += `-----------------------------------------\n`;
      waMessage += `*Subtotal:* ${formatRupiah(subtotal)}\n`;
      
      if (deliveryType === 'delivery') {
        waMessage += `*Ongkir:* ${formatRupiah(deliveryFee)}\n`;
      }
      
      waMessage += `*Total Pembayaran:* *${formatRupiah(total)}*\n`;
      
      if (notes) {
        waMessage += `-----------------------------------------\n`;
        waMessage += `*Catatan Tambahan:* ${notes}\n`;
      }
      
      waMessage += `\nMohon segera diproses pesanan saya. Terima kasih!`;

      // 5. Open WhatsApp Redirect Link in a new tab
      const encodedWaText = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedWaText}`;
      
      // Clear Cart state
      clearCart();
      
      // Set order success code
      setOrderSuccess(orderCode);
      
      // Trigger WhatsApp redirection
      window.open(waUrl, '_blank');
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Gagal membuat pesanan. Silakan coba lagi atau hubungi admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-card shadow-2xl animate-in slide-in-from-right duration-250 border-l border-border dark:bg-stone-900">
        
        {/* Success Screen */}
        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <Check className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Pesanan Berhasil Dikirim!</h3>
              <p className="text-sm text-muted-foreground">
                Kode Order Anda: <span className="font-mono font-bold text-primary">{orderSuccess}</span>
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2">
                Tautan pesan WhatsApp telah terbuka secara otomatis di tab baru. Jika tidak terbuka, silakan klik tombol di bawah untuk menghubungi admin toko.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-2 pt-4">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClose();
                }}
                className="w-full rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition"
              >
                Kembali Belanja
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Keranjang Belanja</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                ✕
              </button>
            </div>

            {/* Empty Cart State */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 text-stone-300 dark:text-stone-700 mb-3" />
                <p className="text-sm font-semibold">Keranjang Anda masih kosong</p>
                <p className="text-xs mt-1">Pilih martabak favorit Anda di katalog menu.</p>
                <button
                  onClick={onClose}
                  className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 sm:px-6">
                  {items.map((item) => {
                    const itemBasePrice = Number(item.menuItem.price);
                    const itemAdjustment = Number(item.selectedVariant?.price_adjustment || 0);
                    const itemPrice = itemBasePrice + itemAdjustment;
                    
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-3 dark:bg-stone-800/20"
                      >
                        {/* Summary Details */}
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-bold text-foreground leading-tight">
                            {item.menuItem.name}
                          </h4>
                          {item.selectedVariant && (
                            <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              {item.selectedVariant.name}
                            </span>
                          )}
                          {item.notes && (
                            <p className="text-[11px] italic text-muted-foreground">
                              &ldquo;{item.notes}&rdquo;
                            </p>
                          )}
                          <span className="block text-xs font-extrabold text-foreground pt-1">
                            {formatRupiah(itemPrice)}
                          </span>
                        </div>

                        {/* Adjust Count & Remove */}
                        <div className="flex flex-col items-end gap-2.5">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-red-600 transition"
                            aria-label="Hapus Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-1.5 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-muted-foreground hover:text-foreground transition text-xs font-bold px-1"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-muted-foreground hover:text-foreground transition text-xs font-bold px-1"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} className="border-t border-border pt-6 mt-6 space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Detail Pengiriman & Pelanggan
                    </h3>

                    {/* Method Selector */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                          deliveryType === 'pickup'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        🏪 Ambil Sendiri
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                          deliveryType === 'delivery'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        🚗 Delivery (Flat)
                      </button>
                    </div>

                    {/* Name */}
                    <div className="relative">
                      <User className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="Nama Pelanggan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-transparent py-2.5 pr-3 pl-9 text-xs placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <Phone className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        placeholder="No. WhatsApp Aktif (e.g. 081234xxx)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-border bg-transparent py-2.5 pr-3 pl-9 text-xs placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                      />
                    </div>

                    {/* Address (If Delivery) */}
                    {deliveryType === 'delivery' && (
                      <div className="relative">
                        <MapPin className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                          required
                          placeholder="Alamat Lengkap Pengiriman"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-border bg-transparent py-2.5 pr-3 pl-9 text-xs placeholder-muted-foreground focus:border-primary focus:outline-none transition resize-none"
                        />
                      </div>
                    )}

                    {/* General Order Notes */}
                    <div className="relative">
                      <MessageSquare className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Catatan Umum (e.g. jam kirim, kembalian uang)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-xl border border-border bg-transparent py-2.5 pr-3 pl-9 text-xs placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </form>
                </div>

                {/* Footer / Summary Actions */}
                <div className="border-t border-border bg-stone-50 p-4 dark:bg-stone-950/20 sm:px-6">
                  <div className="space-y-1.5 text-xs text-muted-foreground pb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">{formatRupiah(subtotal)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Ongkos Kirim (Flat)</span>
                        <span className="font-semibold text-foreground">{formatRupiah(deliveryFee)}</span>
                      </div>
                    )}
                    {minimumOrder > 0 && subtotal < minimumOrder && (
                      <div className="bg-red-50 text-red-600 rounded-lg p-2 text-[10px] flex items-center gap-1.5 mt-2 dark:bg-red-950/20 dark:text-red-400">
                        <span>Min. Belanja: {formatRupiah(minimumOrder)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                      <span>Total Pembayaran</span>
                      <span className="text-primary text-base font-black">{formatRupiah(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting || (minimumOrder > 0 && subtotal < minimumOrder)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:text-stone-500 disabled:cursor-not-allowed transition shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Memproses Pesanan...
                      </>
                    ) : (
                      <>
                        Konfirmasi & Pesan via WhatsApp
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
