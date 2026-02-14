// src/features/cart/ui/CartList.tsx
// src/features/cart/ui/CartList.tsx
import React from "react";
import { useCartStore } from "../model/cart.store";
import { CartItem } from "./CartItem";

export const CartList: React.FC = () => {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return <div className="text-neutral-500">Кошик порожній</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

