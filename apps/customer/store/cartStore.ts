import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, MenuVariant } from '@/data/menu';

export interface CartItemVariant {
  label: string;
  option: MenuVariant;
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  selectedVariants: CartItemVariant[];
  quantity: number;
  note: string;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  generalNote: string;
  // Kode promo yang divalidasi server — hanya disimpan setelah /api/validate-promo mengembalikan valid:true
  promoCode: string | null;
  // Diskon yang dikonfirmasi server (bukan kalkulasi client-side)
  serverPromoDiscount: number;
  addItem: (menuItem: MenuItem, variants: CartItemVariant[], quantity: number, note: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  setGeneralNote: (note: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  // Promo hanya bisa diset setelah server validasi — dipanggil dari checkout page
  setServerValidatedPromo: (code: string, discountAmount: number) => void;
  clearPromoCode: () => void;
}

function calculateItemPrice(menuItem: MenuItem, variants: CartItemVariant[], quantity: number): number {
  const basePrice = menuItem.price;
  const variantModifiers = variants.reduce((sum, v) => sum + v.option.priceModifier, 0);
  return (basePrice + variantModifiers) * quantity;
}

function generateCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      generalNote: '',
      promoCode: null,
      // Diskon dikonfirmasi dari server — bukan kalkulasi client-side
      serverPromoDiscount: 0,

      addItem: (menuItem, selectedVariants, quantity, note) => {
        const cartId = generateCartId();
        const totalPrice = calculateItemPrice(menuItem, selectedVariants, quantity);
        set((state) => ({
          items: [
            ...state.items,
            { cartId, menuItem, selectedVariants, quantity, note, totalPrice },
          ],
        }));
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId
              ? {
                  ...item,
                  quantity,
                  totalPrice: calculateItemPrice(item.menuItem, item.selectedVariants, quantity),
                }
              : item
          ),
        }));
      },

      setGeneralNote: (note) => set({ generalNote: note }),

      clearCart: () => set({ items: [], generalNote: '', promoCode: null, serverPromoDiscount: 0 }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      /**
       * Panggil ini HANYA setelah /api/validate-promo mengembalikan valid:true.
       * Diskon yang disimpan berasal dari server, bukan kalkulasi client-side.
       */
      setServerValidatedPromo: (code, discountAmount) => {
        set({ promoCode: code, serverPromoDiscount: discountAmount });
      },

      clearPromoCode: () => set({ promoCode: null, serverPromoDiscount: 0 }),
    }),
    {
      name: 'a6nyuss-cart',
    }
  )
);

export interface Order {
  orderCode: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  deliveryAddress?: string;
  addressNote?: string;
  generalNote: string;
  paymentMethod: 'cod' | 'qris';
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  estimatedTime: number;
  paymentStatus?: string;
  paymentProofUrl?: string;
  promoCode?: string;
  promoDiscount?: number;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  setCurrentOrder: (order: Order) => void;
  getOrderByCode: (code: string) => Order | undefined;
  updateOrderStatus: (code: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orderHistory: [],

      setCurrentOrder: (order) => {
        set((state) => ({
          currentOrder: order,
          orderHistory: [order, ...state.orderHistory.filter((o) => o.orderCode !== order.orderCode)],
        }));
      },

      getOrderByCode: (code) => {
        return get().orderHistory.find((o) => o.orderCode === code);
      },

      updateOrderStatus: (code, status) => {
        set((state) => ({
          orderHistory: state.orderHistory.map((o) =>
            o.orderCode === code ? { ...o, status } : o
          ),
          currentOrder:
            state.currentOrder?.orderCode === code
              ? { ...state.currentOrder, status }
              : state.currentOrder,
        }));
      },
    }),
    {
      name: 'a6nyuss-orders',
    }
  )
);

export function generateOrderCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `A6-${date}-${rand}`;
}

export const DELIVERY_FEE = 10000;
export const DELIVERY_ZONES: { name: string; fee: number }[] = [
  { name: 'Zona 1 (0-3 km)', fee: 8000 },
  { name: 'Zona 2 (3-6 km)', fee: 13000 },
  { name: 'Zona 3 (6-10 km)', fee: 18000 },
];
