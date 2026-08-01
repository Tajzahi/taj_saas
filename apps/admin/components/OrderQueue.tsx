import { useState } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import OrderCard from './OrderCard';
import { Search, ClipboardList, X } from 'lucide-react';

type TabStatus = 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';

const TABS: { key: TabStatus; label: string; color: string }[] = [
  { key: 'received', label: 'Baru', color: 'blue' },
  { key: 'processing', label: 'Diproses', color: 'orange' },
  { key: 'ready', label: 'Siap', color: 'green' },
  { key: 'completed', label: 'Selesai', color: 'gray' },
  { key: 'cancelled', label: 'Batal', color: 'red' },
];

const tabActiveStyle: Record<string, string> = {
  blue: 'bg-blue-600 text-white border-blue-600',
  orange: 'bg-orange-500 text-white border-orange-500',
  green: 'bg-green-600 text-white border-green-600',
  gray: 'bg-gray-500 text-white border-gray-500',
  red: 'bg-red-600 text-white border-red-600',
};

const badgeStyle: Record<string, string> = {
  blue: 'bg-white text-blue-700',
  orange: 'bg-white text-orange-700',
  green: 'bg-white text-green-700',
  gray: 'bg-white text-gray-700',
  red: 'bg-white text-red-700',
};

interface OrderQueueProps {
  onOrderSelect?: () => void;
}

export default function OrderQueue({ onOrderSelect }: OrderQueueProps) {
  const { orders, selectedOrderId, selectOrder, newOrderIds, dismissNewOrder } = useAdminStore();
  const [activeTab, setActiveTab] = useState<TabStatus>('received');
  const [searchQuery, setSearchQuery] = useState('');

  // Hanya tampilkan order hari ini
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr);

  const isSearching = searchQuery.trim() !== '';

  const filtered = todayOrders.filter((o) => {
    const matchTab = isSearching ? true : o.status === activeTab;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      query === '' ||
      o.customerName.toLowerCase().includes(query) ||
      o.orderCode.toLowerCase().includes(query) ||
      (o.notes && o.notes.toLowerCase().includes(query)) ||
      o.items.some(item => item.name.toLowerCase().includes(query));
    return matchTab && matchSearch;
  });

  const countByStatus = (status: TabStatus) =>
    todayOrders.filter((o) => o.status === status).length;

  const handleSelectOrder = (order: AdminOrder) => {
    selectOrder(order.id);
    if (newOrderIds.includes(order.id)) {
      dismissNewOrder(order.id);
    }
    onOrderSelect?.();
  };

  const activeCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header & Search Bar (Merged Side-by-Side) */}
      <div 
        className="px-3 py-2.5 border-b border-gray-200 bg-white flex items-center justify-between gap-3 shrink-0"
        style={{ background: 'linear-gradient(90deg, #8E0E0E0A, transparent)' }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <h2 className="font-black text-sm text-gray-800">Antrean</h2>
          <span className="text-xs text-gray-555 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
            {activeCount}
          </span>
        </div>
        
        <div className="relative flex-1 max-w-[220px] sm:max-w-none">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pesanan / nama / nota..."
            className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-gray-50/80 text-gray-900 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200 overflow-x-auto shrink-0">
        {TABS.map((tab) => {
          const count = countByStatus(tab.key);
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex-1 justify-center ${
                isActive && !isSearching
                  ? `${tabActiveStyle[tab.color]} border-current`
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-black ${
                    isActive && !isSearching ? badgeStyle[tab.color] : 'bg-gray-200 text-gray-700'
                  } ${
                    tab.key === 'received' && count > 0 && !isActive
                      ? '!bg-red-500 !text-white animate-bounce'
                      : ''
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Notice Banner */}
      {isSearching && (
        <div className="bg-orange-50 text-orange-800 text-[11px] px-3 py-1.5 border-b border-orange-100 flex items-center justify-between font-medium">
          <span>Mencari di semua tab status untuk: &quot;{searchQuery}&quot;</span>
          <button onClick={() => setSearchQuery('')} className="underline text-orange-600 font-bold ml-2">Reset</button>
        </div>
      )}

      {/* Order List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <ClipboardList className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-600">Tidak ada pesanan ditemukan</p>
            <p className="text-xs text-gray-400">
              {isSearching ? `Tidak ada pesanan dengan nama / nota "${searchQuery}"` : 'di antrean ini'}
            </p>
          </div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
              isNew={newOrderIds.includes(order.id)}
              onClick={() => handleSelectOrder(order)}
            />
          ))
        )}
      </div>
    </div>
  );
}
