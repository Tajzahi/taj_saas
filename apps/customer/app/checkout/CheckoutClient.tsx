"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { AlertCircle, ShoppingBag, Truck, Ticket, Banknote, QrCode, UploadCloud, MapPin, ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, useOrderStore, DELIVERY_ZONES } from '@/store/cartStore';
import { formatPrice } from '@/data/menu';
import type { DeliveryMapResult } from '@/components/DeliveryMap';

// Dynamically import the map component (client-side only — no SSR for Leaflet)
const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">Memuat peta interaktif...</p>
      </div>
    </div>
  ),
});

export default function CheckoutClient() {
  const router = useRouter();
  const {
    items,
    generalNote,
    getTotalPrice,
    clearCart,
    promoCode,
    setServerValidatedPromo,
    clearPromoCode,
    serverPromoDiscount,
  } = useCartStore();
  const { setCurrentOrder } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [storeSettingsState, setStoreSettingsState] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings')
      .then((res) => res.json())
      .then((settings) => {
        setIsStoreOpen(settings.is_open);
        setStoreSettingsState(settings);
      })
      .catch((err) => {
        console.error('Error fetching store settings:', err);
      });

    // Cleanup legacy localStorage key with raw PII (R2-016)
    try {
      localStorage.removeItem('a6nyuss-orders');
      const savedDraft = localStorage.getItem('taj_checkout_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.addressNote) setAddressNote(parsed.addressNote);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
      }
    } catch {}
  }, []);

  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('takeaway');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressNote, setAddressNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qris'>('cod');

  // Auto-save draft on change so refreshing never loses customer input
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    try {
      localStorage.setItem('taj_checkout_draft', JSON.stringify({
        name,
        phone,
        address,
        addressNote,
        orderType,
        paymentMethod,
      }));
    } catch {}
  }, [name, phone, address, addressNote, orderType, paymentMethod, mounted]);
  const [agreed, setAgreed] = useState(false);
  const [agreedCancel, setAgreedCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Map-derived delivery info (replaces manual zone selection)
  const [mapResult, setMapResult] = useState<DeliveryMapResult | null>(null);
  const [deliveryZone, setDeliveryZone] = useState(0); // fallback index

  // When map resolves an address (reverse geocoding), fill the textarea
  const handleAddressResolved = useCallback((resolvedAddress: string) => {
    setAddress(resolvedAddress);
    setErrors((prev) => ({ ...prev, address: '', mapLocation: '' }));
  }, []);

  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [serverConfirmedTotal, setServerConfirmedTotal] = useState<number>(0);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingAttempt, setPendingAttempt] = useState<{ idemKey: string; token: string } | null>(null);

  // When the map reports a result, update state
  const handleMapLocationSelect = useCallback((result: DeliveryMapResult | null) => {
    setMapResult(result);
    if (result && !result.isOutOfRange) {
      // Map fee to zone index for backward compatibility
      const zoneIdx = DELIVERY_ZONES.findIndex((z) => z.fee === result.fee);
      setDeliveryZone(zoneIdx >= 0 ? zoneIdx : 0);
    }
    // Clear map-related errors when user picks a location
    setErrors((prev) => ({ ...prev, mapLocation: '' }));
  }, []);

  const handleUploadProof = async (orderCode: string) => {
    if (!uploadFile) {
      toast.error('Silakan pilih gambar bukti transfer terlebih dahulu');
      return;
    }
    if (uploadFile.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB. Silakan pilih file yang lebih kecil.');
      return;
    }
    if (!uploadFile.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const token = typeof window !== 'undefined' ? localStorage.getItem(`cust_tok_${orderCode}`) || '' : '';
          const res = await fetch('/api/upload-proof', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: base64Data,
              fileName: uploadFile.name,
              fileType: uploadFile.type,
              orderCode,
              customerToken: token,
            })
          });
          const result = await res.json();
          if (!res.ok || !result.success) {
            throw new Error(result.error || 'Gagal mengunggah bukti');
          }
          toast.success('Bukti transfer berhasil diunggah! Menunggu verifikasi admin.');
          clearCart();
          setShowQrisModal(false);
          router.push('/tracking?new=true');
        } catch (err: any) {
          toast.error(`Gagal mengunggah bukti: ${err.message || 'Terjadi kesalahan'}`);
          setUploading(false);
        }
      };
      reader.onerror = () => {
        toast.error('Gagal membaca file gambar.');
        setUploading(false);
      };
    } catch (err: any) {
      console.error('Error uploading payment proof:', err);
      toast.error(`Gagal mengunggah bukti: ${err.message || 'Terjadi kesalahan'}`);
      setUploading(false);
    }
  };

  const handlePayLater = () => {
    clearCart();
    setShowQrisModal(false);
    router.push('/tracking?new=true');
  };

  const subtotal = getTotalPrice();
  const deliveryFee = orderType === 'delivery' ? (mapResult && !mapResult.isOutOfRange ? mapResult.fee : 0) : 0;
  // Gunakan diskon yang dikonfirmasi server — bukan kalkulasi client-side
  const promoDiscount = serverPromoDiscount;
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

  // State untuk loading promo validation
  const [applyingPromo, setApplyingPromo] = useState(false);

  // Handler apply promo: panggil server API, bukan validasi client-side
  const handleApplyPromo = useCallback(async (code: string) => {
    if (!code.trim()) {
      toast.error('Silakan ketik kode kupon terlebih dahulu');
      return;
    }
    setApplyingPromo(true);
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          subtotal,
          items: items.map((i) => ({
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
    } catch {
      toast.error('Gagal memvalidasi promo. Periksa koneksi internet Anda.');
    } finally {
      setApplyingPromo(false);
    }
  }, [subtotal, items, setServerValidatedPromo]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'Nama minimal 2 karakter';
    if (!phone.trim() || !/^(08|\+62)\d{8,12}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor HP tidak valid (contoh: 081234567890)';
    }
    if (orderType === 'delivery') {
      if (!address.trim()) newErrors.address = 'Alamat pengiriman wajib diisi';
      if (!mapResult) newErrors.mapLocation = 'Silakan tandai lokasi Anda di peta terlebih dahulu';
      if (mapResult?.isOutOfRange) newErrors.mapLocation = 'Lokasi Anda berada di luar jangkauan pengiriman (maks. 10 km)';
    }
    if (!agreed) newErrors.agreed = 'Harap setujui Syarat & Ketentuan';
    if (!agreedCancel) newErrors.agreedCancel = 'Harap setujui kebijakan pembatalan pesanan';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStoreOpen) {
      toast.error('Maaf, gerai kami saat ini sedang tutup. Tidak dapat memproses pesanan.');
      return;
    }
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Mohon lengkapi semua data yang diperlukan');
      return;
    }
    setLoading(true);
    try {
      // ── Kirim ke server API — harga dihitung ulang dari database ──
      const fullAddress = orderType === 'delivery'
        ? `${address}${addressNote ? ` (${addressNote})` : ''}${mapResult ? ` [Koordinat: ${mapResult.lat.toFixed(6)},${mapResult.lng.toFixed(6)}]` : ''}`
        : undefined;

      // Siapkan client-side idempotency key & customer token (pertahankan attempt yang sama saat retry)
      let attempt = pendingAttempt;
      if (!attempt) {
        const clientToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        const idemKey = `IDEM-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        attempt = { idemKey, token: clientToken };
        setPendingAttempt(attempt);
      }

      // Siapkan payload: hanya slug + quantity + variant modifier (NO harga dari frontend)
      const orderPayload = {
        items: items.map((item) => ({
          menuItemSlug: item.menuItem.slug,
          menuItemName: item.menuItem.name,
          variantName: item.selectedVariants && item.selectedVariants.length > 0
            ? item.selectedVariants.map((v) => v.option?.name || '').filter(Boolean).join(', ')
            : undefined,
          quantity: item.quantity,
        })),
        customerName: name,
        customerPhone: phone,
        orderType,
        deliveryAddress: fullAddress,
        customerLat: mapResult?.lat,
        customerLng: mapResult?.lng,
        promoCode: promoCode || undefined,
        notes: generalNote || undefined,
        paymentMethod,
        idempotencyKey: attempt.idemKey,
        customerToken: attempt.token,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal membuat pesanan');
      }

      // Berhasil: reset pending attempt
      setPendingAttempt(null);

      // Gunakan total yang dikonfirmasi server (bukan kalkulasi client)
      const serverTotal = result.total;
      const serverOrderCode = result.orderCode;
      const effectiveToken = result.customerToken || attempt.token;

      if (effectiveToken) {
        try {
          localStorage.setItem(`cust_tok_${serverOrderCode}`, effectiveToken);
          localStorage.removeItem('taj_checkout_draft');
        } catch {}
      } else {
        try {
          localStorage.removeItem('taj_checkout_draft');
        } catch {}
      }

      const order = {
        orderCode: serverOrderCode,
        items: [...items],
        customerName: name,
        customerPhone: phone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? address : undefined,
        addressNote: orderType === 'delivery' ? addressNote : undefined,
        generalNote: promoCode ? `[Kupon: ${promoCode}] ${generalNote || ''}` : generalNote,
        paymentMethod,
        subtotal: result.subtotal,
        deliveryFee: result.deliveryFee,
        total: serverTotal,
        status: 'received' as const,
        createdAt: new Date().toISOString(),
        estimatedTime: orderType === 'delivery' ? 40 : 20,
        promoCode: promoCode || undefined,
        promoDiscount: result.promoDiscount || undefined,
      };

      setCurrentOrder(order, effectiveToken);

      if (paymentMethod === 'qris') {
        setCreatedOrderCode(serverOrderCode);
        setServerConfirmedTotal(serverTotal);
        setShowQrisModal(true);
        toast.success('Pesanan dibuat! Silakan selesaikan pembayaran.');
      } else {
        clearCart();
        toast.success('Pesanan berhasil dibuat!');
        router.push('/tracking?new=true');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(`Gagal mengirim pesanan: ${error.message || 'Terjadi masalah koneksi'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Memuat checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Silakan pilih menu terlebih dahulu.</p>
          <Link href="/menu" className="px-6 py-3 bg-[#8E0E0E] text-white rounded-xl font-semibold">Lihat Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-[#8E0E0E]" /> Checkout
        </h1>

        {/* Store Hours */}
        {isStoreOpen ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-green-700 text-sm font-medium">Toko sedang buka. Pesanan akan segera diproses!</span>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="text-red-700 text-sm font-semibold">Maaf, gerai kami saat ini sedang tutup. Pemesanan online dinonaktifkan sementara.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Order Type */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Tipe Pesanan</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'dine_in', icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />, label: 'Dine-in', desc: 'Makan di tempat' },
                { val: 'takeaway', icon: <ShoppingBag className="w-5 h-5 text-purple-600" />, label: 'Takeaway', desc: 'Bungkus / Pick up' },
                { val: 'delivery', icon: <Truck className="w-5 h-5 text-blue-600" />, label: 'Delivery', desc: 'Diantar ke rumah' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setOrderType(opt.val as 'dine_in' | 'takeaway' | 'delivery')}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    orderType === opt.val ? 'border-[#8E0E0E] bg-[#8E0E0E]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mb-1.5">{opt.icon}</div>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">{opt.label}</p>
                  <p className="text-[10px] text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Data Pemesan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                    errors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#8E0E0E]'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
                  placeholder="Contoh: 081234567890"
                  className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                    errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-[#8E0E0E]'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>

              {/* Delivery-only fields */}
              {orderType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Pengiriman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: '' })); }}
                      placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan..."
                      className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none resize-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                        errors.address ? 'border-red-400' : 'border-gray-200 focus:border-[#8E0E0E]'
                      }`}
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patokan / Catatan Alamat</label>
                    <input
                      type="text"
                      value={addressNote}
                      onChange={(e) => setAddressNote(e.target.value)}
                      placeholder="Contoh: Depan masjid, pagar biru, RT 03/RW 05"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] text-gray-900 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* === INTERACTIVE MAP SECTION === */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" /> Tandai Lokasi di Peta <span className="text-red-500">*</span>
                    </label>
                    <DeliveryMap
                      onLocationSelect={handleMapLocationSelect}
                      onAddressResolved={handleAddressResolved}
                      searchAddress={address}
                      outletLat={storeSettingsState?.outlet_lat}
                      outletLng={storeSettingsState?.outlet_lng}
                    />
                    {errors.mapLocation && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.mapLocation}
                      </p>
                    )}
                  </div>
                  {/* =============================== */}
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.cartId} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-3">
                    <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                    {item.selectedVariants && item.selectedVariants.length > 0 && (
                      <p className="text-xs text-gray-500">{item.selectedVariants.map(v => v.option?.name || '').filter(Boolean).join(', ')}</p>
                    )}
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 flex-shrink-0">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Ongkir{mapResult && !mapResult.isOutOfRange ? ` (${mapResult.zoneName})` : ''}
                  </span>
                  <span className="font-semibold">
                    {mapResult
                      ? (mapResult.isOutOfRange ? <span className="text-red-500 text-xs">Di luar jangkauan</span> : formatPrice(mapResult.fee))
                      : <span className="text-gray-400 text-xs italic">Pilih lokasi di peta</span>}
                  </span>
                </div>
              )}
              {orderType !== 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-semibold text-green-600">GRATIS</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Potongan Promo ({promoCode})</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>TOTAL</span>
                <span className="text-[#8E0E0E] text-xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#8E0E0E]" /> Kode Promo / Kupon
            </h3>
            {promoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                <div>
                  <p className="text-xs text-green-700 font-bold">Kupon Aktif: {promoCode}</p>
                  {promoDiscount > 0 ? (
                    <p className="text-[11px] text-green-700 mt-0.5">Mendapatkan potongan {formatPrice(promoDiscount)}</p>
                  ) : (
                    <p className="text-[11px] text-red-500 mt-0.5">Syarat kupon belum terpenuhi (tambah pesanan lagi)</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearPromoCode}
                  className="text-xs font-bold text-red-650 hover:text-red-800 transition-colors bg-white px-3 py-1.5 border border-red-200 rounded-lg cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan kode kupon (misal: ANNIV25)"
                  id="couponInput"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8E0E0E] uppercase font-mono tracking-wide text-gray-900 bg-white placeholder-gray-400"
                />
                <button
                  type="button"
                  disabled={applyingPromo}
                  onClick={() => {
                    const el = document.getElementById('couponInput') as HTMLInputElement;
                    if (el?.value.trim()) {
                      handleApplyPromo(el.value.trim()).then(() => { el.value = ''; });
                    } else {
                      toast.error('Silakan ketik kode kupon terlebih dahulu');
                    }
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyingPromo ? 'Memvalidasi...' : 'Terapkan'}
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
            <div className="space-y-2">
              {(orderType !== 'delivery'
                ? [
                    { val: 'cod', icon: <Banknote className="w-5 h-5 text-green-600" />, label: 'Tunai', desc: 'Bayar tunai di gerai saat mengambil pesanan' },
                    { val: 'qris', icon: <QrCode className="w-5 h-5 text-blue-600" />, label: 'QRIS', desc: 'Scan & bayar QRIS di gerai saat mengambil pesanan' },
                  ]
                : [
                    { val: 'cod', icon: <Banknote className="w-5 h-5 text-green-600" />, label: 'Tunai COD', desc: 'Bayar tunai ke kurir saat pesanan tiba' },
                    { val: 'qris', icon: <QrCode className="w-5 h-5 text-blue-600" />, label: 'QRIS', desc: 'Scan QRIS & unggah bukti transfer konfirmasi otomatis' },
                  ]
              ).map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setPaymentMethod(opt.val as 'cod' | 'qris')}
                  className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                    paymentMethod === opt.val ? 'border-[#8E0E0E] bg-[#8E0E0E]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex-shrink-0">{opt.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cancel Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedCancel}
                onChange={(e) => {
                  setAgreedCancel(e.target.checked);
                  if (e.target.checked) setErrors((p) => ({ ...p, agreedCancel: '' }));
                }}
                className="sr-only"
              />
              <div
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  agreedCancel ? 'bg-[#8E0E0E] border-[#8E0E0E]' : 'border-gray-300'
                }`}
              >
                {agreedCancel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cek kembali pesanan Anda. Saya menyetujui bahwa pesanan dapat dibatalkan sebelum status timeline pesanan berubah menjadi siap diambil atau diantar.
              </p>
            </label>
            {errors.agreedCancel && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.agreedCancel}</p>}
          </div>

          {/* Terms Agreement */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setErrors((p) => ({ ...p, agreed: '' }));
                }}
                className="sr-only"
              />
              <div
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  agreed ? 'bg-[#8E0E0E] border-[#8E0E0E]' : 'border-gray-300'
                }`}
              >
                {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Saya menyetujui{' '}
                <Link href="/terms" className="text-[#8E0E0E] font-medium hover:underline" target="_blank">Syarat & Ketentuan</Link>
                {' '}dan{' '}
                <Link href="/privacy" className="text-[#8E0E0E] font-medium hover:underline" target="_blank">Kebijakan Privasi</Link>
                {' '}yang berlaku.
              </p>
            </label>
            {errors.agreed && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.agreed}</p>}
          </div>

          {/* Out-of-range warning */}
          {orderType === 'delivery' && mapResult?.isOutOfRange && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-700 text-sm">Lokasi di luar jangkauan pengiriman</p>
                <p className="text-red-600 text-xs">Jarak {mapResult.distanceKm.toFixed(1)} km melebihi batas 10 km. Silakan ubah lokasi atau pilih Pickup.</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isStoreOpen || (orderType === 'delivery' && mapResult?.isOutOfRange === true)}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold text-base hover:from-[#9C1B0B] hover:to-[#D94708] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses Pesanan...
              </>
            ) : !isStoreOpen ? (
              <span className="flex items-center gap-2"><XCircle className="w-5 h-5" /> Toko Sedang Tutup</span>
            ) : (
              <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Pesan Sekarang — {formatPrice(total)}</span>
            )}
          </button>
        </form>
      </div>

      {/* QRIS Modal */}
      {showQrisModal && createdOrderCode && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-4 text-white text-center">
              <h3 className="font-black text-lg">Pembayaran QRIS</h3>
              <p className="text-xs text-white/80">Scan QRIS & Unggah Bukti Pembayaran</p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1 select-none">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-2xl font-black text-[#8E0E0E] mt-1">{formatPrice(serverConfirmedTotal || total)}</p>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Kode Order: {createdOrderCode}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-inner">
                <img
                  src={storeSettingsState?.qris_image_url || '/qris.png'}
                  alt="QRIS Pembayaran Toko"
                  draggable="false"
                  className="w-48 h-48 object-contain rounded-lg border bg-white shadow-sm"
                />
                <p className="text-xs font-bold text-gray-700 mt-2 uppercase tracking-wide text-center">
                  {storeSettingsState?.store_name || 'MERCHANT RESMI'}
                </p>
                {storeSettingsState?.bank_info && (
                  <p className="text-[11px] font-semibold text-blue-700 mt-1 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {storeSettingsState.bank_info}
                  </p>
                )}
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Petunjuk Pembayaran QRIS:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Scan kode QRIS di atas menggunakan aplikasi M-Banking atau E-Wallet Anda (Gopay/OVO/Dana/dll).</li>
                  <li>Masukkan nominal pembayaran tepat sebesar <strong className="text-[#8E0E0E]">{formatPrice(total)}</strong>.</li>
                  <li>Simpan tangkapan layar (screenshot) bukti pembayaran sukses Anda.</li>
                  <li>Unggah screenshot tersebut pada kolom di bawah ini.</li>
                </ol>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Unggah Bukti Pembayaran QRIS</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-[#8E0E0E] rounded-2xl p-4 text-center cursor-pointer transition-all relative bg-gray-50 hover:bg-[#8E0E0E]/5">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-gray-800 select-all">
                    {uploadFile ? uploadFile.name : 'Pilih Gambar Bukti Pembayaran QRIS'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Format gambar JPG, PNG (maks. 5MB)</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={handlePayLater}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors"
              >
                Bayar Nanti
              </button>
              <button
                type="button"
                disabled={uploading || !uploadFile}
                onClick={() => handleUploadProof(createdOrderCode)}
                className="flex-1 py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengunggah...
                  </>
                ) : 'Unggah & Selesai'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
