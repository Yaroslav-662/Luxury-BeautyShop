// src/features/cart/ui/CartSummary.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";

export const CartSummary: React.FC = () => {
  const { total } = useCartStore();
  const navigate = useNavigate();

  return (
    <aside className="space-y-4">
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-base">Summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Items in the Cart</span>
            <span>{total.toFixed(2)} ₴</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Savings applied</span>
            <span>-0.00 ₴</span>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between font-bold text-base">
          <span>Total</span>
          <span>{total.toFixed(2)} ₴</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-black text-white py-3 rounded text-sm font-semibold hover:bg-neutral-800 transition-colors tracking-wide"
        >
          GO TO CHECKOUT
        </button>
      </div>

      <div className="border rounded-lg">
        <button className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors">
          <span>DISCOUNT CODE / GIFT CARD</span>
          <span className="text-neutral-400">›</span>
        </button>
      </div>
    </aside>
  );
};
