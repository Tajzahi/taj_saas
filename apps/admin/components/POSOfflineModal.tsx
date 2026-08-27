import React, { useState, useEffect, useRef } from 'react';
import { useAdminStore } from '../store/adminStore';
import { createOfflineOrderAction } from '../app/actions';
import { ShoppingCart, Plus, Minus, Trash2, X, Search, CreditCard, Banknote, Printer, CheckCircle2, Camera, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatRupiah } from '../utils/format';
import PrintReceipt from './PrintReceipt';

interface POSOfflineModalProps {
  onClose: () => void;
  username: string;
}

export default function POSOfflineModal({ onClose, username }: POSOfflineModalProps) {
  const { menuItems, fetchMenuItems, fetchOrders, activeShift } = useAdminStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNo, setTableNo] = useState<string>('');
  const [orderType, setOrderType] = useState<'dine_in' | 'pickup'>('dine_in');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [cashPaid, setCashPaid] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [cart, setCart] = useState<Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderForReceipt, setCompletedOrderForReceipt] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'menu' | 'cart'>('menu');
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran foto terlalu besar (Maks. 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentProofImage(reader.result as string);
      toast.success('Bukti foto pembayaran QRIS berhasil disimpan!');
    };
    reader.readAsDataURL(file);
  };

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Fetch menu items ONCE on mount to prevent infinite re-rendering loop
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Build dynamic categories from actual menu data
  const categories = Array.from(
    new Set(menuItems.filter(m => m.isAvailable).map(m => m.categoryName || 'Lainnya'))
  );

  // Filter menu items
  const filteredItems = menuItems.filter(m => {
    const matchCat = selectedCategory === 'all' || (m.categoryName || 'Lainnya') === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchCat && matchSearch && m.isAvailable;
  });

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.id === id) {
          const newQty = c.qty + delta;
          return newQty > 0 ? { ...c, qty: newQty } : null;
        }
        return c;
      }).filter(Boolean) as any;
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.10); // 10% PB1
  const grandTotal = subtotal + tax;

  const parsedCash = cashPaid ? Number(cashPaid.replace(/\./g, '').replace(/,/g, '.')) : 0;
  const change = paymentMethod === 'cod' ? parsedCash - grandTotal : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Keranjang pesanan masih kosong!');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Silakan isi Nama Pelanggan!');
      return;
    }
    if (paymentMethod === 'cod' && parsedCash < grandTotal) {
      toast.error('Uang tunai pembayaran kurang!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOfflineOrderAction({
        customerName: customerName.trim(),
        orderType,
        tableNo: orderType === 'dine_in' ? tableNo : undefined,
        items: cart,
        totalPrice: grandTotal,
        paymentMethod,
        paymentProofUrl: paymentProofImage,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        toast.success(`Pesanan #${res.orderCode} Berhasil Disimpan ke Database!`);
        fetchOrders(); // Refresh order queue in admin store
        setCompletedOrderForReceipt({
          id: res.order?.id || `off-${Date.now()}`,
          orderCode: res.orderCode || 'ORD-OFFLINE',
          customerName: customerName.trim(),
          items: cart.map(c => ({ menuItemName: c.name, quantity: c.qty, totalPrice: c.price * c.qty })),
          totalPrice: grandTotal,
          paymentMethod,
          createdAt: new Date().toISOString(),
        });
      } else {
        toast.error('Gagal menyimpan pesanan: ' + (res.error || 'Terjadi kesalahan'));
      }
    } catch (err: any) {
      toast.error('Gagal membuat pesanan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-6xl h-[100dvh] sm:h-[92vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 via-rose-700 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-lg leading-tight uppercase tracking-tight">Kasir Direct POS Offline</h2>
              <p className="text-[10px] sm:text-xs text-white/80">Input pesanan pembeli langsung di tempat & cetak nota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Bar (< md) */}
        <div className="flex md:hidden bg-slate-100 dark:bg-slate-950 p-1 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('menu')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'menu'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            🍔 Pilih Menu ({menuItems.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('cart')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
              mobileTab === 'cart'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            🛒 Keranjang & Bayar
            {cart.length > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Content Body: 3-Column Layout for Desktop & Single Scroll View for Mobile */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* 1. KOLOM KIRI: Katalog Pilih Menu & Filter */}
          <div className={`flex-1 flex-col h-full bg-slate-50 dark:bg-slate-950/50 p-2.5 sm:p-4 overflow-x-hidden overflow-y-auto md:overflow-hidden w-full max-w-full min-w-0 ${mobileTab === 'menu' ? 'flex' : 'hidden md:flex'}`}>
            
            {/* Search & Category Filter Bar */}
            <div className="space-y-2.5 mb-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama menu makanan / minuman..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-medium"
                />
              </div>

              {/* Categories Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-orange-300'
                  }`}
                >
                  Semua ({menuItems.filter(m => m.isAvailable).length})
                </button>
                {categories.map((cat) => {
                  const count = menuItems.filter(m => (m.categoryName || 'Lainnya') === cat && m.isAvailable).length;
                  if (count === 0) return null;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-orange-300'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                  <p className="text-sm font-medium">Menu tidak ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {filteredItems.map((item) => {
                    const inCart = cart.find(c => c.id === item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className={`bg-white dark:bg-slate-900 p-3 rounded-2xl border transition-all cursor-pointer hover:border-orange-500 hover:shadow-md flex flex-col justify-between relative group ${
                          inCart ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20 dark:bg-orange-950/20' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {inCart && (
                          <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 z-10">
                            {inCart.qty}
                          </span>
                        )}

                        <div>
                          <p className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug pr-6">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.categoryName || 'Menu'}</p>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400">
                            Rp {Number(item.price).toLocaleString('id-ID')}
                          </span>
                          <span className="p-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Bottom Sticky Action Bar */}
            {cart.length > 0 && (
              <div className="md:hidden pt-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileTab('cart')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-extrabold text-xs flex items-center justify-between shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    {cart.reduce((s, i) => s + i.qty, 0)} Item Dipilih
                  </span>
                  <span>Lanjut Bayar (Rp {grandTotal.toLocaleString('id-ID')}) &rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. KOLOM TENGAH: Item Dipilih / Keranjang Pesanan */}
          <div className={`w-full md:w-[250px] lg:w-[280px] xl:w-[300px] bg-slate-50/80 dark:bg-slate-900/60 flex-col h-auto md:h-full shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 ${mobileTab === 'cart' ? 'flex' : 'hidden md:flex'}`}>
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-500" />
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                  Item Dipilih ({cart.reduce((s, i) => s + i.qty, 0)})
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Kosongkan
                </button>
              )}
            </div>

            <div className="p-3 space-y-2 max-h-52 md:max-h-none md:flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="h-28 md:h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
                  <ShoppingCart className="w-6 h-6 text-slate-300 mb-1" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Keranjang Masih Kosong</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Klik item menu di tab Pilih Menu untuk menambah ke pesanan</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{item.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400 shrink-0">
                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-medium text-slate-400">Jumlah Qty:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-slate-900 dark:text-slate-100">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="w-5 h-5 rounded-md bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. KOLOM KANAN: Form Pembeli, Transaksi & Pembayaran */}
          <div className={`w-full md:w-[280px] lg:w-[310px] xl:w-[340px] bg-white dark:bg-slate-900 flex-col h-auto md:h-full shrink-0 overflow-y-visible md:overflow-y-auto pb-20 md:pb-6 ${mobileTab === 'cart' ? 'flex' : 'hidden md:flex'}`}>
            
            {/* Customer Details Form */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Nama Pembeli *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="misal: Mas Bambang"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Tipe Pesanan</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine_in')}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                        orderType === 'dine_in' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Dine-in
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                        orderType === 'pickup' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Pickup
                    </button>
                  </div>
                </div>
              </div>

              {orderType === 'dine_in' && (
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Nomor Meja (Opsional)</label>
                  <input
                    type="text"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    placeholder="misal: Meja 05"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Payment & Totals Section */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3 shrink-0 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1.5">Metode Pembayaran</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'cod'
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      Tunai (Cash)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'transfer'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      QRIS / Transfer
                    </button>
                  </div>
                </div>

                {/* Cash Paid Calculator if Cash Selected */}
                {paymentMethod === 'cod' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500">
                      Uang Diterima Kasir
                    </label>
                    <input
                      type="text"
                      value={cashPaid}
                      onChange={(e) => setCashPaid(e.target.value)}
                      placeholder={`misal: ${grandTotal.toLocaleString('id-ID')}`}
                      className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />

                    {/* Quick Cash Preset Nominal Buttons */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setCashPaid(String(grandTotal))}
                        className="py-1 px-1 bg-white dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-950 text-slate-700 dark:text-slate-300 hover:text-green-700 rounded-lg text-[10px] font-extrabold border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                      >
                        Uang Pas
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashPaid('20000')}
                        className="py-1 px-1 bg-white dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-950 text-slate-700 dark:text-slate-300 hover:text-green-700 rounded-lg text-[10px] font-extrabold border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                      >
                        20rb
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashPaid('50000')}
                        className="py-1 px-1 bg-white dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-950 text-slate-700 dark:text-slate-300 hover:text-green-700 rounded-lg text-[10px] font-extrabold border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                      >
                        50rb
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashPaid('100000')}
                        className="py-1 px-1 bg-white dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-950 text-slate-700 dark:text-slate-300 hover:text-green-700 rounded-lg text-[10px] font-extrabold border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                      >
                        100rb
                      </button>
                    </div>
                  </div>
                )}

                {/* QRIS / Transfer Photo Upload & Camera Box */}
                {paymentMethod === 'transfer' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500">
                      Foto Bukti Pembayaran QRIS / Struk Transfer
                    </label>

                    {paymentProofImage ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500 bg-slate-900/10 shadow-sm group">
                        <img
                          src={paymentProofImage}
                          alt="Bukti Pembayaran QRIS"
                          className="w-full h-32 object-contain bg-white dark:bg-slate-900 p-1"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={() => setPaymentProofImage(null)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus / Ambil Ulang
                          </button>
                        </div>
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          ✓ Bukti Tersimpan
                        </span>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 rounded-2xl p-3 text-center bg-white dark:bg-slate-900 transition-all">
                        <Camera className="w-6 h-6 text-orange-500 mx-auto mb-1 animate-pulse" />
                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Foto / Unggah Bukti QRIS</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Ambil foto HP pembeli / struk transfer</p>

                        <label className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Kamera / Unggah Foto
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Summary Calculations & Submit Button */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pajak (PPN 10%):</span>
                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    <span>TOTAL BAYAR:</span>
                    <span className="text-orange-600 dark:text-orange-400 font-black">Rp {grandTotal.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Highlight Uang Kembali di Bawah Total Bayar */}
                  {paymentMethod === 'cod' && (
                    <div className="flex items-center justify-between font-extrabold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 mt-2">
                      <span>Uang Kembali Kasir:</span>
                      <span className="font-mono font-black text-sm">
                        Rp {change >= 0 ? change.toLocaleString('id-ID') : 0}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-orange-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  {isSubmitting ? 'Memproses Pesanan...' : 'PROSES PESANAN & CETAK STRUK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto Thermal Print Modal when Completed */}
      {completedOrderForReceipt && (
        <div className="fixed inset-0 z-[600] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full space-y-4 shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">Pesanan Selesai!</h3>
              <p className="text-xs text-gray-500">Nota #{completedOrderForReceipt.orderCode} berhasil dibuat</p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Struk Kasir
              </button>
              <button
                onClick={() => {
                  setCompletedOrderForReceipt(null);
                  setCart([]);
                  setCustomerName('');
                  setCashPaid('');
                  onClose();
                }}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                Selesai & Tutup
              </button>
            </div>
            <div className="hidden">
              <PrintReceipt order={completedOrderForReceipt} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
