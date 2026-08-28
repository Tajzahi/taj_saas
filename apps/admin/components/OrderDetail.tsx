import { useState, useEffect } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import { formatRupiah, formatDate } from '../utils/format';
import PrintReceipt from './PrintReceipt';
import toast from 'react-hot-toast';
import {
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Printer,
  ChefHat,
  ExternalLink,
  X,
  Navigation,
  CreditCard,
  Banknote,
  Clock,
  CheckCheck,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

interface OrderDetailProps {
  order: AdminOrder;
}

const statusFlow: AdminOrder['status'][] = [
  'received',
  'processing',
  'ready',
  'completed',
];

const statusLabels: Record<AdminOrder['status'], string> = {
  received: 'Diterima',
  processing: 'Diproses',
  ready: 'Siap Antar/Ambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const stepLabels: Record<AdminOrder['status'], string> = {
  received: 'Baru',
  processing: 'Masak',
  ready: 'Siap',
  completed: 'Selesai',
  cancelled: 'Batal',
};

function StatusStepIndicator({ currentStatus }: { currentStatus: AdminOrder['status'] }) {
  const currentIdx = statusFlow.indexOf(currentStatus);
  if (currentStatus === 'cancelled') return null;
  return (
    <div className="flex items-center justify-between gap-1 w-full border border-gray-150 rounded-2xl p-2.5 bg-gray-50/50">
      {statusFlow.map((s, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={s} className="flex items-center gap-1 flex-1 justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div
                className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-orange-500 text-white animate-pulse ring-2 ring-orange-500/20'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {done ? '✓' : idx + 1}
              </div>
              <p className={`text-center text-[9px] sm:text-[11px] font-black tracking-tight ${active ? 'text-orange-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {stepLabels[s]}
              </p>
            </div>
            {idx < statusFlow.length - 1 && (
              <span className="hidden sm:inline text-gray-300 font-medium text-xs">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const { updateOrderStatus, verifyPaymentStatus, storeName } = useAdminStore();
  const [showProofPopup, setShowProofPopup] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; desc: string; onConfirm: () => void } | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Bahan baku habis');
  const [customReason, setCustomReason] = useState('');

  // Local state for KDS checklist items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCheckedItems({});
  }, [order.id]);

  const toggleCheckedItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleAction = async (type: string, fn: () => Promise<boolean> | void) => {
    setActionLoading(type);
    await new Promise((r) => setTimeout(r, 600));
    const result = await fn();
    setActionLoading(null);
    setConfirmAction(null);
    return result;
  };

  const nextStatus = (): AdminOrder['status'] | null => {
    const idx = statusFlow.indexOf(order.status);
    if (idx < 0 || idx >= statusFlow.length - 1) return null;
    return statusFlow[idx + 1];
  };

  const next = nextStatus();

  const handlePrint = () => {
    document.body.classList.add('printing-receipt');
    window.print();
    setTimeout(() => document.body.classList.remove('printing-receipt'), 500);
  };

  const paymentStatusBadge = () => {
    switch (order.paymentStatus) {
      case 'pending':
        const labelPending = order.paymentMethod === 'transfer' ? 'QRIS' : (order.deliveryType === 'pickup' || order.deliveryType === 'dine_in' ? 'Tunai' : 'COD');
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600"><Clock className="w-3 h-3" />Menunggu Bayar ({labelPending})</span>;
      case 'waiting_verification':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 animate-pulse"><AlertTriangle className="w-3 h-3" />Menunggu Verifikasi</span>;
      case 'paid':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" />Lunas</span>;
      case 'failed':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Verifikasi Gagal</span>;
      case 'refunded':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Direfund</span>;
      default:
        return null;
    }
  };

  const mainActionBtn = () => {
    if (!next) return null;
    const labels: Record<string, { label: string; color: string }> = {
      processing: { label: 'PROSES MASAK', color: '#C83707' },
      ready: { label: 'TANDAI SIAP', color: '#16a34a' },
      completed: { label: 'SELESAIKAN PESANAN', color: '#6d28d9' },
    };
    const btnInfo = labels[next];
    if (!btnInfo) return null;

    const isCODCompleted = next === 'completed' && order.paymentMethod === 'cod' && order.paymentStatus !== 'paid';
    const isPickup = order.deliveryType === 'pickup';
    const cashLabel = isPickup ? 'Tunai' : 'Tunai COD';
    const customDesc = isCODCompleted
      ? `PENTING: Pembayaran Tunai! Pastikan Anda telah menerima uang tunai sebesar ${formatRupiah(order.totalPrice)} (${cashLabel}) dari pelanggan sebelum menyelesaikan pesanan ini.`
      : `Ubah status pesanan ${order.orderCode} menjadi "${statusLabels[next]}"?`;

    return (
      <div className="w-full flex flex-col gap-1.5 sm:flex-1">
        <button
          onClick={() => setConfirmAction({
            type: next,
            label: btnInfo.label,
            desc: customDesc,
            onConfirm: async () => {
              const ok = await handleAction(next, () => updateOrderStatus(order.id, next));
              if (ok !== false) {
                const msgs: Record<string, string> = {
                  processing: 'Pesanan mulai diproses di dapur!',
                  ready: 'Pesanan ditandai siap antar/ambil!',
                  completed: 'Pesanan selesai!',
                };
                toast.success(msgs[next] || 'Status berhasil diperbarui');
              } else {
                toast.error('Gagal memperbarui status. Coba lagi.');
              }
            },
          })}
          disabled={!!actionLoading || isCODCompleted}
          className="w-full py-3 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(135deg, ${btnInfo.color}, ${btnInfo.color}dd)` }}
        >
          {actionLoading === next ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            btnInfo.label
          )}
        </button>
        {isCODCompleted && (
          <p className="text-[10px] text-red-500 font-bold text-center">
            *Harap tandai lunas pembayaran tunai di panel pembayaran terlebih dahulu.
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Print Receipt (hidden, only shown on print) */}
      <PrintReceipt order={order} />

      {/* Proof Popup */}
      {showProofPopup && order.paymentProofUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowProofPopup(false)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Bukti Pembayaran QRIS</h3>
                <p className="text-xs text-gray-500">{order.orderCode}</p>
              </div>
              <button
                onClick={() => setShowProofPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-gray-50/50">
              <img
                src={order.paymentProofUrl}
                alt="Bukti Pembayaran QRIS"
                className="max-w-full max-h-[60vh] rounded-xl object-contain shadow-sm border border-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Gambar+Gagal+Dimuat';
                }}
              />
            </div>
            <div className="p-4 flex gap-2 border-t bg-white shrink-0">
              <button
                onClick={() => {
                  setShowProofPopup(false);
                  setConfirmAction({
                    type: 'reject',
                    label: 'Tolak QRIS',
                    desc: `Tolak bukti pembayaran QRIS dari ${order.customerName}? Status akan menjadi "Verifikasi Gagal".`,
                    onConfirm: async () => {
                      const ok = await handleAction('reject', () => verifyPaymentStatus(order.id, false));
                      if (ok !== false) toast.success('Pembayaran QRIS ditolak. Status pembayaran: Verifikasi Gagal.');
                      else toast.error('Gagal memperbarui status. Coba lagi.');
                    },
                  });
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Tolak
              </button>
              <button
                onClick={() => {
                  setShowProofPopup(false);
                  setConfirmAction({
                    type: 'verify',
                    label: 'Verifikasi Lunas',
                    desc: `Konfirmasi pembayaran dari ${order.customerName} sudah diterima?`,
                    onConfirm: async () => {
                      const ok = await handleAction('verify', () => verifyPaymentStatus(order.id, true));
                      if (ok !== false) toast.success('Pembayaran terverifikasi lunas!');
                      else toast.error('Gagal verifikasi. Coba lagi.');
                    },
                  });
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                Verifikasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full">
            <h3 className="font-black text-gray-900 text-base mb-2">{confirmAction.label}</h3>
            <p className="text-gray-600 text-sm mb-6">{confirmAction.desc}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={confirmAction.onConfirm}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #9C1B0B, #D13E08)' }}
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Konfirmasi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Detail Panel */}
      <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {order.orderCode}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    order.deliveryType === 'dine_in'
                      ? 'bg-emerald-100 text-emerald-700'
                      : order.deliveryType === 'takeaway'
                      ? 'bg-amber-100 text-amber-700'
                      : order.deliveryType === 'delivery'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {order.deliveryType === 'dine_in' ? (
                    <><ShoppingBag className="w-3 h-3" /> Dine-in</>
                  ) : order.deliveryType === 'takeaway' ? (
                    <><ShoppingBag className="w-3 h-3" /> Takeaway</>
                  ) : order.deliveryType === 'delivery' ? (
                    <><Truck className="w-3 h-3" /> Delivery App</>
                  ) : (
                    <><ShoppingBag className="w-3 h-3" /> Pickup / Kasir Direct</>
                  )}
                </span>
              </div>
              <h2 className="font-black text-xl text-gray-900">{order.customerName}</h2>
              {(() => {
                const cleanPhone = order.customerPhone.replace(/\D/g, '');
                const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                
                const activeStoreName = storeName || 'Toko';
                let waMessageText = `Halo Kak ${order.customerName}, kami dari ${activeStoreName}. Ada yang bisa kami bantu mengenai pesanan Kakak (${order.orderCode})?`;
                if (order.status === 'received') {
                  waMessageText = `Halo Kak ${order.customerName}, kami dari ${activeStoreName}. Pesanan Kakak dengan kode ${order.orderCode} telah kami terima dan sedang diproses. Terima kasih!`;
                } else if (order.status === 'processing') {
                  waMessageText = `Halo Kak ${order.customerName}, kami dari ${activeStoreName}. Pesanan Kakak (${order.orderCode}) saat ini sedang dimasak di dapur. Kami akan kabari begitu siap!`;
                } else if (order.status === 'ready') {
                  waMessageText = `Halo Kak ${order.customerName}, kami dari ${activeStoreName}. Pesanan Kakak (${order.orderCode}) sudah siap dan siap ${order.deliveryType === 'delivery' ? 'diantar oleh kurir' : 'diambil di gerai'}. Terima kasih!`;
                }
                const waText = encodeURIComponent(waMessageText);

                return (
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 shrink-0">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-[11px] font-bold transition-colors"
                    >
                      <Phone className="w-3 h-3 text-gray-500" />
                      {order.customerPhone}
                    </a>
                    <a
                      href={`https://wa.me/${waPhone}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-bold transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                );
              })()}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
              <p className="text-2xl font-black mt-1" style={{ color: '#8E0E0E' }}>
                {formatRupiah(order.totalPrice)}
              </p>
            </div>
          </div>

          {/* Status Stepper */}
          {order.status !== 'cancelled' && (
            <div className="mt-2">
              <StatusStepIndicator currentStatus={order.status} />
            </div>
          )}
          {order.status === 'cancelled' && (
            <div className="mt-2.5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 text-xs font-bold">Pesanan Dibatalkan</p>
                <p className="text-red-800 text-sm italic mt-0.5">
                  Alasan: "{order.cancellationReason || 'Tidak ditentukan'}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Items Section (Enlarged KDS-style list with checklist checkboxes) */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
          <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(90deg, #8E0E0E0A, transparent)' }}>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
              <ChefHat className="text-[#C83707] w-5 h-5" />
              Rincian Pesanan ({order.items.reduce((s, i) => s + i.quantity, 0)} item)
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item, idx) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div key={item.id} className={`px-4 py-3 transition-colors ${isChecked ? 'bg-gray-50/70' : 'bg-white'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheckedItem(item.id)}
                        className="w-6 h-6 rounded border-2 border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer mr-2 shrink-0"
                      />
                      <span
                        className="flex items-center justify-center rounded-full font-black text-white shrink-0 w-8 h-8 text-sm"
                        style={{ background: isChecked ? '#9ca3af' : '#C83707' }}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-800 ${
                          isChecked ? 'line-through text-gray-400 text-base font-bold' : 'text-lg font-black text-gray-900'
                        }`}>
                          {item.name}
                          <span className="ml-2 font-black text-base px-2 py-0.5 bg-orange-100 text-orange-950 rounded-md">
                            x{item.quantity}
                          </span>
                        </p>
                        {item.variant && (
                          <p className="text-gray-500 mt-0.5 text-sm font-bold">
                            Variant: {item.variant}
                            {item.topping ? ` · Topping: ${item.topping}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-sm text-gray-800 shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {order.notes && (
            <div className="px-4 py-3 bg-amber-100/50 border-t border-amber-100 p-5">
              <p className="font-bold text-amber-700 mb-1 text-sm">Catatan Khusus:</p>
              <p className="italic text-lg font-black text-amber-950 leading-relaxed">"{order.notes}"</p>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                {order.paymentMethod === 'transfer' ? (
                  <CreditCard className="w-4 h-4 text-blue-600" />
                ) : (
                  <Banknote className="w-4 h-4 text-green-600" />
                )}
                Pembayaran
              </h3>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Metode</span>
                <span className="font-bold text-sm text-gray-900">
                  {order.deliveryType === 'pickup'
                    ? (order.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                    : (order.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Status</span>
                {paymentStatusBadge()}
              </div>
              {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
                <button
                  onClick={async () => {
                    const isPickup = order.deliveryType === 'pickup';
                    const label = isPickup ? 'Tunai' : 'Tunai COD';
                    const ok = await verifyPaymentStatus(order.id, true);
                    if (ok) {
                      toast.success(`Pembayaran ${label} berhasil ditandai LUNAS!`);
                    } else {
                      toast.error('Gagal memverifikasi pembayaran.');
                    }
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                >
                  Tandai Lunas (Uang Diterima)
                </button>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-dashed border-gray-200 pt-2.5 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatRupiah(order.subtotal)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Ongkir {order.deliveryDistance ? `(${order.deliveryDistance} Km)` : ''}
                    </span>
                    <span className="font-medium">{formatRupiah(order.deliveryFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Diskon{order.couponCode ? ` (${order.couponCode})` : ''}
                    </span>
                    <span className="font-medium text-green-600">-{formatRupiah(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-gray-100">
                  <span className="font-black text-gray-900">TOTAL</span>
                  <span className="font-black text-lg" style={{ color: '#8E0E0E' }}>
                    {formatRupiah(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Proof Button */}
              {order.paymentMethod === 'transfer' && order.paymentProofUrl && (
                <button
                  onClick={() => setShowProofPopup(true)}
                  className="w-full mt-1 py-2.5 rounded-xl text-sm font-bold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lihat Gambar Bukti QRIS
                </button>
              )}
              {order.paymentMethod === 'transfer' && !order.paymentProofUrl && (
                <div className="mt-1.5 p-3 bg-amber-50 border border-dashed border-amber-200 rounded-xl text-center">
                  <p className="text-xs text-amber-700 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    Bukti pembayaran QRIS belum diunggah oleh pelanggan
                  </p>
                </div>
              )}
            </div>
          </div>

        {/* Delivery Section */}
        {order.deliveryType === 'delivery' && order.deliveryAddress && (
          <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                Info Pengiriman
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800 font-medium flex-1">{order.deliveryAddress}</p>
              </div>
              <div className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    {order.deliveryDistance} Km · {formatRupiah(order.deliveryFee)}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Lihat Peta
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mx-4 mt-3 mb-4 space-y-2 shrink-0">
          {/* Verification buttons (only for transfer waiting) */}
          {order.paymentMethod === 'transfer' && order.paymentStatus === 'waiting_verification' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setConfirmAction({
                  type: 'reject',
                  label: 'Tolak QRIS',
                  desc: `Tolak bukti pembayaran QRIS dari ${order.customerName}? Status bayar akan menjadi "Verifikasi Gagal".`,
                  onConfirm: async () => {
                    const ok = await handleAction('reject', () => verifyPaymentStatus(order.id, false));
                    if (ok !== false) toast.success('Pembayaran QRIS ditolak.');
                    else toast.error('Gagal. Coba lagi.');
                  },
                })}
                disabled={!!actionLoading}
                className="w-full sm:flex-1 py-3 rounded-xl text-sm font-bold border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {actionLoading === 'reject' ? (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                ) : (
                  <><XCircle className="w-4 h-4" /> Tolak QRIS</>
                )}
              </button>
              <button
                onClick={() => setConfirmAction({
                  type: 'verify',
                  label: 'Verifikasi Lunas',
                  desc: `Konfirmasi pembayaran dari ${order.customerName} sudah diterima dan valid?`,
                  onConfirm: async () => {
                    const ok = await handleAction('verify', () => verifyPaymentStatus(order.id, true));
                    if (ok !== false) toast.success('Pembayaran terverifikasi lunas!');
                    else toast.error('Gagal verifikasi. Coba lagi.');
                  },
                })}
                disabled={!!actionLoading}
                className="w-full sm:flex-1 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {actionLoading === 'verify' ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Verifikasi Lunas</>
                )}
              </button>
            </div>
          )}

          {/* Failed payment retry */}
          {order.paymentStatus === 'failed' && (
            <button
              onClick={() => setConfirmAction({
                type: 'verify',
                label: 'Verifikasi Lunas',
                desc: `Override status: konfirmasi pembayaran dari ${order.customerName} sudah diterima?`,
                onConfirm: async () => {
                  const ok = await handleAction('verify', () => verifyPaymentStatus(order.id, true));
                  if (ok !== false) toast.success('Pembayaran terverifikasi lunas!');
                  else toast.error('Gagal verifikasi. Coba lagi.');
                },
              })}
              disabled={!!actionLoading}
              className="w-full py-3 rounded-xl text-sm font-bold border-2 border-green-300 text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <CheckCheck className="w-4 h-4" /> Override: Tandai Lunas
            </button>
          )}

          {/* Print + Main Action row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak Struk
            </button>
            {mainActionBtn()}
          </div>

          {/* Cancel button */}
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <button
              onClick={() => {
                setCancellationReason('Bahan baku habis');
                setCustomReason('');
                setShowCancelPopup(true);
              }}
              disabled={!!actionLoading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-60"
            >
              Batalkan Pesanan
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Reason Dialog */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <h3 className="font-black text-base">Batalkan Pesanan</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium mb-4">
              Konfirmasi pembatalan pesanan <strong>{order.orderCode}</strong>. Harap tentukan alasannya:
            </p>

            {/* Reason list */}
            <div className="space-y-2 mb-5">
              {[
                'Bahan baku habis',
                'Telur bebek habis',
                'Alamat pengiriman di luar radius',
                'Permintaan pelanggan',
                'Toko tutup mendadak',
                'Lainnya',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={cancellationReason === reason}
                    onChange={() => setCancellationReason(reason)}
                    className="accent-red-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-gray-800 text-xs font-semibold">{reason}</span>
                </label>
              ))}

              {cancellationReason === 'Lainnya' && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Ketik alasan pembatalan..."
                  className="w-full mt-1.5 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-800 font-semibold"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelPopup(false)}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const finalReason = cancellationReason === 'Lainnya' ? customReason.trim() : cancellationReason;
                  if (!finalReason) return;
                  setActionLoading('cancel');
                  const ok = await updateOrderStatus(order.id, 'cancelled', finalReason);
                  setActionLoading(null);
                  setShowCancelPopup(false);
                  if (ok) toast.success(`Pesanan ${order.orderCode} telah dibatalkan.`);
                  else toast.error('Gagal membatalkan pesanan. Coba lagi.');
                }}
                disabled={!!actionLoading || (cancellationReason === 'Lainnya' && !customReason.trim())}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all disabled:opacity-60 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
              >
                {actionLoading === 'cancel' ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Batalkan Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
