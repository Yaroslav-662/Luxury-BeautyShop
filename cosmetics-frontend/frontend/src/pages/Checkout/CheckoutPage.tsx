// src/pages/cart/CheckoutPage.tsx
import React, { useState } from "react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { useCartStore } from "@/features/cart/model/cart.store";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());

  const [shipping, setShipping] = useState<"pickup" | "delivery">("pickup");

  const shippingPrice = shipping === "pickup" ? 16 : 36;
  const total = subtotal + shippingPrice;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* CUSTOMER */}
          <section className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium">Customer</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <Input type="email" />
              </div>

              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <Input type="tel" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400">Address</label>
              <Input />
            </div>
          </section>

          {/* SHIPPING */}
          <section className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium">Shipping</h2>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={shipping === "pickup"}
                onChange={() => setShipping("pickup")}
              />
              <span>Pick-up</span>
              <span className="ml-auto">16 ₴</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={shipping === "delivery"}
                onChange={() => setShipping("delivery")}
              />
              <span>Delivery</span>
              <span className="ml-auto">36 ₴</span>
            </label>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="bg-zinc-900 rounded-lg p-6 space-y-4 h-fit">
          <h2 className="text-lg font-medium">Summary</h2>

          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>
                  {i.title} × {i.quantity}
                </span>
                <span>{i.subtotal.toFixed(2)} ₴</span>
              </div>
            ))}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice} ₴</span>
            </div>

            <hr className="border-gray-700" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} ₴</span>
            </div>
          </div>

          <Button className="w-full mt-4">
            Complete purchase
          </Button>
        </aside>
      </div>
    </div>
  );
}
