// src/features/cart/ui/CartList.tsx
import React from "react";
import { useCartStore } from "@/store/cart.store";
import { resolveImage } from "@/shared/lib/resolveImage";

export const CartList: React.FC = () => {
  const { items, remove, changeQty } = useCartStore();

  if (items.length === 0) {
    return <div className="text-neutral-500 text-sm">Кошик порожній</div>;
  }

  return (
    <div className="divide-y divide-neutral-100 border rounded-lg overflow-hidden">
      {items.map((item) => (
        <div key={item._id} className="flex gap-4 p-4 items-start">
          <img
            src={resolveImage(item.image)}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg bg-neutral-100 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/80x80?text=No+Image";
            }}
          />

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {item.price} ₴ за одиницю
            </p>

            <div className="flex items-center gap-0 mt-3 border rounded w-fit overflow-hidden">
              <button
                onClick={() =>
                  item.quantity > 1
                    ? changeQty(item._id, item.quantity - 1)
                    : remove(item._id)
                }
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-neutral-100"
              >
                ‹
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => changeQty(item._id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-neutral-100"
              >
                ›
              </button>
            </div>
          </div>

          <div className="text-right shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => remove(item._id)}
              className="text-neutral-300 hover:text-red-500 transition-colors"
              title="Видалити"
            >
              🗑
            </button>
            <p className="font-semibold text-sm">
              {(item.price * item.quantity).toFixed(2)} ₴
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
