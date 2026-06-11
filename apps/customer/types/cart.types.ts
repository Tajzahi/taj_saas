import { MenuItem, MenuVariant } from './database.types';

export interface CartItem {
  id: string; // Unique ID composed of: menuItemId + (variantId || '')
  menuItem: MenuItem;
  selectedVariant: MenuVariant | null;
  quantity: number;
  notes: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem, variant: MenuVariant | null, quantity: number, notes?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTotalCount: () => number;
}
