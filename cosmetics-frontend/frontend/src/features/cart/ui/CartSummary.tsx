import React from "react";
import Button from "@/shared/ui/Button";
import { useCartStore } from "../model/cart.store";
import { useNavigate } from "react-router-dom";

export const CartSummary: React.FC = () => {
  const total = useCartStore((s) => s.getSubtotal());
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
      <h2 className="font-semibold text-lg">Summary</h2>

      <div className="flex justify-between text-sm">
        <span>Items in cart</span>
        <span>{total.toFixed(2)} ₴</span>
      </div>

      <div className="flex justify-between text-sm text-green-600">
        <span>Savings applied</span>
        <span>-0.00 ₴</span>
      </div>

      <div className="border-t pt-4 flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{total.toFixed(2)} ₴</span>
      </div>

      <Button
        className="w-full"
        onClick={() => navigate("/checkout")}
      >
        GO TO CHECKOUT
      </Button>
    </div>
  );
};
