import { create } from 'zustand';
import { menuItems as staticMenuItems, toppingOptions } from '../data/menu';

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
  id: number;
  action: 'open' | 'closed';
  operatorName: string | null;
  operatorId: string | null;
  selectedDate: string; // 'YYYY-MM-DD'
  loggedAt: string;    // ISO timestamp WIB
  notes: string | null;
}

export interface ShiftLog {
  id: number;
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

// Generate some realistic initial mock orders
const initialMockOrders: AdminOrder[] = [
  {
    id: 'mock-order-1',
    orderCode: 'A6-20260610-1823',
    customerName: 'Budi Hartono',
    customerPhone: '081234567890',
    deliveryType: 'pickup',
    deliveryAddress: null,
    deliveryDistance: null,
    deliveryFee: 0,
    subtotal: 50000,
    discount: 0,
    couponCode: null,
    totalPrice: 50000,
    status: 'received',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    paymentProofUrl: null,
    notes: 'Minta daun bawang agak banyak ya pak',
    cancellationReason: null,
    items: [
      {
        id: 'item-1',
        name: 'Martabak Telur Ayam - 2 Telur',
        quantity: 2,
        price: 25000,
        variant: 'Daging Ayam'
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  },
  {
    id: 'mock-order-2',
    orderCode: 'A6-20260610-1288',
    customerName: 'Siti Rahma',
    customerPhone: '08561234567',
    deliveryType: 'delivery',
    deliveryAddress: 'Jl. Pemuda No. 45, Surabaya',
    deliveryDistance: 3.5,
    deliveryFee: 13000,
    subtotal: 45000,
    discount: 5000,
    couponCode: 'WEBAPPNEW',
    totalPrice: 53000,
    status: 'received',
    paymentMethod: 'transfer',
    paymentStatus: 'waiting_verification',
    paymentProofUrl: 'https://placehold.co/400x600/16a34a/white?text=Bukti+Transfer+MOCK',
    notes: 'Kupon WEBAPPNEW applied',
    cancellationReason: null,
    items: [
      {
        id: 'item-2',
        name: 'Terang Bulan Milo + 1 Topping',
        quantity: 1,
        price: 25000,
        topping: 'Keju'
      },
      {
        id: 'item-3',
        name: 'Martabak Telur Ayam - 1 Telur',
        quantity: 1,
        price: 20000,
        variant: 'Daging Sapi'
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: 'mock-order-3',
    orderCode: 'A6-20260610-8812',
    customerName: 'Andi Saputra',
    customerPhone: '081399887766',
    deliveryType: 'pickup',
    deliveryAddress: null,
    deliveryDistance: null,
    deliveryFee: 0,
    subtotal: 40000,
    discount: 0,
    couponCode: null,
    totalPrice: 40000,
    status: 'ready',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    paymentProofUrl: null,
    notes: 'Jangan terlalu asin',
    cancellationReason: null,
    items: [
      {
        id: 'item-4',
        name: 'Martabak Telur Bebek - 2 Telur',
        quantity: 1,
        price: 40000,
        variant: 'Daging Ayam'
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  }
];

export const useAdminStore = create<AdminState>((set, get) => ({
  orders: initialMockOrders,
  menuItems: [],
  toppings: [],
  storeLogs: [],
  activeShift: null,
  selectedOrderId: 'mock-order-1',
  isAlarmPlaying: false,
  isStoreOpen: true,
  newOrderIds: [],
  isLoading: false,
  subscription: null,
  connectionStatus: 'connected',

  selectOrder: (id) => set({ selectedOrderId: id }),

  writeAuditLog: async (action, details, orderId) => {
    console.log('[Mock Audit Log]:', { action, details, orderId });
  },

  updateOrderStatus: async (id, newStatus, cancellationReason) => {
    const order = get().orders.find((o) => o.id === id);
    const shouldAutoPay = newStatus === 'completed' && order && order.paymentMethod === 'cod';

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              cancellationReason: cancellationReason || null,
              paymentStatus: shouldAutoPay ? 'paid' : o.paymentStatus,
            }
          : o
      ),
    }));

    // If COD completed, update expected cash in mock active shift
    const activeShift = get().activeShift;
    if (shouldAutoPay && activeShift && order) {
      const newExpectedCash = activeShift.expectedCash + order.totalPrice;
      set({
        activeShift: {
          ...activeShift,
          expectedCash: newExpectedCash,
        },
      });
    }

    return true;
  },

  verifyPaymentStatus: async (id, isPaid) => {
    const newPaymentStatus = isPaid ? 'paid' : 'failed';
    const order = get().orders.find((o) => o.id === id);

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, paymentStatus: newPaymentStatus } : o
      ),
    }));

    // If payment verified (paid), update expected cash in mock active shift for transfers too
    const activeShift = get().activeShift;
    if (isPaid && activeShift && order) {
      const newExpectedCash = activeShift.expectedCash + order.totalPrice;
      set({
        activeShift: {
          ...activeShift,
          expectedCash: newExpectedCash,
        },
      });
    }

    return true;
  },

  stopAlarm: () => set({ isAlarmPlaying: false }),
  playAlarm: () => set({ isAlarmPlaying: true }),

  addNewOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
      newOrderIds: [...state.newOrderIds, order.id],
      isAlarmPlaying: order.status === 'received' ? true : state.isAlarmPlaying,
    }));
  },

  dismissNewOrder: (id) => {
    set((state) => ({
      newOrderIds: state.newOrderIds.filter((nid) => nid !== id),
      isAlarmPlaying: state.newOrderIds.filter((nid) => nid !== id).length > 0,
    }));
  },

  toggleStore: async () => {
    const nextState = !get().isStoreOpen;
    set({ isStoreOpen: nextState });
  },

  toggleStoreWithLog: async (action, selectedDate, operatorName) => {
    const nextIsOpen = action === 'open';
    const now = new Date();
    const newLog: StoreLog = {
      id: Date.now(),
      action,
      operatorName,
      operatorId: 'mock-operator-id',
      selectedDate,
      loggedAt: now.toISOString(),
      notes: `Toko di${action === 'open' ? 'buka' : 'tutup'} oleh ${operatorName} pada ${selectedDate}`,
    };

    set((state) => ({
      isStoreOpen: nextIsOpen,
      storeLogs: [newLog, ...state.storeLogs]
    }));

    return true;
  },

  fetchStoreLogs: async (date) => {
    // Return mock logs
    if (get().storeLogs.length === 0) {
      set({
        storeLogs: [
          {
            id: 1,
            action: 'open',
            operatorName: 'Budi Kasir',
            operatorId: 'mock-operator-id',
            selectedDate: new Date().toISOString().slice(0, 10),
            loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            notes: 'Toko dibuka oleh Budi Kasir'
          }
        ]
      });
    }
  },

  fetchStoreSettings: async () => {
    // Set default open state
    set({ isStoreOpen: true });
  },

  fetchMenuItems: async () => {
    const formatted: MenuItem[] = staticMenuItems.map((m: any) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      isAvailable: m.badge !== 'habis',
      price: m.price,
      categoryId: m.category,
      categoryName: m.categoryLabel,
    }));

    set({ menuItems: formatted });
  },

  toggleMenuItemAvailability: async (id, isAvailable) => {
    set((state) => ({
      menuItems: state.menuItems.map((m) =>
        m.id === id ? { ...m, isAvailable } : m
      ),
    }));
    return true;
  },

  fetchToppings: async () => {
    const formatted: ToppingItem[] = toppingOptions.map((t: any) => ({
      id: t.id,
      name: t.name,
      isAvailable: true,
    }));

    set({ toppings: formatted });
  },

  toggleToppingAvailability: async (id, isAvailable) => {
    set((state) => ({
      toppings: state.toppings.map((t) =>
        t.id === id ? { ...t, isAvailable } : t
      ),
    }));
    return true;
  },

  fetchOrders: async () => {
    // Orders are already initialized, do nothing
  },

  subscribeToOrders: () => {
    console.log('[Ably Realtime] Subscribed to orders');
    const ablyKey = "CaWXiA.3YmauA:H7LLGQ8DyVxEwdCsCxeHp3ZkOU3tBIUBJ9HuYXrkFOo";
    
    // Lazy load Ably client side
    import('ably').then(({ Realtime }) => {
      const tenantSlug = "a6-nyuss"; // fallback/dev default
      const ably = new Realtime({ key: ablyKey });
      const channel = ably.channels.get(`orders:${tenantSlug}`);
      
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
          paymentProofUrl: null,
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

        // Add order to state
        if (get().activeShift) {
          get().addNewOrder(newOrder);
        }
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
    // Return mock active shift if it was opened
  },

  openShift: async (startingCash, operatorName) => {
    const newShift: ShiftLog = {
      id: Date.now(),
      operatorId: 'mock-operator-id',
      operatorName,
      openedAt: new Date().toISOString(),
      closedAt: null,
      startingCash,
      expectedCash: startingCash,
      actualCash: null,
      drift: null,
      status: 'open',
    };

    set({ activeShift: newShift });
    return true;
  },

  closeShift: async (actualCash, expectedCash) => {
    const { activeShift } = get();
    if (!activeShift) return false;

    const drift = actualCash - expectedCash;

    set({
      activeShift: {
        ...activeShift,
        status: 'closed',
        closedAt: new Date().toISOString(),
        actualCash: actualCash,
        drift: drift,
      }
    });

    return true;
  },
}));
