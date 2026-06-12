import { create } from 'zustand';
import { menuItems as staticMenuItems, toppingOptions } from '../data/menu';
import toast from 'react-hot-toast';
import {
  getOrdersAction,
  updateOrderStatusAction,
  verifyPaymentStatusAction,
  getActiveShiftAction,
  openShiftAction,
  closeShiftAction,
  getMenuItemsAction,
  toggleMenuItemAvailabilityAction,
  getToppingsAction,
  toggleToppingAvailabilityAction,
  getStoreLogsAction,
  toggleStoreAction,
  getStoreSettingsAction,
  writeAuditLogAction,
} from '../app/actions';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  topping?: string;
}

export interface AdminOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress: string | null;
  deliveryDistance: number | null;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  totalPrice: number;
  status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'cod' | 'transfer';
  paymentStatus: 'pending' | 'waiting_verification' | 'paid' | 'failed' | 'refunded';
  paymentProofUrl: string | null;
  notes: string | null;
  cancellationReason: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  isAvailable: boolean;
  price: number;
  categoryId: string;
  categoryName: string;
}

export interface ToppingItem {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface StoreLog {
  id: string;
  action: 'open' | 'closed';
  operatorName: string | null;
  operatorId: string | null;
  selectedDate: string; // 'YYYY-MM-DD'
  loggedAt: string;    // ISO timestamp WIB
  notes: string | null;
}

export interface ShiftLog {
  id: string;
  operatorId: string | null;
  operatorName: string;
  openedAt: string;
  closedAt: string | null;
  startingCash: number;
  expectedCash: number;
  actualCash: number | null;
  drift: number | null;
  status: 'open' | 'closed';
}

interface AdminState {
  orders: AdminOrder[];
  menuItems: MenuItem[];
  toppings: ToppingItem[];
  storeLogs: StoreLog[];
  activeShift: ShiftLog | null;
  selectedOrderId: string | null;
  isAlarmPlaying: boolean;
  isStoreOpen: boolean;
  newOrderIds: string[];
  isLoading: boolean;
  subscription: any | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  selectOrder: (id: string) => void;
  updateOrderStatus: (id: string, newStatus: AdminOrder['status'], cancellationReason?: string) => Promise<boolean>;
  verifyPaymentStatus: (id: string, isPaid: boolean) => Promise<boolean>;
  stopAlarm: () => void;
  playAlarm: () => void;
  addNewOrder: (order: AdminOrder) => void;
  dismissNewOrder: (id: string) => void;
  toggleStore: () => Promise<void>;
  toggleStoreWithLog: (action: 'open' | 'closed', selectedDate: string, operatorName: string) => Promise<boolean>;
  fetchStoreLogs: (date?: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchStoreSettings: () => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  toggleMenuItemAvailability: (id: string, isAvailable: boolean) => Promise<boolean>;
  fetchToppings: () => Promise<void>;
  toggleToppingAvailability: (id: string, isAvailable: boolean) => Promise<boolean>;
  writeAuditLog: (action: string, details: string, orderId?: string) => Promise<void>;
  subscribeToOrders: () => void;
  unsubscribeFromOrders: () => void;
  fetchActiveShift: () => Promise<void>;
  openShift: (startingCash: number, operatorName: string) => Promise<boolean>;
  closeShift: (actualCash: number, expectedCash: number) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  orders: [],
  menuItems: [],
  toppings: [],
  storeLogs: [],
  activeShift: null,
  selectedOrderId: null,
  isAlarmPlaying: false,
  isStoreOpen: true,
  newOrderIds: [],
  isLoading: false,
  subscription: null,
  connectionStatus: 'connected',

  selectOrder: (id) => set({ selectedOrderId: id }),

  writeAuditLog: async (action, details, orderId) => {
    await writeAuditLogAction(action, details, orderId);
  },

  updateOrderStatus: async (id, newStatus, cancellationReason) => {
    set({ isLoading: true });
    const res = await updateOrderStatusAction(id, newStatus, cancellationReason);
    if (res.success) {
      await get().fetchOrders();
      await get().fetchActiveShift();
      toast.success(`Status pesanan diperbarui ke ${newStatus}`);
    } else {
      toast.error(res.error || 'Gagal memperbarui status pesanan');
    }
    set({ isLoading: false });
    return !!res.success;
  },

  verifyPaymentStatus: async (id, isPaid) => {
    set({ isLoading: true });
    const res = await verifyPaymentStatusAction(id, isPaid);
    if (res.success) {
      await get().fetchOrders();
      await get().fetchActiveShift();
      toast.success(isPaid ? 'Pembayaran lunas terverifikasi' : 'Verifikasi pembayaran ditolak');
    } else {
      toast.error(res.error || 'Gagal memverifikasi pembayaran');
    }
    set({ isLoading: false });
    return !!res.success;
  },

  stopAlarm: () => set({ isAlarmPlaying: false }),
  playAlarm: () => set({ isAlarmPlaying: true }),

  addNewOrder: (order) => {
    set((state) => {
      // Prevent duplicates
      if (state.orders.some((o) => o.id === order.id)) {
        return state;
      }
      return {
        orders: [order, ...state.orders],
        newOrderIds: [...state.newOrderIds, order.id],
        isAlarmPlaying: order.status === 'received' ? true : state.isAlarmPlaying,
        selectedOrderId: state.selectedOrderId || order.id,
      };
    });
  },

  dismissNewOrder: (id) => {
    set((state) => ({
      newOrderIds: state.newOrderIds.filter((nid) => nid !== id),
      isAlarmPlaying: state.newOrderIds.filter((nid) => nid !== id).length > 0,
    }));
  },

  toggleStore: async () => {
    const nextState = !get().isStoreOpen;
    const res = await toggleStoreAction(nextState);
    if (res.success) {
      set({ isStoreOpen: nextState });
      toast.success(`Gerai di${nextState ? 'buka' : 'tutup'}`);
    } else {
      toast.error(res.error || 'Gagal mengubah status gerai');
    }
  },

  toggleStoreWithLog: async (action, selectedDate, operatorName) => {
    const nextIsOpen = action === 'open';
    const res = await toggleStoreAction(nextIsOpen);
    if (res.success) {
      await writeAuditLogAction(`store_${action}`, `Toko di${action === 'open' ? 'buka' : 'tutup'} oleh ${operatorName} pada ${selectedDate}`);
      await get().fetchStoreLogs();
      set({ isStoreOpen: nextIsOpen });
      toast.success(`Gerai di${action === 'open' ? 'buka' : 'tutup'}`);
      return true;
    } else {
      toast.error(res.error || 'Gagal mengubah status gerai');
      return false;
    }
  },

  fetchStoreLogs: async (date) => {
    const res = await getStoreLogsAction();
    if (res.success) {
      set({ storeLogs: res.storeLogs });
    }
  },

  fetchStoreSettings: async () => {
    const res = await getStoreSettingsAction();
    if (res.success && res.isOpen !== undefined) {
      set({ isStoreOpen: res.isOpen });
    }
  },

  fetchMenuItems: async () => {
    const res = await getMenuItemsAction();
    if (res.success) {
      set({ menuItems: res.menuItems });
    }
  },

  toggleMenuItemAvailability: async (id, isAvailable) => {
    const res = await toggleMenuItemAvailabilityAction(id, isAvailable);
    if (res.success) {
      set((state) => ({
        menuItems: state.menuItems.map((m) =>
          m.id === id ? { ...m, isAvailable } : m
        ),
      }));
      toast.success('Status ketersediaan menu diperbarui');
      return true;
    } else {
      toast.error(res.error || 'Gagal mengubah ketersediaan menu');
      return false;
    }
  },

  fetchToppings: async () => {
    const res = await getToppingsAction();
    if (res.success) {
      set({ toppings: res.toppings });
    }
  },

  toggleToppingAvailability: async (id, isAvailable) => {
    const res = await toggleToppingAvailabilityAction(id, isAvailable);
    if (res.success) {
      set((state) => ({
        toppings: state.toppings.map((t) =>
          t.id === id ? { ...t, isAvailable } : t
        ),
      }));
      toast.success('Status ketersediaan topping diperbarui');
      return true;
    } else {
      toast.error(res.error || 'Gagal mengubah ketersediaan topping');
      return false;
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    const res = await getOrdersAction();
    if (res.success) {
      set({
        orders: res.orders,
        selectedOrderId: get().selectedOrderId || (res.orders[0]?.id ?? null),
      });
    }
    set({ isLoading: false });
  },

  subscribeToOrders: () => {
    console.log('[Ably Realtime] Subscribed to orders');
    const ablyKey = "CaWXiA.3YmauA:H7LLGQ8DyVxEwdCsCxeHp3ZkOU3tBIUBJ9HuYXrkFOo";
    
    // Resolve tenantSlug dynamically from hostname on client side
    let tenantSlug = "a6-nyuss";
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      if (parts.length >= 3) {
        tenantSlug = parts[1];
      }
    }

    // Lazy load Ably client side
    import('ably').then(({ Realtime }) => {
      const ably = new Realtime({ key: ablyKey });
      const channel = ably.channels.get(`orders:${tenantSlug}`);
      
      // Listen for new orders
      channel.subscribe('new-order', (message) => {
        const orderData = message.data.order;
        console.log('[Ably] Realtime order received:', orderData);

        const newOrder: AdminOrder = {
          id: orderData.id,
          orderCode: orderData.orderCode,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          deliveryType: orderData.deliveryType,
          deliveryAddress: orderData.deliveryAddress,
          deliveryDistance: null,
          deliveryFee: Number(orderData.deliveryFee || 0),
          subtotal: Number(orderData.subtotal),
          discount: 0,
          couponCode: null,
          totalPrice: Number(orderData.totalPrice),
          status: orderData.status,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus,
          paymentProofUrl: orderData.paymentProofUrl || null,
          notes: orderData.notes,
          cancellationReason: null,
          items: orderData.items.map((item: any, idx: number) => ({
            id: item.menuItemId || `item-${idx}`,
            name: item.menuItemName,
            quantity: item.quantity,
            price: Number(item.unitPrice),
            variant: item.variantName || undefined
          })),
          createdAt: orderData.createdAt
        };

        if (get().activeShift) {
          get().addNewOrder(newOrder);
          toast.success(`🔔 Pesanan Baru Masuk: ${orderData.orderCode}`, {
            duration: 5000,
            style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' }
          });
        }
      });

      // Listen for payment updates (proof uploaded)
      channel.subscribe('order-updated', async (message) => {
        console.log('[Ably] Realtime payment update received:', message.data);
        await get().fetchOrders();
        toast(`📸 Bukti Pembayaran Diunggah untuk ${message.data.orderCode}`, {
          icon: '📝',
          style: { background: '#1a0a0a', color: '#fff' }
        });
      });

      // Listen for order cancellations from customer tracking page
      channel.subscribe('order-cancelled', async (message) => {
        console.log('[Ably] Realtime cancellation received:', message.data);
        await get().fetchOrders();
        toast.error(`❌ Pesanan ${message.data.orderCode} dibatalkan oleh pelanggan.`, {
          duration: 6000
        });
      });

      set({ subscription: { ably, channel } });
    });
  },

  unsubscribeFromOrders: () => {
    console.log('[Ably Realtime] Unsubscribed from orders');
    const { subscription } = get();
    if (subscription) {
      try {
        subscription.channel.unsubscribe();
        subscription.ably.close();
      } catch (err) {
        console.error('Error during Ably unsubscribe:', err);
      }
      set({ subscription: null });
    }
  },

  fetchActiveShift: async () => {
    const res = await getActiveShiftAction();
    if (res.success) {
      set({ activeShift: res.activeShift });
    }
  },

  openShift: async (startingCash, operatorName) => {
    const res = await openShiftAction(startingCash, operatorName);
    if (res.success && res.shift) {
      set({ activeShift: res.shift });
      toast.success(`Shift berhasil dibuka oleh ${operatorName}`);
      return true;
    } else {
      toast.error(res.error || 'Gagal membuka shift');
      return false;
    }
  },

  closeShift: async (actualCash, expectedCash) => {
    const { activeShift } = get();
    if (!activeShift) return false;

    const res = await closeShiftAction(activeShift.id, actualCash, expectedCash);
    if (res.success) {
      set({
        activeShift: {
          ...activeShift,
          status: 'closed',
          closedAt: new Date().toISOString(),
          actualCash: actualCash,
          drift: actualCash - expectedCash,
        }
      });
      toast.success('Shift berhasil ditutup');
      return true;
    } else {
      toast.error(res.error || 'Gagal menutup shift');
      return false;
    }
  },
}));
