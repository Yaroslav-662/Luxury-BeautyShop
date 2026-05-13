// src/pages/Cart/CartPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function CartPage() {
  const { items, total, remove, changeQty, clear } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-black bg-white min-h-screen">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/shop" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
          ← Back to Shop
        </Link>
        <span className="flex items-center gap-1 text-sm text-neutral-500 cursor-pointer hover:text-black">
          ⓘ Customer Support
        </span>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-2">Shopping Cart</h1>
      <p className="text-center text-neutral-500 text-sm mb-10">
        Shipping charges and discount codes are confirmed at checkout.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 mb-6">Кошик порожній</p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-neutral-800 transition"
          >
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* LEFT — список товарів */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-base">Your order</h2>
              <button
                onClick={clear}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
              >
                Очистити кошик
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 items-start">
                  {/* Фото */}
                  <img
                    src={resolveImage(item.image)}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-neutral-100 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/80x80?text=No+Image";
                    }}
                  />

                  {/* Інфо */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Доставка: 2–4 тижні
                    </p>

                    {/* Кількість */}
                    <div className="flex items-center gap-0 mt-3 border rounded w-fit overflow-hidden">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? changeQty(item._id, item.quantity - 1)
                            : remove(item._id)
                        }
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-neutral-100 transition-colors"
                      >
                        ‹
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-neutral-100 transition-colors"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Ціна + видалити */}
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

            {/* Safe & easy shopping */}
            <div className="mt-8">
              <h3 className="font-semibold text-sm mb-3">Safe &amp; easy shopping</h3>
              <div className="border rounded-lg divide-y divide-neutral-100">
                {[
                  { icon: "↩", text: "Free returns for 30 days" },
                  { icon: "💳", text: "Convenient payment methods" },
                  { icon: "🚚", text: "Deliver to home or pick-up point" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex justify-between items-center px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      {item.text}
                    </span>
                    <span className="text-neutral-400">›</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — підсумок */}
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

              <Link to="/checkout">
                <button className="w-full bg-black text-white py-3 rounded text-sm font-semibold hover:bg-neutral-800 transition-colors tracking-wide">
                  GO TO CHECKOUT
                </button>
              </Link>
            </div>

            {/* Discount code */}
            <div className="border rounded-lg">
              <button className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors">
                <span>DISCOUNT CODE / GIFT CARD</span>
                <span className="text-neutral-400">›</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
