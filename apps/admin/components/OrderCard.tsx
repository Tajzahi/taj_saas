import { useState, useEffect } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import { formatRupiah, timeAgo } from '../utils/format';
import { MapPin, ShoppingBag, Bell, AlertTriangle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderCardProps {
  order: AdminOrder;
  isSelected: boolean;
  isNew: boolean;
  isKDSMode?: boolean;
  onClick: () => void;
}

const statusConfig: Record<
  AdminOrder['status'],
  { label: string; className: string }
> = {
  received: { label: 'Baru', className: 'bg-blue-100 text-blue-700 border border-blue-300' },
  processing: { label: 'Diproses', className: 'bg-orange-100 text-orange-700 border border-orange-300' },
  ready: { label: 'Siap', className: 'bg-green-100 text-green-700 border border-green-300' },
  completed: { label: 'Selesai', className: 'bg-gray-100 text-gray-600 border border-gray-300' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700 border border-red-300' },
};

const paymentStatusConfig: Record<
  AdminOrder['paymentStatus'],
  { label: string; className: string }
> = {
  pending: { label: 'COD', className: 'text-gray-500' },
  waiting_verification: { label: 'Perlu Verif', className: 'text-amber-600 font-semibold' },
  paid: { label: 'Lunas', className: 'text-green-600 font-semibold' },
  failed: { label: 'Verif Gagal', className: 'text-red-600 font-semibold' },
  refunded: { label: 'Direfund', className: 'text-purple-600 font-semibold' },
};

const nextStatusMap: Record<AdminOrder['status'], AdminOrder['status'] | null> = {
  received: 'processing',
  processing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
};

const actionLabels: Record<string, string> = {
  processing: 'Terima & Masak',
  ready: 'Selesai Masak',
  completed: 'Serahkan Makanan',
};

export default function OrderCard({ order, isSelected, isNew, isKDSMode: _isKDSMode = false, onClick }: OrderCardProps) {
  const isKDSMode = false; // Force POS style for all order cards
  const { updateOrderStatus, verifyPaymentStatus } = useAdminStore();
  const statusInfo = statusConfig[order.status];
  const paymentInfo = paymentStatusConfig[order.paymentStatus];
  const next = nextStatusMap[order.status];

  // Calculate order age dynamically in real-time
  const [elapsedMins, setElapsedMins] = useState(0);

  useEffect(() => {
    if (order.status === 'completed' || order.status === 'cancelled') return;

    const updateElapsed = () => {
      const ms = Date.now() - new Date(order.createdAt).getTime();
      setElapsedMins(Math.floor(ms / 60000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 5000); // update every 5 seconds
    return () => clearInterval(interval);
  }, [order.createdAt, order.status]);
  
  let slaWarning = '';
  let borderOverride = '';
  
  if (order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'ready') {
    if (order.status === 'received' && elapsedMins > 5) {
      slaWarning = `Konfirmasi Terlambat! (${elapsedMins} mnt)`;
      borderOverride = 'border-yellow-400 bg-yellow-50 shadow-sm';
    } else if (order.status === 'processing') {
      if (elapsedMins >= 15 && elapsedMins <= 20) {
        slaWarning = `Waktu Masak Kritis! (${elapsedMins} mnt)`;
        borderOverride = 'border-yellow-500 bg-yellow-50/70 shadow-sm';
      } else if (elapsedMins > 20) {
        slaWarning = `Penyajian Terlambat! (${elapsedMins} mnt)`;
        borderOverride = 'border-red-400 bg-red-50/50 shadow-md animate-pulse';
      }
    }
  }

  let actionLabel = next ? actionLabels[next] : null;

  // For COD orders, if status is ready (next is completed) and not paid yet, show "Tandai Lunas" button
  const isNeedCODPayment = next === 'completed' && order.paymentMethod === 'cod' && order.paymentStatus !== 'paid';
  if (isNeedCODPayment) {
    actionLabel = 'Tandai Lunas';
  }

  // Hapus tombol aksi cepat jika metode transfer dan belum lunas (memaksa admin cek bukti bayar manual)
  if (
    order.status === 'received' && 
    order.paymentMethod === 'transfer' && 
    order.paymentStatus !== 'paid'
  ) {
    actionLabel = null;
  }

  const handleDirectAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!next) return;

    if (isNeedCODPayment) {
      const isPickup = order.deliveryType === 'pickup';
      const label = isPickup ? 'Tunai' : 'Tunai COD';
      const ok = await verifyPaymentStatus(order.id, true);
      if (ok) {
        toast.success(`Pembayaran ${label} berhasil ditandai LUNAS!`);
      } else {
        toast.error('Gagal memverifikasi pembayaran.');
      }
      return;
    }
    
    const ok = await updateOrderStatus(order.id, next);
    if (ok) {
      const msgs: Record<string, string> = {
        processing: 'Pesanan diproses di wajan!',
        ready: 'Pesanan siap disajikan!',
        completed: 'Pesanan selesai diserahkan!',
      };
      toast.success(msgs[next] || 'Status diperbarui');
    } else {
      toast.error('Gagal memperbarui status');
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl cursor-pointer transition-all border-2 ${
        isKDSMode ? 'p-5' : 'p-3.5'
      } ${
        isSelected
          ? 'border-orange-500 bg-orange-50 shadow-md'
          : isNew
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : borderOverride || 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30'
      }`}
    >
      {isNew && (
        <div className="absolute -top-1.5 -right-1.5 z-10">
          <Bell className="w-4.5 h-4.5 text-blue-500 animate-bounce" />
        </div>
      )}

      {/* SLA Alert banner inside card */}
      {slaWarning && (
        <div className={`mb-2.5 px-2 py-1 rounded font-black uppercase tracking-wider flex items-center gap-1.5 ${
          isKDSMode ? 'text-xs' : 'text-[10px]'
        } ${
          order.status === 'received' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800 animate-pulse'
        }`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          {slaWarning}
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className={`font-mono font-bold text-gray-500 leading-none ${isKDSMode ? 'text-xs' : 'text-[10px]'}`}>{order.orderCode}</p>
          <p className={`font-black text-gray-900 mt-1 truncate ${isKDSMode ? 'text-lg' : 'text-sm'}`}>{order.customerName}</p>
        </div>
        <div className="text-right shrink-0">
          {!isKDSMode && (
            <p className="font-black text-sm text-orange-700">
              {formatRupiah(order.totalPrice)}
            </p>
          )}
          <p className="text-gray-400 text-[10px] font-medium mt-0.5">{timeAgo(order.createdAt)}</p>
        </div>
      </div>

      {/* Middle row: items list */}
      <div className={`pt-2.5 border-t border-dashed border-gray-150 ${isKDSMode ? 'space-y-2' : 'space-y-1'}`}>
        {order.items.map((item) => (
          <div key={item.id} className={`flex items-center justify-between ${isKDSMode ? 'text-sm py-1 border-b border-gray-50 last:border-0' : 'text-xs'}`}>
            <span className={`text-gray-800 ${isKDSMode ? 'font-bold text-base' : 'font-semibold'}`}>
              {item.name} {item.variant ? `(${item.variant})` : ''}
            </span>
            <span className={`${
              isKDSMode 
                ? 'text-sm font-black px-2 py-0.5 bg-orange-100 text-orange-950 rounded-md' 
                : 'text-orange-800 font-extrabold px-1.5 py-0.2 bg-orange-50 rounded text-[10px]'
            }`}>
              x{item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Special notes */}
      {order.notes && (
        <div className={`mt-3 bg-yellow-100/70 border border-yellow-200 text-yellow-800 rounded-lg font-bold animate-pulse flex items-start gap-1.5 ${
          isKDSMode ? 'text-xs p-2.5' : 'text-[10px] p-1.5'
        }`}>
          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-yellow-600 mt-0.5" />
          <span className="leading-tight">Catatan: "{order.notes}"</span>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-3.5">
        <div className="flex items-center gap-1.5 shrink-0">
          {order.deliveryType === 'delivery' ? (
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />
          )}
          <span className={`text-[11px] font-bold ${isKDSMode ? 'text-gray-700' : paymentInfo.className}`}>
            {isKDSMode
              ? (order.deliveryType === 'pickup' ? 'Ambil Sendiri' : 'Pesan Antar')
              : (order.deliveryType === 'pickup'
                  ? (order.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                  : (order.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS'))}
          </span>
          {!isKDSMode && order.paymentMethod === 'transfer' && (
            <span className={`text-[11px] ${paymentInfo.className}`}>· {paymentInfo.label}</span>
          )}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black tracking-wide uppercase ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Direct Action Button */}
      {actionLabel && (
        <div className="mt-3.5">
          {isNeedCODPayment ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const isPickup = order.deliveryType === 'pickup';
                  const label = isPickup ? 'Tunai' : 'Tunai COD';
                  const ok = await verifyPaymentStatus(order.id, true);
                  if (ok) {
                    toast.success(`Pembayaran ${label} berhasil ditandai LUNAS!`);
                  } else {
                    toast.error('Gagal memverifikasi pembayaran.');
                  }
                }}
                className={`py-2 rounded-lg text-white text-xs font-black tracking-wider uppercase shadow hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer`}
                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)' }}
              >
                Tandai Lunas
              </button>
              <button
                disabled
                className="py-2 rounded-lg text-white text-xs font-black tracking-wider uppercase shadow opacity-50 cursor-not-allowed flex items-center justify-center gap-1"
                style={{ background: 'linear-gradient(135deg, #6d28d9, #5b21b6)' }}
              >
                Serahkan Makanan
              </button>
            </div>
          ) : (
            <button
              onClick={handleDirectAction}
              className="w-full py-2.5 rounded-lg text-white text-xs font-black tracking-wider uppercase shadow hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                background: order.status === 'received' 
                  ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
                  : order.status === 'processing' 
                  ? 'linear-gradient(135deg, #ea580c, #c2410c)' 
                  : 'linear-gradient(135deg, #16a34a, #15803d)'
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
