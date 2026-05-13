// src/pages/Cart/CartPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function CartPage() {
  const { items, total, remove, changeQty, clear } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="text-sm text-neutral-500 hover:text-black">← Back to shop</Link>
        </div>
        <h1 className="text-3xl font-semibold text-center mb-4">Shopping Cart</h1>
        <p className="text-center text-neutral-500">Кошик порожній.</p>
        <div className="text-center mt-6">
          <Link to="/shop" className="underline text-sm hover:text-neutral-700">Перейти до каталогу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <Link to="/" className="text-sm text-neutral-500 hover:text-black">← Back to shop</Link>
        <span className="text-sm text-neutral-500">Customer Support</span>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-2">Shopping Cart</h1>
      <p className="text-center text-neutral-500 mb-10">
        Shipping charges and discount codes are confirmed at checkout.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Список товарів */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Your order</h2>
            <button
              onClick={clear}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Очистити кошик
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border-b pb-4 items-start"
              >
                {/* Фото */}
                <img
                  src={resolveImage(item.image)}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0 bg-neutral-100"
                />

                {/* Інфо */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight">{item.name}</p>
                  <p className="text-sm text-neutral-500 mt-1">{item.price} ₴</p>

                  {/* Кількість */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => item.quantity > 1 ? changeQty(item._id, item.quantity - 1) : remove(item._id)}
                      className="w-7 h-7 border rounded flex items-center justify-center text-sm hover:bg-neutral-100"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => changeQty(item._id, item.quantity + 1)}
                      className="w-7 h-7 border rounded flex items-center justify-center text-sm hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Сума + видалення */}
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">{(item.price * item.quantity).toFixed(2)} ₴</p>
                  <button
                    onClick={() => remove(item._id)}
                    className="text-xs text-neutral-400 hover:text-red-500 mt-2"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Підсумок */}
        <aside className="border rounded-xl p-6 space-y-4 h-fit">
          <h2 className="font-semibold text-lg">Order summary</h2>

          <div className="space-y-2 text-sm text-neutral-600">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>{(i.price * i.quantity).toFixed(2)} ₴</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)} ₴</span>
          </div>

          <Link to="/checkout">
            <button className="w-full mt-2 bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
              Оформити замовлення
            </button>
          </Link>

          <Link to="/shop" className="block text-center text-sm text-neutral-500 hover:text-black">
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </div>
  );
}
