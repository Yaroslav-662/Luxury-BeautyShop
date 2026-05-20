// src/pages/Cart/CartPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function CartPage() {
  const { items, total, remove, changeQty, clear } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 text-black bg-white min-h-screen">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <Link to="/shop" className="text-sm text-neutral-500 hover:text-black flex items-center gap-1 py-2">
          ← Назад до магазину
        </Link>
        <Link to="/support" className="text-sm text-neutral-500 hover:text-black py-2">
          ⓘ Підтримка
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-1">Кошик</h1>
      <p className="text-center text-neutral-500 text-sm mb-6 md:mb-10">
        Вартість доставки та промокоди застосовуються при оформленні.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-16 md:py-20">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-lg font-semibold text-neutral-700 mb-2">Кошик порожній</h2>
          <p className="text-neutral-500 text-sm mb-6">Додайте товари з каталогу</p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition"
          >
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 md:gap-10">
          {/* LEFT */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-base">
                Ваше замовлення ({items.length} {items.length === 1 ? "товар" : items.length < 5 ? "товари" : "товарів"})
              </h2>
              <button
                onClick={clear}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors py-2 px-2"
              >
                Очистити все
              </button>
            </div>

            <div className="border rounded-xl overflow-hidden divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 md:gap-4 p-3 md:p-4 items-start">
                  {/* Фото */}
                  <Link to={`/product/${item._id}`} className="shrink-0">
                    <img
                      src={resolveImage(item.image)}
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain bg-neutral-100 rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=?";
                      }}
                    />
                  </Link>

                  {/* Інфо */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`}>
                      <p className="font-medium text-sm hover:text-neutral-600 line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                    </Link>
                    <p className="text-sm text-neutral-600 font-semibold mt-1">{item.price} ₴ / шт.</p>

                    {/* Кількість — великі кнопки для мобільного */}
                    <div className="flex items-center gap-0 mt-2 border rounded-lg w-fit overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 ? changeQty(item._id, item.quantity - 1) : remove(item._id)}
                        className="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-neutral-100 transition-colors active:bg-neutral-200"
                        aria-label="Зменшити кількість"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-semibold select-none">{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item._id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-neutral-100 transition-colors active:bg-neutral-200"
                        aria-label="Збільшити кількість"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Сума + видалити */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <button
                      onClick={() => remove(item._id)}
                      className="text-neutral-300 hover:text-red-500 transition-colors p-1 -mr-1"
                      aria-label="Видалити товар"
                    >
                      🗑
                    </button>
                    <p className="font-bold text-sm">
                      {(item.price * item.quantity).toFixed(2)} ₴
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Переваги */}
            <div className="mt-6 border rounded-xl divide-y divide-neutral-100">
              {[
                { icon: "↩️", text: "Безкоштовне повернення протягом 30 днів" },
                { icon: "💳", text: "Зручні способи оплати" },
                { icon: "🚚", text: "Доставка додому або до відділення НП" },
              ].map((row) => (
                <div key={row.text} className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-600">
                  <span>{row.icon}</span>
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-3">
            <div className="border rounded-xl p-4 md:p-6 space-y-4 lg:sticky lg:top-24">
              <h2 className="font-semibold text-base">Підсумок</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Товари</span>
                  <span>{total.toFixed(2)} ₴</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Знижка</span>
                  <span>-0.00 ₴</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Доставка</span>
                  <span className="text-neutral-400">розраховується при оформленні</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Разом</span>
                <span>{total.toFixed(2)} ₴</span>
              </div>

              <Link to="/checkout" className="block">
                <button className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors tracking-wide">
                  Оформити замовлення →
                </button>
              </Link>

              <Link to="/shop" className="block text-center text-sm text-neutral-500 hover:text-black transition-colors py-1">
                Продовжити покупки
              </Link>
            </div>

            {/* Промокод */}
            <div className="border rounded-xl overflow-hidden">
              <details>
                <summary className="flex justify-between items-center px-4 py-3 text-sm font-medium cursor-pointer hover:bg-neutral-50 transition-colors list-none">
                  <span>🎁 Промокод / Подарункова картка</span>
                  <span className="text-neutral-400">›</span>
                </summary>
                <div className="px-4 pb-4 flex gap-2">
                  <input
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Введіть промокод"
                  />
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                    OK
                  </button>
                </div>
              </details>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
