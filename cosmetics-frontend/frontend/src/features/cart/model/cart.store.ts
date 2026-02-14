// src/features/cart/model/cart.store.ts
import { create } from "zustand";
import { CartProduct, CartItem } from "./cart.types";

interface CartState {
  items: CartItem[];
  currency: "UAH";
  addToCart: (product: CartProduct, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  currency: "UAH",

  addToCart: (product, qty = 1) => {
    if (!product.imageUrl) {
      throw new Error("CartProduct must have imageUrl");
    }

    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id
              ? {
                  ...i,
                  quantity: i.quantity + qty,
                  subtotal: (i.quantity + qty) * i.price,
                }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...product,
            quantity: qty,
            subtotal: product.price * qty,
          },
        ],
      };
    });
  },

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? { ...i, quantity: qty, subtotal: i.price * qty }
          : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.subtotal, 0),

  getTotalItems: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
