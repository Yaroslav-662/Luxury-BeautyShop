// src/features/cart/pages/CartPage.tsx
import React from "react";
import { CartList } from "@/features/cart/ui/CartList";
import { CartSummary } from "@/features/cart/ui/CartSummary";
import { Link } from "react-router-dom";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <Link to="/" className="text-sm text-neutral-500">
          ← Back to shop
        </Link>

        <div className="text-sm text-neutral-500">
          Customer Support
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-2">
        Shopping Cart
      </h1>

      <p className="text-center text-neutral-500 mb-10">
        Shipping charges and discount codes are confirmed at checkout.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Left */}
        <div>
          <h2 className="font-semibold mb-4">Your order</h2>
          <CartList />
        </div>

        {/* Right */}
        <CartSummary />
      </div>
    </div>
  );
}
