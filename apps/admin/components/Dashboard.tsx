import { useEffect, useRef, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import OrderQueue from './OrderQueue';
import OrderDetail from './OrderDetail';
import StoreToggleModal from './StoreToggleModal';
import POSOfflineModal from './POSOfflineModal';
import { LogOut, Store, StoreIcon, Volume2, VolumeX, Bell, ChevronLeft, ChefHat, X, RefreshCw, Clock, AlertTriangle, User, ClipboardList, Utensils, ShoppingCart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { formatRupiah } from '../utils/format';

interface DashboardProps {
  onLogout: () => void;
  username: string;
}

export default function Dashboard({ onLogout, username }: DashboardProps) {
  const {
    orders,
    selectedOrderId,
    isAlarmPlaying,
    isStoreOpen,
    newOrderIds,
    stopAlarm,
    fetchOrders,
    fetchStoreSettings,
    subscribeToOrders,
    unsubscribeFromOrders,
    menuItems,
    fetchMenuItems,
    toggleMenuItemAvailability,
    toppings,
    fetchToppings,
    toggleToppingAvailability,
    connectionStatus,
    storeLogs,
    fetchStoreLogs,
    activeShift,
    fetchActiveShift,
    openShift,
    closeShift,
  } = useAdminStore();

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isPOSOfflineOpen, setIsPOSOfflineOpen] = useState(false);
  const [cashInput, setCashInput] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [startingCashInput, setStartingCashInput] = useState('200000'); // default modal awal wajar
  const [operatorNameInput, setOperatorNameInput] = useState(username);
  const [isOpeningShift, setIsOpeningShift] = useState(false);

  // Real-time clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Load and Subscribe to Database on mount
  useEffect(() => {
    fetchStoreSettings();
    fetchOrders();
    subscribeToOrders();
    fetchActiveShift();

    return () => {
      unsubscribeFromOrders();
    };
  }, [fetchOrders, fetchStoreSettings, subscribeToOrders, unsubscribeFromOrders, fetchActiveShift]);

  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const beepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  // Alarm using AudioContext beep (works without audio file)
  useEffect(() => {
    const playBeep = () => {
      if (isMuted) return;
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
      } catch (e) {
        // AudioContext not available
      }
    };

    if (isAlarmPlaying && !isMuted) {
      playBeep();
      beepIntervalRef.current = setInterval(playBeep, 2000);
    } else {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    }

    return () => {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    };
  }, [isAlarmPlaying, isMuted]);

  // When order selected on mobile, show detail
  const handleSelectMobileOrder = () => {
    if (selectedOrderId) {
      setShowMobileDetail(true);
    }
  };

  // Statistik laporan harian — filter hari ini saja
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
  const completedToday = todayOrders.filter(o => o.status === 'completed');
  const cancelledToday = todayOrders.filter(o => o.status === 'cancelled');
  const revenueToday = completedToday.reduce((sum, o) => sum + o.totalPrice, 0);
  const codExpected = completedToday.filter(o => o.paymentMethod === 'cod').reduce((sum, o) => sum + o.totalPrice, 0);
  const qrisExpected = completedToday.filter(o => o.paymentMethod === 'transfer').reduce((sum, o) => sum + o.totalPrice, 0);
  
  // Shift cash calculations
  const startingCash = activeShift ? activeShift.startingCash : 0;
  const expectedCashInDrawer = startingCash + codExpected;
  const parsedCashInput = cashInput ? Number(cashInput.replace(/\./g, '').replace(/,/g, '.')) : 0;
  const cashDiff = cashInput ? parsedCashInput - expectedCashInDrawer : 0;

  // Store open/close times from store_logs (today)
  const todayDateStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();
  const todayOpenLog = storeLogs.find(l => l.action === 'open' && l.selectedDate === todayDateStr);
  const todayCloseLog = storeLogs.find(l => l.action === 'closed' && l.selectedDate === todayDateStr);

  const formatLogTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Asia/Jakarta'
    }) + ' WIB';
  };

  // CSV Export function
  const exportToCSV = () => {
    const dateLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const rows = [
      ['REKAP PENJUALAN HARIAN - MARTABAK A6 NYUSS'],
      [''],
      ['Tanggal', dateLabel],
      ['Operator Shift', activeShift ? activeShift.operatorName : username],
      ['Jam Buka Toko', todayOpenLog ? formatLogTime(todayOpenLog.loggedAt) : '-'],
      ['Jam Tutup Toko', todayCloseLog ? formatLogTime(todayCloseLog.loggedAt) : '-'],
      ['Waktu Cetak', new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'],
      [''],
      ['RINGKASAN PESANAN'],
      ['Total Pesanan Hari Ini', todayOrders.length],
      ['Pesanan Selesai', completedToday.length],
      ['Pesanan Batal', cancelledToday.length],
      [''],
      ['REKAP KEUANGAN'],
      ['Total Omset Bersih', revenueToday],
      ['QRIS / Transfer (Digital)', qrisExpected],
      ['Modal Awal Laci', startingCash],
      ['Omset Tunai / COD', codExpected],
      ['Kas Diharapkan di Laci', expectedCashInDrawer],
      ['Kas Aktual (Uang Fisik)', cashInput ? Number(cashInput.replace(/\./g, '').replace(/,/g, '.')) : 0],
      ['Selisih Kas Laci', cashDiff],
      [''],
      ['DETAIL PESANAN SELESAI'],
      ['No', 'Kode Pesanan', 'Nama Pelanggan', 'Metode Bayar', 'Total'],
      ...completedToday.map((o, i) => [i + 1, o.orderCode, o.customerName, o.paymentMethod === 'cod' ? 'Tunai' : 'QRIS', o.totalPrice]),
    ];
    const csvContent = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rekap-a6nyuss-${todayDateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header
        className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-white shrink-0 shadow-lg z-10"
        style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #B72A0A 50%, #D94708 100%)' }}
      >
        {/* Left: Logo + Clock */}
        <div className="flex items-center gap-2">
          <div>
            <h1 className="font-black text-sm leading-none tracking-tight">A6 NYUSS</h1>
            <p className="text-white/70 text-[10px] leading-none font-medium">Portal Operasional</p>
          </div>
        </div>

        {/* Center: Alarm Banner */}
        {isAlarmPlaying && newOrderIds.length > 0 && (
          <div
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black animate-pulse"
            style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)' }}
          >
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            {newOrderIds.length} PESANAN BARU MASUK!
          </div>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/20 shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/60" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Stop Alarm - visible on all screen sizes */}
          {isAlarmPlaying && (
            <button
              onClick={stopAlarm}
              className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors animate-pulse shrink-0"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">Hentikan</span>
            </button>
          )}

          {/* POS Offline Button (Non-Mobile Mode: Only Cart Icon in Header) */}
          {activeShift && (
            <button
              onClick={() => setIsPOSOfflineOpen(true)}
              className="hidden sm:flex items-center justify-center p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shrink-0 border border-white/20 cursor-pointer"
              title="Buka Mode Kasir POS Offline"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
          )}
          <button
            onClick={() => {
              fetchMenuItems();
              fetchToppings();
              setIsMenuModalOpen(true);
            }}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black transition-all border bg-white/10 border-white/20 text-white hover:bg-white/20 shrink-0"
            title="Stok Menu"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1.5">Stok Menu</span>
          </button>

          {/* Rekap Harian Button */}
          <button
            onClick={() => {
              setCashInput('');
              fetchStoreLogs(todayDateStr);
              setIsReportOpen(true);
            }}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black transition-all border bg-white/10 border-white/20 text-white hover:bg-white/20 shrink-0"
            title="Rekap Harian"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1.5">Rekap Harian</span>
          </button>

          {/* Store Status */}
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className={`flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black transition-all border shrink-0 ${
              isStoreOpen
                ? 'bg-green-400/20 border-green-300/50 text-green-200 hover:bg-green-400/30'
                : 'bg-red-400/20 border-red-300/50 text-red-200 hover:bg-red-400/30'
            }`}
            title="Status Toko"
          >
            {isStoreOpen ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1.5">BUKA</span>
              </>
            ) : (
              <>
                <StoreIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1.5">TUTUP</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors border border-white/20 shrink-0"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1.5">Keluar</span>
          </button>
        </div>
      </header>

      {/* Network Connection Warning Banner */}
      {connectionStatus === 'disconnected' ? (
        <div className="bg-red-600 text-white text-center py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 shrink-0 z-20 shadow-md animate-pulse">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>KONEKSI INTERNET PUTUS! Pesanan baru tidak dapat masuk. Periksa WiFi / kabel LAN Anda sekarang.</span>
        </div>
      ) : connectionStatus === 'connecting' ? (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 shrink-0 z-20 shadow-md">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Sedang mencoba menghubungkan kembali ke server... Harap tunggu.</span>
        </div>
      ) : null}


      {/* Mobile Alarm Banner */}
      {isAlarmPlaying && newOrderIds.length > 0 && (
        <div
          className="md:hidden flex items-center justify-between px-4 py-2 text-white text-xs font-black animate-pulse z-10"
          style={{ background: 'linear-gradient(90deg, #8E0E0E, #D94708)' }}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>{newOrderIds.length} PESANAN BARU! KONFIRMASI SEKARANG</span>
          </div>
          <button onClick={stopAlarm} className="flex items-center gap-1 text-white/80 hover:text-white">
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Order Queue (40% on Desktop, sliding out on Mobile) */}
        <div
          className={`flex flex-col border-r border-gray-300 overflow-hidden bg-white shrink-0 transition-transform duration-300 w-full md:w-[40%] md:min-w-[280px] md:max-w-[400px] md:translate-x-0 ${
            showMobileDetail ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="flex-1 overflow-hidden">
            <OrderQueue onOrderSelect={handleSelectMobileOrder} />
          </div>
        </div>

        {/* Right Panel: Order Detail (60% on Desktop, sliding in on Mobile) */}
        <div
          className={`absolute md:relative inset-y-0 right-0 md:inset-auto md:flex-1 flex flex-col bg-gray-50 transition-transform duration-300 w-full md:w-auto md:translate-x-0 ${
            showMobileDetail ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile header (Back button) */}
          <div className="md:hidden px-4 py-2.5 border-b border-gray-200 bg-white shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowMobileDetail(false)}
              className="flex items-center gap-1 text-sm font-bold"
              style={{ color: '#C83707' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>
            <h2 className="font-black text-sm text-gray-800 flex-1 truncate">
              {selectedOrder ? `${selectedOrder.orderCode}` : 'Detail Pesanan'}
            </h2>
          </div>

          {/* Desktop header */}
          <div
            className="hidden md:block px-4 py-2.5 border-b border-gray-200 shrink-0 bg-white"
          >
            <h2 className="font-black text-sm text-gray-800">
              Detail Pesanan{selectedOrder ? ` — ${selectedOrder.orderCode}` : ''}
            </h2>
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedOrder ? (
              <OrderDetail order={selectedOrder} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ClipboardList className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-base font-semibold">Pilih pesanan dari antrean</p>
                <p className="text-sm">untuk melihat detail & mengambil tindakan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Status Bar — Desktop */}
      <div className="hidden md:flex items-center justify-between px-4 py-1.5 border-t border-gray-200 bg-white text-xs text-gray-500 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            Status Toko:{' '}
            <span className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <strong className={isStoreOpen ? 'text-green-600' : 'text-red-600'}>
                {isStoreOpen ? 'BUKA' : 'TUTUP'}
              </strong>
            </span>
          </span>
          {currentTime && (
            <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Jam Realtime: <strong className="font-mono font-bold text-gray-700">{currentTime}</strong></span>
            </span>
          )}
          <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>Operator Aktif: <strong className="text-gray-700">{activeShift ? activeShift.operatorName : username}</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Pesanan Hari Ini: <strong className="text-gray-700">{todayOrders.length}</strong></span>
          <span>Menunggu Verifikasi: <strong className="text-amber-600">{todayOrders.filter(o => o.paymentStatus === 'waiting_verification').length}</strong></span>
          <span>© 2026 Martabak Terbul A6 Nyuss</span>
          {activeShift && (
            <button
              onClick={() => setIsPOSOfflineOpen(true)}
              className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-sm shrink-0 border border-white/20 cursor-pointer ml-1"
              title="Buka Mode Kasir POS Offline (Direct Order)"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Quick Stats — Mobile Only */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-gray-200 bg-white text-xs shrink-0">
        <div className="flex flex-col items-center gap-0.5">
          <span className={`h-2.5 w-2.5 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mb-0.5`}></span>
          <span className={`font-bold text-[10px] ${isStoreOpen ? 'text-green-600' : 'text-red-600'}`}>
            {isStoreOpen ? 'BUKA' : 'TUTUP'}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        {currentTime && (
          <>
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-mono font-bold text-sm text-gray-800">{currentTime}</span>
              <span className="text-gray-400 font-medium text-[10px]">Jam</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
          </>
        )}
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-black text-base text-gray-800">{todayOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</span>
          <span className="text-gray-400 font-medium">Aktif</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center gap-0.5">
          <span className={`font-black text-base ${
            todayOrders.filter(o => o.paymentStatus === 'waiting_verification').length > 0
              ? 'text-amber-500'
              : 'text-gray-400'
          }`}>
            {todayOrders.filter(o => o.paymentStatus === 'waiting_verification').length}
          </span>
          <span className="text-gray-400 font-medium">Verif</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-black text-base text-gray-800">{todayOrders.length}</span>
          <span className="text-gray-400 font-medium">Total</span>
        </div>
        {activeShift && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <button
              onClick={() => setIsPOSOfflineOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Buka Mode Kasir POS Offline"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Menu Items Stock Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-gray-50">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-black text-gray-900 text-base">Manajemen Stok Menu</h3>
                  <p className="text-xs text-gray-500 font-medium">Atur ketersediaan menu gerai</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {menuItems.length === 0 && toppings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-3 text-orange-500" />
                  <p className="text-sm font-semibold">Memuat daftar menu...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group by Category */}
                  {Object.entries(
                    menuItems.reduce((acc, item) => {
                      const cat = item.categoryName || 'Lainnya';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {} as Record<string, typeof menuItems>)
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-2.5">
                      <h4 className="text-xs font-black text-orange-700 tracking-wider uppercase border-b pb-1">
                        {category}
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2.5 gap-4">
                            <div>
                              <p className="font-bold text-sm text-gray-800">{item.name}</p>
                              <p className={`text-xs font-semibold ${item.isAvailable ? 'text-green-650' : 'text-red-555'}`}>
                                {item.isAvailable ? 'Tersedia' : 'Habis'}
                              </p>
                            </div>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleMenuItemAvailability(item.id, !item.isAvailable)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                item.isAvailable ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Toppings Section */}
                  {toppings.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-dashed border-gray-200">
                      <h4 className="text-xs font-black text-orange-700 tracking-wider uppercase border-b pb-1">
                        Stok Topping Terang Bulan
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {toppings.map((topping) => (
                          <div key={topping.id} className="flex items-center justify-between py-2.5 gap-4">
                            <div>
                              <p className="font-bold text-sm text-gray-800">{topping.name}</p>
                              <p className={`text-xs font-semibold ${topping.isAvailable ? 'text-green-655' : 'text-red-555'}`}>
                                {topping.isAvailable ? 'Tersedia' : 'Habis'}
                              </p>
                            </div>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleToppingAvailability(topping.id, !topping.isAvailable)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                topping.isAvailable ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  topping.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end shrink-0">
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Harian Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-gray-50">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-black text-gray-900 text-base">Rekap Penjualan Harian</h3>
                  <p className="text-xs text-gray-500 font-medium">Laporan tutup toko &amp; hitung uang laci</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">

              {/* Store Open/Close Times */}
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Waktu Operasional Toko Hari Ini</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">🟢 Jam Buka</span>
                  <span className="font-black text-gray-800">
                    {todayOpenLog ? formatLogTime(todayOpenLog.loggedAt) : <span className="text-gray-400 italic">Belum dicatat</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">🔴 Jam Tutup</span>
                  <span className="font-black text-gray-800">
                    {todayCloseLog ? formatLogTime(todayCloseLog.loggedAt) : <span className="text-gray-400 italic">Belum dicatat</span>}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-xs text-green-700 font-bold">Total Omset Bersih</p>
                  <p className="text-lg font-black text-green-950 mt-1">{formatRupiah(revenueToday)}</p>
                  <p className="text-[10px] text-green-600 font-semibold">{completedToday.length} pesanan sukses</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-xs text-red-700 font-bold">Pesanan Batal</p>
                  <p className="text-lg font-black text-red-950 mt-1">{cancelledToday.length} order</p>
                  <p className="text-[10px] text-red-500 font-semibold">Gagal diproses</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2 text-xs font-bold text-gray-700">
                {activeShift && (
                  <div className="flex justify-between border-b pb-1.5 mb-1.5">
                    <span className="text-gray-500 font-semibold">Kasir / Operator</span>
                    <span className="text-gray-900 font-black">{activeShift.operatorName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">QRIS / Transfer (Digital)</span>
                  <span className="text-gray-900">{formatRupiah(qrisExpected)}</span>
                </div>
                {activeShift && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Modal Awal Laci</span>
                    <span className="text-gray-900">{formatRupiah(startingCash)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Omset Tunai / COD (Sistem)</span>
                  <span className="text-gray-900">{formatRupiah(codExpected)}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 text-sm font-black">
                  <span className="text-gray-900">Total Kas Diharapkan di Laci</span>
                  <span className="text-red-800">{formatRupiah(expectedCashInDrawer)}</span>
                </div>
              </div>

              {/* Cash Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                  Masukkan Jumlah Uang Fisik di Laci Kasir:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                  <input
                    type="text"
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    placeholder="Contoh: 500.000"
                    className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 text-gray-800 font-bold text-sm"
                  />
                </div>
                {cashInput && (
                  <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between ${
                    cashDiff === 0 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : cashDiff < 0 
                      ? 'bg-red-50 border border-red-200 text-red-700' 
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}>
                    <span>Selisih Uang Fisik vs Diharapkan:</span>
                    <span className="text-sm font-black">
                      {cashDiff === 0 ? '✓ Sesuai (Pukul Rata)' : cashDiff < 0 ? `Kurang: -${formatRupiah(Math.abs(cashDiff))}` : `Lebih: +${formatRupiah(cashDiff)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer — Single Action Button */}
            <div className="px-4 py-4 bg-gray-50 border-t shrink-0 space-y-2">
              {/* Single button: semua aksi sekaligus */}
              <button
                onClick={async () => {
                  if (!cashInput) {
                    toast.error('Harap masukkan jumlah uang fisik di laci terlebih dahulu!');
                    return;
                  }
                  
                  const actualCashAmt = Number(cashInput.replace(/\./g, '').replace(/,/g, '.'));
                  if (isNaN(actualCashAmt) || actualCashAmt < 0) {
                    toast.error('Uang fisik tidak valid!');
                    return;
                  }

                  // 1. Close shift in database
                  const success = await closeShift(actualCashAmt, expectedCashInDrawer);
                  if (!success) {
                    toast.error('Gagal memproses tutup shift kasir di server. Coba lagi.');
                    return;
                  }

                  // 2. Ekspor CSV (non-blocking)
                  exportToCSV();

                  // 3. Cetak thermal Z-Report
                  setTimeout(() => {
                    document.body.classList.add('printing-report');
                    window.print();
                    setTimeout(() => document.body.classList.remove('printing-report'), 500);
                  }, 300);

                  // 4. Laporkan ke Owner via WhatsApp
                  const dateLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  const waText = `*LAPORAN SHIFT MASUK (Z-REPORT) - A6 NYUSS*\nTanggal: ${dateLabel}\nOperator: ${activeShift?.operatorName || username}\n\n*RINCIAN KEUANGAN:*\n- Total Omset Bersih: ${formatRupiah(revenueToday)}\n- Transfer/QRIS: ${formatRupiah(qrisExpected)}\n- Modal Awal Laci: ${formatRupiah(startingCash)}\n- Omset Tunai/COD: ${formatRupiah(codExpected)}\n- Kas Diharapkan di Laci: ${formatRupiah(expectedCashInDrawer)}\n- Kas Aktual (Uang Fisik): ${formatRupiah(actualCashAmt)}\n- Selisih Kas Laci: ${formatRupiah(cashDiff)}\n\n*RINGKASAN PESANAN:*\n- Total Pesanan Hari Ini: ${todayOrders.length}\n- Pesanan Sukses: ${completedToday.length}\n- Pesanan Batal: ${cancelledToday.length}\n\n-- Laporan Tutup Shift Sukses --`;
                  const cleanPhone = '6287811123482'; // Nomor WhatsApp Owner
                  const linkUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
                  window.open(linkUrl, '_blank');

                  setIsReportOpen(false);
                  toast.success('Shift kasir berhasil ditutup, Z-Report dicetak, dan laporan WhatsApp dikirim!');
                }}
                className="w-full py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #B72A0A 50%, #D94708 100%)' }}
              >
                Cetak Laporan Harian
              </button>
              <button
                onClick={() => setIsReportOpen(false)}
                className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable section for thermal printer */}
      <div className="print-report-container hidden">
        <div className="header text-center">
          <h2>REKAP PENJUALAN HARIAN</h2>
          <h3>MARTABAK A6 NYUSS</h3>
          <p>Tanggal: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          <div className="divider">===============================</div>
        </div>
        <div className="meta">
          <p>Operator Shift: {activeShift ? activeShift.operatorName : username}</p>
          <p>Waktu Cetak: {new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</p>
          <div className="divider">-------------------------------</div>
        </div>
        <div className="stats" style={{ fontSize: '10pt' }}>
          <p>Jam Buka Toko: <span className="float-right">{todayOpenLog ? formatLogTime(todayOpenLog.loggedAt) : '-'}</span></p>
          <p>Jam Tutup Toko: <span className="float-right">{todayCloseLog ? formatLogTime(todayCloseLog.loggedAt) : '-'}</span></p>
          <div className="divider">-------------------------------</div>
          <p>Pesanan Selesai: <span className="float-right">{completedToday.length} order</span></p>
          <p>Pesanan Batal: <span className="float-right">{cancelledToday.length} order</span></p>
          <div className="divider">-------------------------------</div>
          <p style={{ fontWeight: 'bold' }}>TOTAL OMSET: <span className="float-right">{formatRupiah(revenueToday)}</span></p>
          <p>QRIS / Digital: <span className="float-right">{formatRupiah(qrisExpected)}</span></p>
          <p>Modal Awal Laci: <span className="float-right">{formatRupiah(startingCash)}</span></p>
          <p>Omset Tunai/COD: <span className="float-right">{formatRupiah(codExpected)}</span></p>
          <p style={{ fontWeight: 'bold' }}>KAS DIHARAPKAN: <span className="float-right">{formatRupiah(expectedCashInDrawer)}</span></p>
          <div className="divider">-------------------------------</div>
          <p>Uang Laci Aktual: <span className="float-right">{cashInput ? formatRupiah(Number(cashInput.replace(/\./g, '').replace(/,/g, '.'))) : 'Tidak diisi'}</span></p>
          <p style={{ fontWeight: 'bold' }}>Selisih Uang (Drift): <span className="float-right">{formatRupiah(cashDiff)}</span></p>
        </div>
        <div className="divider">===============================</div>
        <div className="footer text-center" style={{ textAlign: 'center', marginTop: '4mm' }}>
          <p className="thanks">-- Laporan Tutup Shift Sukses --</p>
        </div>
      </div>
    </div>
    <Toaster position="top-center" toastOptions={{ duration: 2500 }} />

    {/* Store Toggle Modal */}
    {isStoreModalOpen && (
      <StoreToggleModal
        onClose={() => setIsStoreModalOpen(false)}
        username={username}
      />
    )}

    {/* Buka Shift Modal (Locks Screen if no active shift exists) */}
    {!activeShift && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="font-black text-gray-900 text-xl uppercase tracking-tight">Mulai Shift Baru</h3>
            <p className="text-xs text-gray-500 font-medium">Buka shift kasir hari ini untuk mulai melayani transaksi</p>
          </div>

          <div className="space-y-4">
            {/* Operator Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Nama Operator / Kasir</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={operatorNameInput}
                  onChange={(e) => setOperatorNameInput(e.target.value)}
                  placeholder="Nama Operator"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-800 font-bold text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Starting Cash */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Uang Modal Awal Laci (Petty Cash)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                <input
                  type="text"
                  value={startingCashInput}
                  onChange={(e) => setStartingCashInput(e.target.value)}
                  placeholder="Contoh: 200.000"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-800 font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!operatorNameInput.trim()) {
                toast.error('Nama operator tidak boleh kosong!');
                return;
              }
              const amt = Number(startingCashInput.replace(/\./g, '').replace(/,/g, '.'));
              if (isNaN(amt) || amt < 0) {
                toast.error('Uang modal awal harus valid!');
                return;
              }
              setIsOpeningShift(true);
              const success = await openShift(amt, operatorNameInput.trim());
              setIsOpeningShift(false);
              if (success) {
                toast.success(`Shift berhasil dibuka oleh ${operatorNameInput}!`);
              } else {
                toast.error('Gagal membuka shift. Silakan coba lagi.');
              }
            }}
            disabled={isOpeningShift}
            className="w-full py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #B72A0A 50%, #D94708 100%)' }}
          >
            {isOpeningShift ? 'Membuka Shift...' : 'Buka Shift Kasir'}
          </button>
          
          <button
            onClick={onLogout}
            disabled={isOpeningShift}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer mt-2"
          >
            Logout / Keluar Halaman Login
          </button>
        </div>
      </div>
    )}

    {/* Mode Kasir Offline Modal */}
    {isPOSOfflineOpen && (
      <POSOfflineModal
        onClose={() => setIsPOSOfflineOpen(false)}
        username={username}
      />
    )}
    </>
  );
}
