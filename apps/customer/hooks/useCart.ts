import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '@/types/cart.types';
import { MenuItem, MenuVariant } from '@/types/database.types';

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (menuItem: MenuItem, selectedVariant: MenuVariant | null, quantity: number, notes = '') => {
        const items = get().items;
        const itemId = `${menuItem.id}-${selectedVariant?.id || ''}`;
        
        const existingItemIndex = items.findIndex((item) => item.id === itemId);
        
        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          if (notes) {
            // Append or overwrite note
            updatedItems[existingItemIndex].notes = notes;
          }
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            id: itemId,
            menuItem,
            selectedVariant,
            quantity,
            notes,
          };
          set({ items: [...items, newItem] });
        }
      },
      
      removeItem: (cartItemId: string) => {
        set({ items: get().items.filter((item) => item.id !== cartItemId) });
      },
      
      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        
        const updatedItems = get().items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },
      
      updateNotes: (cartItemId: string, notes: string) => {
        const updatedItems = get().items.map((item) =>
          item.id === cartItemId ? { ...item, notes } : item
        );
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const basePrice = Number(item.menuItem.price);
          const adjustment = Number(item.selectedVariant?.price_adjustment || 0);
          const itemPrice = basePrice + adjustment;
          return acc + itemPrice * item.quantity;
        }, 0);
      },
      
      getCartTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'a6-nyuss-cart-storage',
    }
  )
);
export default useCart;
