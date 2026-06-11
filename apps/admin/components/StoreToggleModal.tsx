import { useEffect, useState, useCallback } from 'react';
import { X, Store, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

interface StoreToggleModalProps {
  onClose: () => void;
  username: string;
}

// Helper: format Date → 'YYYY-MM-DD' (local)
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Helper: format WIB time string from Date
function toWIBTimeStr(d: Date): string {
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });
}

// Helper: format date for display 'Senin, 3 Juni 2026'
function formatDateDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function StoreToggleModal({ onClose, username }: StoreToggleModalProps) {
  const { isStoreOpen, toggleStoreWithLog } = useAdminStore();

  const today = new Date();
  const todayStr = toLocalDateStr(today);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedAction, setSelectedAction] = useState<'open' | 'closed'>(
    isStoreOpen ? 'open' : 'closed'
  );
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-indexed
  const [liveTime, setLiveTime] = useState<string>(toWIBTimeStr(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live clock — update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(toWIBTimeStr(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Build calendar grid for current calendarYear/calendarMonth
  const buildCalendar = useCallback(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return cells;
  }, [calendarYear, calendarMonth]);

  const calendarCells = buildCalendar();

  const isPastDate = (day: number) => {
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cellStr < todayStr;
  };

  const isSelectedDay = (day: number) => {
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cellStr === selectedDate;
  };

  const isTodayDay = (day: number) => {
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cellStr === todayStr;
  };

  const handleDayClick = (day: number) => {
    if (isPastDate(day)) return;
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(cellStr);
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  // Disable prev month nav if we're already in the current month
  const isPrevMonthDisabled =
    calendarYear === today.getFullYear() && calendarMonth === today.getMonth();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const success = await toggleStoreWithLog(selectedAction, selectedDate, username);
    setIsSubmitting(false);

    if (success) {
      const label = selectedAction === 'open' ? 'BUKA' : 'TUTUP';
      toast.success(
        `✅ Toko berhasil di-${label} untuk ${formatDateDisplay(selectedDate)} — ${liveTime} WIB`,
        { duration: 4000 }
      );
      onClose();
    } else {
      toast.error('Gagal menyimpan status toko. Coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #D94708 100%)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm tracking-wide uppercase">Buka / Tutup Toko</h3>
              <p className="text-white/70 text-[10px] font-medium">Konfirmasi shift & status gerai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">

          {/* Live Clock */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Jam WIB Saat Ini</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="font-mono font-black text-lg text-orange-600 tabular-nums"
                style={{ minWidth: '80px', textAlign: 'right' }}
              >
                {liveTime}
              </span>
              <span className="text-[10px] font-black text-orange-400 uppercase">WIB</span>
            </div>
          </div>

          {/* Date Picker — Calendar */}
          <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <button
                onClick={prevMonth}
                disabled={isPrevMonthDisabled}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black transition-colors ${
                  isPrevMonthDisabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                ‹
              </button>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  {MONTHS[calendarMonth]} {calendarYear}
                </span>
              </div>
              <button
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-gray-600 hover:bg-gray-200 transition-colors"
              >
                ›
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 px-2 pt-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 px-2 pb-2 gap-y-1">
              {calendarCells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const past = isPastDate(day);
                const selected = isSelectedDay(day);
                const todayMark = isTodayDay(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    disabled={past}
                    className={`
                      relative mx-auto w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center transition-all
                      ${past
                        ? 'text-gray-300 cursor-not-allowed'
                        : selected
                        ? 'text-white shadow-md scale-105'
                        : todayMark
                        ? 'text-orange-600 border-2 border-orange-400 hover:bg-orange-50'
                        : 'text-gray-700 hover:bg-orange-50'
                      }
                    `}
                    style={
                      selected
                        ? { background: 'linear-gradient(135deg, #8E0E0E, #D94708)' }
                        : {}
                    }
                  >
                    {day}
                    {todayMark && !selected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected date label */}
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                Tanggal dipilih: <span className="text-orange-600">{formatDateDisplay(selectedDate)}</span>
              </p>
            </div>
          </div>

          {/* Toggle Open / Close */}
          <div className="rounded-2xl border-2 border-gray-100 p-4 space-y-3">
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Status Toko</p>
            <div className="flex gap-3">
              {/* Buka */}
              <button
                onClick={() => setSelectedAction('open')}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                  selectedAction === 'open'
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-md shadow-green-100 scale-[1.02]'
                    : 'border-gray-200 text-gray-400 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedAction === 'open' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Store className="w-5 h-5" />
                </div>
                <span>BUKA</span>
                {selectedAction === 'open' && (
                  <CheckCircle className="w-4 h-4 text-green-500 absolute" />
                )}
              </button>

              {/* Tutup */}
              <button
                onClick={() => setSelectedAction('closed')}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                  selectedAction === 'closed'
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-md shadow-red-100 scale-[1.02]'
                    : 'border-gray-200 text-gray-400 hover:border-red-300 hover:bg-red-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedAction === 'closed' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Store className="w-5 h-5" />
                </div>
                <span>TUTUP</span>
              </button>
            </div>
          </div>

          {/* Summary Info Box */}
          <div
            className="p-3.5 rounded-2xl space-y-1.5"
            style={{
              background:
                selectedAction === 'open'
                  ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
                  : 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
              border: `2px solid ${selectedAction === 'open' ? '#86EFAC' : '#FECDD3'}`,
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ringkasan Konfirmasi</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Operator</span>
                <span className="font-black text-gray-800">{username}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Tanggal</span>
                <span className="font-black text-gray-800">{formatDateDisplay(selectedDate)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Jam Konfirmasi</span>
                <span className="font-mono font-black text-gray-800">{liveTime} WIB</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Status Dipilih</span>
                <span
                  className={`font-black text-sm ${
                    selectedAction === 'open' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {selectedAction === 'open' ? '🟢 BUKA' : '🔴 TUTUP'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-none px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`flex-1 py-3 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
            } ${
              selectedAction === 'open'
                ? 'shadow-green-200'
                : 'shadow-red-200'
            }`}
            style={{
              background:
                selectedAction === 'open'
                  ? 'linear-gradient(135deg, #16A34A, #15803D)'
                  : 'linear-gradient(135deg, #DC2626, #B91C1C)',
            }}
          >
            {isSubmitting
              ? 'Menyimpan...'
              : selectedAction === 'open'
              ? '✅ Konfirmasi BUKA Toko'
              : '🔒 Konfirmasi TUTUP Toko'}
          </button>
        </div>
      </div>
    </div>
  );
}
