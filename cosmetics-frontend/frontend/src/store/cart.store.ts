// src/store/cart.store.ts
import { create } from "zustand";
import { toast } from "@/shared/ui/Toast";

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
  add: (product: Omit<CartItem, "quantity">) => void;
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
  const initialItems: CartItem[] = (() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  })();

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
        toast.success(`${product.name.slice(0, 30)} — ще 1 додано`, "🛒");
      } else {
        updated = [...items, { ...product, quantity: 1 }];
        toast.success("Додано до кошика", "🛒");
      }

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      set({ items: updated, count: getCount(updated), total: getTotal(updated) });
    },

    remove: (id) => {
      const { items } = get();
      const item = items.find((i) => i._id === id);
      const updated = items.filter((i) => i._id !== id);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      set({ items: updated, count: getCount(updated), total: getTotal(updated) });
      if (item) toast.info(`${item.name.slice(0, 30)} видалено з кошика`, "🗑️");
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
      toast.info("Кошик очищено", "🗑️");
    },
  };
});

