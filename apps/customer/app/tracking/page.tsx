"use client";
import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, AlertTriangle, X, Copy, CheckCircle, ClipboardList, Flame, Package, CheckCircle2, XCircle, Banknote, QrCode, ShieldCheck, FileText, AlertCircle, UploadCloud, Inbox, MessageSquare, ShoppingBag, Truck } from 'lucide-react';
import { useOrderStore, Order } from '@/store/cartStore';
import { formatPrice } from '@/data/menu';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  received: {
    label: 'Pesanan Diterima',
    color: 'blue',
    icon: 'ClipboardList',
    desc: 'Pesanan Anda sudah kami terima dan sedang menunggu konfirmasi.',
    step: 1,
  },
  processing: {
    label: 'Sedang Diproses',
    color: 'yellow',
    icon: 'Flame',
    desc: 'Pesanan Anda sedang dimasak dengan penuh kasih sayang! 🍫',
    step: 2,
  },
  ready: {
    label: 'Siap Diambil / Sedang Diantar',
    color: 'orange',
    icon: 'Package',
    desc: '',
    step: 3,
  },
  completed: {
    label: 'Selesai',
    color: 'green',
    icon: 'CheckCircle2',
    desc: 'Terima kasih! Pesanan Anda telah selesai. Sampai jumpa lagi!',
    step: 4,
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'red',
    icon: 'XCircle',
    desc: 'Pesanan Anda telah dibatalkan. Hubungi kami untuk informasi lebih lanjut.',
    step: 0,
  },
};

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', dot: 'bg-yellow-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
};

const timelineSteps: { step: number; label: string; icon: string; key: Order['status'] }[] = [
  { step: 1, label: 'Diterima', icon: 'ClipboardList', key: 'received' },
  { step: 2, label: 'Diproses', icon: 'Flame', key: 'processing' },
  { step: 3, label: 'Siap/Diantar', icon: 'Package', key: 'ready' },
  { step: 4, label: 'Selesai', icon: 'CheckCircle2', key: 'completed' },
];

export default function Tracking() {
  const [inputCode, setInputCode] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { currentOrder, getOrderByCode } = useOrderStore();

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Phone search states
  const [inputPhone, setInputPhone] = useState('');
  const [searchingPhone, setSearchingPhone] = useState(false);
  const [foundOrders, setFoundOrders] = useState<any[]>([]);
  const [phoneSearched, setPhoneSearched] = useState(false);

  const handleUploadProof = async () => {
    if (!order || !uploadFile) {
      toast.error('Silakan pilih gambar bukti transfer terlebih dahulu');
      return;
    }

    if (uploadFile.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB. Silakan pilih file yang lebih kecil.');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = 'https://placehold.co/400x600/16a34a/white?text=Bukti+Transfer+MOCK';
      
      const res = await fetch(`/api/orders/${order.orderCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProofUrl: publicUrl }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengunggah bukti ke database');
      }
      
      // Update local state
      setOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentStatus: 'waiting_verification',
          paymentProofUrl: publicUrl,
        };
      });

      // Update in Zustand order history
      const history = useOrderStore.getState().orderHistory;
      const updatedHistory = history.map((o) =>
        o.orderCode === order.orderCode
          ? { ...o, paymentStatus: 'waiting_verification', paymentProofUrl: publicUrl }
          : o
      );
      useOrderStore.setState({
        orderHistory: updatedHistory,
        currentOrder:
          useOrderStore.getState().currentOrder?.orderCode === order.orderCode
            ? {
                ...useOrderStore.getState().currentOrder!,
                paymentStatus: 'waiting_verification',
                paymentProofUrl: publicUrl,
              }
            : useOrderStore.getState().currentOrder,
      });

      toast.success('Bukti transfer berhasil diunggah! Menunggu verifikasi admin.');
      setUploadFile(null);
      setShowQrisModal(false);
    } catch (err: any) {
      console.error('Error uploading payment proof:', err);
      toast.error(`Gagal mengunggah bukti: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setUploading(false);
    }
  };

  const getWhatsAppLink = (ord: Order) => {
    const itemsSummary = ord.items
      .map((i) => `- ${i.menuItem.name} x${i.quantity} = ${formatPrice(i.totalPrice)}`)
      .join('%0A');
    const paymentLabel = ord.orderType === 'pickup'
      ? (ord.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
      : (ord.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS');
    const msg =
      `Halo A6 Nyuss! Saya sudah melakukan pemesanan online%0A%0A` +
      `*Kode Order: ${ord.orderCode}*%0A%0A` +
      `*Detail Pesanan:*%0A${itemsSummary}%0A%0A` +
      `*Total: ${formatPrice(ord.total)}*%0A` +
      `*Tipe: ${ord.orderType === 'pickup' ? 'Pickup' : 'Delivery'}*%0A` +
      `*Pembayaran: ${paymentLabel}*%0A%0A` +
      `Mohon dikonfirmasi ya! Terima kasih`;
    return `https://wa.me/6287811123482?text=${msg}`;
  };

  const handleCancelOrder = () => {
    if (!order) return;
    setShowCancelModal(true);
  };

  const executeCancelOrder = async () => {
    if (!order) return;
    setShowCancelModal(false);
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.orderCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal membatalkan pesanan di server');
      }

      useOrderStore.getState().updateOrderStatus(order.orderCode, 'cancelled');
      setOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'cancelled',
        };
      });
      toast.success("Pesanan berhasil dibatalkan");
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      toast.error(`Gagal membatalkan pesanan: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setCancelling(false);
    }
  };

  const fetchOrderFromDb = async (code: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${code}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Gagal mengambil data pesanan dari database');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching order:', err);
      // Fallback to local store for offline/unseeded dev compatibility
      return useOrderStore.getState().getOrderByCode(code) || null;
    }
  };

  // Check for successful checkout redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('new') === 'true' || searchParams.get('success') === 'true') {
        setShowSuccessModal(true);
        // Clear parameter from URL to prevent showing modal again on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const handleSearchPhone = async () => {
    const trimmedPhone = inputPhone.trim().replace(/\s/g, '');
    if (!trimmedPhone) {
      toast.error('Silakan masukkan nomor HP terlebih dahulu');
      return;
    }

    setSearchingPhone(true);
    setPhoneSearched(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Search from local order history
      const localHistory = useOrderStore.getState().orderHistory;
      const filtered = localHistory.filter((o) => o.customerPhone.replace(/\s/g, '') === trimmedPhone);
      
      const mapped = filtered.map(o => ({
        order_code: o.orderCode,
        status: o.status,
        created_at: o.createdAt,
        total_price: o.total,
      }));
      setFoundOrders(mapped);
    } catch (err: any) {
      console.error('Error searching orders by phone:', err);
      toast.error('Gagal mencari pesanan. Silakan coba lagi.');
    } finally {
      setSearchingPhone(false);
    }
  };

  // Auto-load current order with 15 minutes expiry check after completion
  useEffect(() => {
    if (currentOrder) {
      if (currentOrder.status === 'completed' || currentOrder.status === 'cancelled') {
        const finishedTime = currentOrder.updatedAt ? new Date(currentOrder.updatedAt).getTime() : new Date(currentOrder.createdAt).getTime();
        const isExpired = Date.now() - finishedTime > 15 * 60 * 1000; // 15 minutes in ms

        if (isExpired) {
          useOrderStore.setState({ currentOrder: null });
          setOrder(null);
          setInputCode('');
          return;
        }
      }

      setInputCode(currentOrder.orderCode);
      setSearching(true);
      fetchOrderFromDb(currentOrder.orderCode).then((dbOrder) => {
        if (dbOrder) {
          if (dbOrder.status === 'completed' || dbOrder.status === 'cancelled') {
            const finishedTime = dbOrder.updatedAt ? new Date(dbOrder.updatedAt).getTime() : new Date(dbOrder.createdAt).getTime();
            const isExpired = Date.now() - finishedTime > 15 * 60 * 1000;

            if (isExpired) {
              useOrderStore.setState({ currentOrder: null });
              setOrder(null);
              setInputCode('');
              setSearching(false);
              return;
            }
          }
          setOrder(dbOrder);
        } else {
          setOrder(null);
        }
        setSearching(false);
      });
    }
  }, [currentOrder]);

  // Periodic check to clear tracking if active order is completed/cancelled and older than 15 minutes
  useEffect(() => {
    if (!currentOrder) return;

    const checkExpiry = () => {
      const activeStatus = order?.status || currentOrder.status;
      const activeUpdatedAt = order?.updatedAt || currentOrder.updatedAt || currentOrder.createdAt;

      if (activeStatus === 'completed' || activeStatus === 'cancelled') {
        const finishedTime = new Date(activeUpdatedAt).getTime();
        if (Date.now() - finishedTime > 15 * 60 * 1000) { // 15 minutes
          useOrderStore.setState({ currentOrder: null });
          setOrder(null);
          setInputCode('');
          toast.success("Sesi pelacakan telah berakhir setelah 15 menit status selesai.");
        }
      }
    };

    const interval = setInterval(checkExpiry, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [currentOrder, order]);

  // Poll order status periodically (replaces unsafe Realtime subscription that required USING(true) RLS)
  useEffect(() => {
    if (!order) return;

    // Do not poll if the order is already in a final state (completed or cancelled)
    if (order.status === 'completed' || order.status === 'cancelled') return;

    const intervalId = setInterval(async () => {
      const dbOrder = await fetchOrderFromDb(order.orderCode);
      if (dbOrder) {
        // Check for updates
        const hasStatusChanged = dbOrder.status !== order.status;
        const hasPaymentStatusChanged = dbOrder.paymentStatus !== order.paymentStatus;
        const hasPaymentProofChanged = dbOrder.paymentProofUrl !== order.paymentProofUrl;

        if (hasStatusChanged || hasPaymentStatusChanged || hasPaymentProofChanged) {
          setOrder(dbOrder);

          if (hasStatusChanged) {
            toast.success(
              `Status pesanan diperbarui menjadi: ${
                statusConfig[dbOrder.status as keyof typeof statusConfig]?.label || dbOrder.status
              }`,
              { id: 'status-update' }
            );

            // Update status in Zustand store
            useOrderStore.getState().updateOrderStatus(order.orderCode, dbOrder.status);

            // Sync with currentOrder in Zustand store
            const storeCurrentOrder = useOrderStore.getState().currentOrder;
            if (storeCurrentOrder && storeCurrentOrder.orderCode === order.orderCode) {
              useOrderStore.setState({
                currentOrder: {
                  ...storeCurrentOrder,
                  status: dbOrder.status,
                  updatedAt: dbOrder.updatedAt || new Date().toISOString()
                }
              });
            }
          }

          if (hasPaymentStatusChanged) {
            const paymentLabels: Record<string, string> = {
              pending: 'Pending',
              waiting_verification: 'Menunggu Verifikasi',
              paid: 'Lunas',
              failed: 'Gagal Verifikasi'
            };
            const currentPaymentStatus = dbOrder.paymentStatus || 'pending';
            toast.success(
              `Status pembayaran diperbarui menjadi: ${
                paymentLabels[currentPaymentStatus] || currentPaymentStatus
              }`,
              { id: 'payment-update' }
            );
          }
        }
      } else {
        setOrder(null);
        setNotFound(true);
        toast.error("Pesanan ini telah dihapus dari sistem", { id: 'status-delete' });
      }
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(intervalId);
  }, [order?.orderCode, order?.status, order?.paymentStatus, order?.paymentProofUrl]);

  const handleSearch = async () => {
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) return;

    setSearching(true);
    const dbOrder = await fetchOrderFromDb(trimmed);
    setSearching(false);

    if (dbOrder) {
      setOrder(dbOrder);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const currentStatus = order ? statusConfig[order.status] : null;
  const currentStep = order?.status === 'cancelled' ? -1 : (currentStatus?.step ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-10 px-4 mb-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Lacak Pesanan</h1>
          <p className="text-white/80 text-sm">Masukkan kode pesanan untuk melihat status terkini</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Search Panel - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Column 1: Track with Order Code */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" /> Lacak Pesanan
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Masukkan kode unik pesanan Anda untuk memantau status secara realtime.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Contoh: A6-20260101-1234"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E0E0E] font-mono tracking-wider uppercase text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearch}
                disabled={searching}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {searching ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Lacak Pesanan
              </button>
              {notFound && (
                <p className="text-red-500 text-xs font-semibold mt-2 text-center">
                  Kode pesanan tidak ditemukan. Periksa kembali kode Anda.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Find Order Code using Phone Number */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Cari Kode (Lupa Kode?)
              </h3>
              <p className="text-xs text-gray-550 mb-4">
                Masukkan nomor HP Anda untuk mencari riwayat kode pesanan Anda.
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchPhone()}
                  placeholder="Contoh: 08123456789"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E0E0E] font-mono text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearchPhone}
                disabled={searchingPhone}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {searchingPhone ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Cari Kode
              </button>
            </div>
          </div>
        </div>

        {/* Search Phone Results */}
        {phoneSearched && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-top-4 duration-200">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Hasil Pencarian Nomor HP: {inputPhone}
            </h4>
            {foundOrders.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">Ditemukan {foundOrders.length} pesanan. Klik pesanan di bawah untuk langsung melacak:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {foundOrders.map((fo) => (
                    <div 
                      key={fo.order_code}
                      onClick={() => {
                        setInputCode(fo.order_code);
                        setSearching(true);
                        fetchOrderFromDb(fo.order_code).then((dbOrder) => {
                          if (dbOrder) {
                            setOrder(dbOrder);
                            setNotFound(false);
                            toast.success(`Melacak pesanan: ${fo.order_code}`);
                          } else {
                            setOrder(null);
                            setNotFound(true);
                          }
                          setSearching(false);
                        });
                      }}
                      className="flex flex-col p-3 border border-gray-150 hover:border-[#8E0E0E] rounded-xl text-left bg-gray-50/50 hover:bg-[#8E0E0E]/5 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-sm text-[#8E0E0E] group-hover:underline">
                          {fo.order_code}
                        </span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          {statusConfig[fo.status as keyof typeof statusConfig]?.label || fo.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>{new Date(fo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-bold text-gray-700">{formatPrice(fo.total_price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
                <Inbox className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-xs font-bold">Tidak ditemukan pesanan untuk nomor HP tersebut.</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Pastikan nomor HP yang Anda masukkan sama persis dengan saat memesan.</p>
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        {order && currentStatus && (
          <>
            {/* Status Badge */}
            <div className={`rounded-2xl p-5 border-2 mb-5 ${colorMap[currentStatus.color as keyof typeof colorMap].bg} ${colorMap[currentStatus.color as keyof typeof colorMap].border}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`p-2 rounded-xl bg-white flex items-center justify-center ${colorMap[currentStatus.color as keyof typeof colorMap].text}`}>
                  {currentStatus.icon === 'ClipboardList' && <ClipboardList className="w-6 h-6" />}
                  {currentStatus.icon === 'Flame' && <Flame className="w-6 h-6" />}
                  {currentStatus.icon === 'Package' && <Package className="w-6 h-6" />}
                  {currentStatus.icon === 'CheckCircle2' && <CheckCircle2 className="w-6 h-6" />}
                  {currentStatus.icon === 'XCircle' && <XCircle className="w-6 h-6" />}
                </span>
                <div>
                  <p className="text-xs font-medium text-gray-600">Status Pesanan</p>
                  <p className={`font-black text-xl ${colorMap[currentStatus.color as keyof typeof colorMap].text}`}>
                    {currentStatus.label}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${colorMap[currentStatus.color as keyof typeof colorMap].text}`}>
                {order.status === 'ready'
                  ? order.orderType === 'pickup'
                    ? 'Pesanan siap diambil! Silakan datang ke toko kami.'
                    : 'Pesanan sedang dalam perjalanan ke alamat Anda!'
                  : currentStatus.desc}
              </p>
            </div>

            {/* Payment Status Badge / Action Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
              <h3 className="font-bold text-gray-800 mb-4">Status Pembayaran</h3>
              
              {order.paymentMethod === 'cod' ? (
                <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl p-4">
                  <Banknote className="w-6 h-6 text-[#E05009] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {order.orderType === 'pickup' ? 'Bayar Tunai di Gerai' : 'Bayar di Tempat (Tunai COD)'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.orderType === 'pickup'
                        ? 'Selesaikan pembayaran tunai saat mengambil pesanan.'
                        : 'Selesaikan pembayaran tunai ke kurir saat menerima pesanan.'}
                    </p>
                    <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 uppercase">
                      {order.orderType === 'pickup' ? 'Tunai • Pending' : 'Tunai COD • Pending'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Transfer Bank / QRIS */
                <div className="space-y-4">
                  {order.paymentStatus === 'pending' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-red-800">Menunggu Pembayaran</p>
                          <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                            Kami belum menerima bukti pembayaran untuk pesanan ini. Silakan scan QRIS untuk membayar dan upload bukti agar pesanan segera dikonfirmasi.
                          </p>
                          <button
                            onClick={() => setShowQrisModal(true)}
                            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" /> Bayar & Upload Bukti
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'waiting_verification' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-amber-800">Menunggu Verifikasi Admin</p>
                          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                            Bukti pembayaran telah berhasil diunggah. Kami sedang melakukan verifikasi data pembayaran QRIS Anda. Mohon ditunggu sebentar ya!
                          </p>
                          {order.paymentProofUrl && (
                            <div className="mt-3">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Bukti Pembayaran QRIS Anda:</p>
                              <a
                                href={order.paymentProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                              >
                                <img
                                  src={order.paymentProofUrl}
                                  alt="Bukti Pembayaran QRIS"
                                  draggable="false"
                                  className="w-20 h-20 object-cover rounded-lg border hover:opacity-85 transition-all shadow-sm"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'paid' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-green-800">Pembayaran Terverifikasi (Lunas)</p>
                          <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                            Pembayaran Anda telah sukses diverifikasi oleh Admin. Pesanan Anda akan diproses sesuai jadwal. Terima kasih banyak!
                          </p>
                          {order.paymentProofUrl && (
                            <div className="mt-2">
                              <a
                                href={order.paymentProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-green-700 font-bold hover:underline"
                              >
                                <FileText className="w-3 h-3 inline mr-1" /> Lihat Bukti Pembayaran
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'failed' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-rose-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-rose-800">Verifikasi Pembayaran Gagal</p>
                          <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                            Bukti pembayaran yang Anda unggah dinilai tidak valid atau dana belum masuk ke rekening kami. Silakan upload bukti transfer yang benar atau hubungi admin.
                          </p>
                          <button
                            onClick={() => setShowQrisModal(true)}
                            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" /> Upload Bukti Baru
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
                <h3 className="font-bold text-gray-800 mb-5">Timeline Pesanan</h3>
                <div className="space-y-0">
                  {timelineSteps.map((ts, index) => {
                    const isDone = currentStep >= ts.step;
                    const isCurrent = currentStep === ts.step;
                    return (
                      <div key={ts.key} className="flex gap-4">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                              isDone
                                ? 'bg-[#8E0E0E] border-[#8E0E0E] text-white'
                                : 'bg-gray-100 border-gray-200 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-[#8E0E0E]/20' : ''}`}
                          >
                            {ts.icon === 'ClipboardList' && <ClipboardList className="w-5 h-5" />}
                            {ts.icon === 'Flame' && <Flame className="w-5 h-5" />}
                            {ts.icon === 'Package' && <Package className="w-5 h-5" />}
                            {ts.icon === 'CheckCircle2' && <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          {index < timelineSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-8 mt-1 ${isDone && currentStep > ts.step ? 'bg-[#8E0E0E]' : 'bg-gray-200'}`}
                            />
                          )}
                        </div>
                        {/* Label */}
                        <div className="pb-6 pt-1.5">
                          <p className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {ts.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-[#E05009] font-medium">● Saat ini</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pickup Info */}
            {order.status === 'ready' && order.orderType === 'pickup' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Lokasi Pengambilan
                </h3>
                <div className="text-green-700 text-sm mb-3">
                  <p className="font-semibold">Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179</p>
                  <p className="text-green-800 text-xs mt-0.5 font-medium">Depan Mess DITPOLARIUD POLDA JATIM SURABAYA.</p>
                </div>
                <a
                  href="https://www.google.com/maps?q=-7.243211171142016,112.71769837365488"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Buka di Google Maps
                </a>
              </div>
            )}

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
              <h3 className="font-bold text-gray-800 mb-4">Info Pesanan</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kode Order</span>
                  <span className="font-mono font-bold text-gray-900">{order.orderCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipe</span>
                  <span className="font-medium flex items-center gap-1.5">{order.orderType === 'pickup' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />} {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Metode Pembayaran</span>
                  <span className="font-medium uppercase flex items-center justify-end gap-1.5">
                    {order.paymentMethod === 'cod' ? <Banknote className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                    {order.orderType === 'pickup'
                      ? (order.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                      : (order.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-[#8E0E0E]">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Waktu Pesan</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 pt-4 border-t space-y-2">
                {order.items.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.menuItem.name} x{item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Order Button */}
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5 text-center">
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Pesanan hanya dapat dibatalkan sebelum masuk ke tahap siap diambil atau diantar.
                </p>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling || order.status === 'ready'}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    order.status === 'ready'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer'
                  }`}
                >
                  {cancelling ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                      Membatalkan...
                    </div>
                  ) : (
                    'Batalkan Pesanan'
                  )}
                </button>
              </div>
            )}

            {/* Help */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Ada masalah?</p>
                  <p className="text-gray-500 text-xs">Hubungi kami langsung</p>
                </div>
              </div>
              <a
                href={getWhatsAppLink(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            {/* Auto refresh note */}
            <div className="text-center mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Status diperbarui secara <strong>real-time</strong> otomatis</span>
            </div>
          </>
        )}

        {/* Empty state */}
        {!order && !notFound && (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p className="font-medium">Masukkan kode pesanan untuk melacak</p>
            <p className="text-sm mt-1">Kode pesanan diberikan setelah order berhasil dibuat</p>
          </div>
        )}
      </div>

      {/* QRIS Upload Modal */}
      {showQrisModal && order && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-4 text-white text-center">
              <h3 className="font-black text-lg">Pembayaran QRIS</h3>
              <p className="text-xs text-white/80">Scan QRIS & Unggah Bukti Pembayaran</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 select-none">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-2xl font-black text-[#8E0E0E] mt-1">{formatPrice(order.total)}</p>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Kode Order: {order.orderCode}</p>
              </div>

              {/* QRIS Image Box */}
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-inner">
                <img
                  src="/qris.png"
                  alt="QRIS A6 Nyuss"
                  draggable="false"
                  className="w-48 h-48 object-contain rounded-lg border bg-white shadow-sm"
                />
                <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">A6 NYUSS MARTABAK</p>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-xs text-amber-800 space-y-1">
                <p className="font-bold">Petunjuk Transfer:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Scan kode QRIS di atas menggunakan aplikasi M-Banking atau E-Wallet Anda (Gopay/OVO/Dana/dll).</li>
                  <li>Masukkan nominal transfer tepat sebesar <strong className="text-[#8E0E0E]">{formatPrice(order.total)}</strong>.</li>
                  <li>Simpan tangkapan layar (screenshot) bukti transfer sukses Anda.</li>
                  <li>Unggah screenshot tersebut pada kolom di bawah ini.</li>
                </ol>
              </div>

              {/* File Upload Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Unggah Bukti Transfer</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-[#8E0E0E] rounded-2xl p-4 text-center cursor-pointer transition-all relative bg-gray-50 hover:bg-[#8E0E0E]/5 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                  <p className="text-sm font-semibold text-gray-850 select-all">
                    {uploadFile ? uploadFile.name : 'Pilih Gambar Bukti Transfer'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Format gambar JPG, PNG (maks. 5MB)</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => { setShowQrisModal(false); setUploadFile(null); }}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={uploading || !uploadFile}
                onClick={handleUploadProof}
                className="flex-1 py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  'Unggah Bukti'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (order || currentOrder) && (() => {
          const ord = order || currentOrder;
          if (!ord) return null;
          
          const handleCopyCode = () => {
            navigator.clipboard.writeText(ord.orderCode);
            setCopied(true);
            toast.success('Kode pesanan berhasil disalin!');
            setTimeout(() => setCopied(false), 2050);
          };

          return (
            <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh]"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] p-6 text-white text-center relative overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-xl">Pesanan Berhasil Dibuat!</h3>
                  <p className="text-xs text-white/85 mt-1">Terima kasih {ord.customerName}, pesanan Anda sedang kami proses.</p>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1 select-none text-sm">
                  {/* Order Code Container */}
                  <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kode Pesanan Anda</p>
                    <p className="text-2xl font-black text-[#8E0E0E] tracking-wider font-mono uppercase">{ord.orderCode}</p>
                    <button
                      onClick={handleCopyCode}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8E0E0E]/10 hover:bg-[#8E0E0E]/20 text-[#8E0E0E] rounded-xl text-xs font-bold transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Tersalin!' : 'Salin Kode'}
                    </button>
                    <p className="text-[10px] text-gray-400 font-medium mt-2">
                      Simpan/salin kode ini untuk melacak pesanan di masa mendatang.
                    </p>
                  </div>

                  {/* Estimasi Waktu */}
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl p-3 text-orange-850">
                    <Clock className="w-5 h-5 text-[#E05009] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Estimasi Waktu Proses</p>
                      <p className="text-xs mt-0.5">
                        ~{ord.estimatedTime} menit ({ord.orderType === 'pickup' ? 'Siap Diambil' : 'Sampai Alamat'})
                      </p>
                    </div>
                  </div>

                  {/* Rincian Ringkas Pesanan */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Rincian Belanja</h4>
                    <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 bg-gray-50/50">
                      {ord.items.map((item) => (
                        <div key={item.cartId} className="p-3 flex justify-between items-start text-xs">
                          <div>
                            <p className="font-semibold text-gray-800">{item.menuItem.name} x{item.quantity}</p>
                            {item.selectedVariants.length > 0 && (
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                {item.selectedVariants.map(v => v.option.name).join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-gray-900">{formatPrice(item.totalPrice)}</span>
                        </div>
                      ))}
                      <div className="p-3 bg-white text-xs font-bold text-gray-900 space-y-1.5 rounded-b-xl">
                        <div className="flex justify-between font-normal text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatPrice(ord.subtotal)}</span>
                        </div>
                        {ord.deliveryFee > 0 && (
                          <div className="flex justify-between font-normal text-gray-600">
                            <span>Ongkos Kirim</span>
                            <span>{formatPrice(ord.deliveryFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-1.5 text-sm text-[#8E0E0E] font-black">
                          <span>TOTAL</span>
                          <span>{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Catatan tipe pembayaran */}
                  <div className="flex justify-between text-xs font-semibold text-gray-600 bg-stone-50 border p-3 rounded-xl">
                    <span>Metode Pembayaran:</span>
                    <span className="uppercase text-gray-850">
                      {ord.orderType === 'pickup'
                        ? (ord.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                        : (ord.paymentMethod === 'cod' ? 'Tunai COD (Bayar di Tempat)' : 'QRIS')}
                    </span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t bg-gray-55 flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  <a
                    href={getWhatsAppLink(ord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all shadow-md text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Konfirmasi via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors cursor-pointer text-center"
                  >
                    Lanjut ke Pelacakan
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Custom Confirmation Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && order && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-150 flex flex-col"
            >
              {/* Header Icon */}
              <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100 relative">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3 shadow-inner">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="font-black text-xl text-gray-900">Batalkan Pesanan?</h3>
                <p className="text-xs text-red-500 font-bold mt-1 uppercase tracking-wider">Tindakan Permanen</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-center space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Apakah Anda yakin ingin membatalkan pesanan dengan Kode Order:
                </p>
                <p className="font-mono font-black text-base text-gray-900 bg-gray-50 border py-2 px-3 rounded-xl inline-block shadow-inner">
                  {order.orderCode}
                </p>
                <p className="text-xs text-gray-400 italic">
                  Catatan: Pesanan yang telah dibatalkan tidak dapat diaktifkan kembali.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-gray-50 border-t flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors shadow-sm cursor-pointer"
                >
                  Tidak, Kembali
                </button>
                <button
                  type="button"
                  onClick={executeCancelOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-[#8E0E0E] to-red-600 hover:from-[#9C1B0B] hover:to-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Ya, Batalkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
