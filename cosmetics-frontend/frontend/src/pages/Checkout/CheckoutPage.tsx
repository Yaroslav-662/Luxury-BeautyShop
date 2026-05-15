// src/pages/Checkout/CheckoutPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { OrdersApi } from "@/features/orders/api/orders.api";
import { resolveImage } from "@/shared/lib/resolveImage";

type Shipping = "pickup" | "delivery";
type Payment = "card" | "cash" | "monobank";

const SHIPPING_PRICE: Record<Shipping, number> = {
  pickup: 0,
  delivery: 99,
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, total, clear } = useCartStore();

  const [form, setForm] = useState({
    firstName: (user as any)?.name?.split(" ")[0] || "",
    lastName: (user as any)?.name?.split(" ")[1] || "",
    email: (user as any)?.email || "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  });

  const [shipping, setShipping] = useState<Shipping>("delivery");
  const [payment, setPayment] = useState<Payment>("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const shippingPrice = SHIPPING_PRICE[shipping];
  const grandTotal = total + shippingPrice;

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return setError("Кошик порожній");
    if (!form.phone) return setError("Введіть номер телефону");
    if (shipping === "delivery" && !form.address)
      return setError("Введіть адресу доставки");

    setError(null);
    setSubmitting(true);

    try {
      const address = shipping === "pickup"
        ? `Самовивіз, ${form.city}`
        : `${form.city}, ${form.address}`;

      await OrdersApi.createOrder({
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        address: `${form.firstName} ${form.lastName}, ${form.phone}, ${address}`,
        paymentMethod: payment,
      });

      clear();
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Помилка при оформленні замовлення");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Успішне замовлення ────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Замовлення оформлено!</h1>
        <p className="text-neutral-400 mb-6">
          Дякуємо за покупку. Ми зв'яжемось з вами найближчим часом.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/shop"
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition"
          >
            Продовжити покупки
          </Link>
          {user && (
            <Link
              to="/account"
              className="border px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-50 transition"
            >
              Мої замовлення
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/cart" className="text-sm text-neutral-500 hover:text-black flex items-center gap-1">
          ← Back to Cart
        </Link>
        <span className="text-sm text-neutral-500">ⓘ Customer Support</span>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-2">Checkout</h1>
      <p className="text-center text-neutral-500 text-sm mb-10">
        Shipping charges and discount codes applied at checkout.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* CUSTOMER */}
            <section className="border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-base">Покупець</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Ім'я *</label>
                  <input
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.firstName}
                    onChange={set("firstName")}
                    placeholder="Іван"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Прізвище *</label>
                  <input
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.lastName}
                    onChange={set("lastName")}
                    placeholder="Петренко"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Телефон *</label>
                  <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-500 block mb-1">Місто *</label>
                <input
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Київ"
                />
              </div>
            </section>

            {/* SHIPPING */}
            <section className="border rounded-xl p-6 space-y-3">
              <h2 className="font-semibold text-base">Доставка</h2>

              <label className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${shipping === "delivery" ? "border-black bg-neutral-50" : "hover:bg-neutral-50"}`}>
                <input
                  type="radio"
                  className="mt-0.5"
                  checked={shipping === "delivery"}
                  onChange={() => setShipping("delivery")}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Доставка Новою поштою</div>
                  <div className="text-xs text-neutral-500">3–5 робочих днів</div>
                </div>
                <span className="font-semibold text-sm">99 ₴</span>
              </label>

              <label className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${shipping === "pickup" ? "border-black bg-neutral-50" : "hover:bg-neutral-50"}`}>
                <input
                  type="radio"
                  className="mt-0.5"
                  checked={shipping === "pickup"}
                  onChange={() => setShipping("pickup")}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Самовивіз</div>
                  <div className="text-xs text-neutral-500">Узгодити адресу після замовлення</div>
                </div>
                <span className="font-semibold text-sm text-green-600">Безкоштовно</span>
              </label>

              {shipping === "delivery" && (
                <div className="mt-2">
                  <label className="text-xs text-neutral-500 block mb-1">Адреса / відділення НП *</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.address}
                    onChange={set("address")}
                    placeholder="вул. Хрещатик 1, відділення №5"
                  />
                </div>
              )}
            </section>

            {/* PAYMENT */}
            <section className="border rounded-xl p-6 space-y-3">
              <h2 className="font-semibold text-base">Оплата</h2>

              <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${payment === "card" ? "border-black bg-neutral-50" : "hover:bg-neutral-50"}`}>
                <input
                  type="radio"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Картка онлайн</div>
                  <div className="text-xs text-neutral-500">Visa / Mastercard</div>
                </div>
                <div className="flex gap-1">
                  <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded font-bold">VISA</span>
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">MC</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${payment === "monobank" ? "border-black bg-neutral-50" : "hover:bg-neutral-50"}`}>
                <input
                  type="radio"
                  checked={payment === "monobank"}
                  onChange={() => setPayment("monobank")}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Monobank / Apple Pay / Google Pay</div>
                  <div className="text-xs text-neutral-500">Швидка оплата</div>
                </div>
                <span className="text-lg">🟡</span>
              </label>

              <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${payment === "cash" ? "border-black bg-neutral-50" : "hover:bg-neutral-50"}`}>
                <input
                  type="radio"
                  checked={payment === "cash"}
                  onChange={() => setPayment("cash")}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Накладений платіж</div>
                  <div className="text-xs text-neutral-500">Оплата при отриманні (+20 ₴ комісія НП)</div>
                </div>
                <span className="text-lg">💵</span>
              </label>
            </section>

            {/* COMMENT */}
            <section className="border rounded-xl p-6">
              <label className="text-xs text-neutral-500 block mb-1">Коментар до замовлення</label>
              <textarea
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                value={form.comment}
                onChange={set("comment")}
                placeholder="Побажання щодо доставки, пакування тощо"
              />
            </section>
          </div>

          {/* RIGHT — Summary */}
          <aside className="space-y-4">
            <div className="border rounded-xl p-6 space-y-4 sticky top-6">
              <h2 className="font-semibold text-base">Summary</h2>

              {/* Товари */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <img
                      src={resolveImage(item.image)}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-neutral-100 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/48x48?text=?";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight line-clamp-1">{item.name}</p>
                      <p className="text-xs text-neutral-500">× {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold shrink-0">
                      {(item.price * item.quantity).toFixed(2)} ₴
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Товари</span>
                  <span>{total.toFixed(2)} ₴</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Доставка</span>
                  <span>{shippingPrice === 0 ? "Безкоштовно" : `${shippingPrice} ₴`}</span>
                </div>
                {payment === "cash" && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Комісія НП</span>
                    <span>20 ₴</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{(grandTotal + (payment === "cash" ? 20 : 0)).toFixed(2)} ₴</span>
              </div>

              {error && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Оформлення..." : "COMPLETE PURCHASE"}
              </button>

              <p className="text-xs text-neutral-400 text-center">
                Натискаючи кнопку, ви погоджуєтесь з{" "}
                <Link to="/terms" className="underline hover:text-black">
                  умовами використання
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
