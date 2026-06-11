import { useState } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import OrderCard from './OrderCard';
import { Search, ClipboardList } from 'lucide-react';

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

  const filtered = todayOrders.filter((o) => {
    const matchTab = o.status === activeTab;
    const matchSearch =
      searchQuery === '' ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase());
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
            placeholder="Cari pesanan..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 bg-gray-50/50"
          />
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
                isActive
                  ? `${tabActiveStyle[tab.color]} border-current`
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-black ${
                    isActive ? badgeStyle[tab.color] : 'bg-gray-200 text-gray-700'
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

      {/* Order List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <ClipboardList className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-sm font-medium">Tidak ada pesanan</p>
            <p className="text-xs">di antrean ini</p>
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
