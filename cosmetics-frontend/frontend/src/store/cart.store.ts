// frontend/src/store/cart.store.ts
import { create } from "zustand";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  total: number;

  add: (product: any) => void;
  remove: (id: string) => void;
  clear: () => void;
  changeQty: (id: string, qty: number) => void;
}

const CART_KEY = "beauty_cart";

function getCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

function getTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export const useCartStore = create<CartState>((set, get) => {
  const initialItems: CartItem[] = JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
  );

  return {
    items: initialItems,
    count: getCount(initialItems),
    total: getTotal(initialItems),

    add: (product) => {
      const { items } = get();
      const existing = items.find((i) => i._id === product._id);

      let updated: CartItem[];

      if (existing) {
        updated = items.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...items, { ...product, quantity: 1 }];
      }

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      set({ items: updated, count: getCount(updated), total: getTotal(updated) });
    },

    remove: (id) => {
      const updated = get().items.filter((i) => i._id !== id);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      set({ items: updated, count: getCount(updated), total: getTotal(updated) });
    },

    changeQty: (id, qty) => {
      const updated = get().items.map((i) =>
        i._id === id ? { ...i, quantity: qty } : i
      );

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      set({ items: updated, count: getCount(updated), total: getTotal(updated) });
    },

    clear: () => {
      localStorage.removeItem(CART_KEY);
      set({ items: [], count: 0, total: 0 });
    },
  };
});
