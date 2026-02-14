// src/features/cart/model/cart.selectors.ts

import { useCartStore } from "./cart.store";

export const useCartItems = () =>
  useCartStore((s) => s.items);

export const useCartTotals = () =>
  useCartStore((s) => {
    const totalItems = s.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const subtotal = s.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    return {
      totalItems,
      subtotal,
      currency: s.currency,
    };
  });
