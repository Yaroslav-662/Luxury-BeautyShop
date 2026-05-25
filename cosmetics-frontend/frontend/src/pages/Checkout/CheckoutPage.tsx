import React, { useState } from "react";
import { Link } from "react-router-dom";

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

  const [shipping, setShipping] =
    useState<Shipping>("delivery");

  const [payment, setPayment] =
    useState<Payment>("card");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const shippingPrice = SHIPPING_PRICE[shipping];

  const extraPaymentFee =
    payment === "cash" ? 20 : 0;

  const grandTotal =
    total + shippingPrice + extraPaymentFee;

  const set =
    (field: keyof typeof form) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (items.length === 0) {
      return setError("Кошик порожній");
    }

    if (!form.phone.trim()) {
      return setError("Введіть номер телефону");
    }

    if (!form.city.trim()) {
      return setError("Введіть місто");
    }

    if (
      shipping === "delivery" &&
      !form.address.trim()
    ) {
      return setError(
        "Введіть адресу доставки"
      );
    }

    setSubmitting(true);
    setError(null);

    try {
      const address =
        shipping === "pickup"
          ? `Самовивіз, ${form.city}`
          : `${form.city}, ${form.address}`;

      await OrdersApi.createOrder({
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        })),

        shippingAddress:
          `${form.firstName} ${form.lastName}, ` +
          `${form.phone}, ` +
          `${address}`,

        paymentMethod: payment,

        total: grandTotal,
      });

      clear();

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Помилка оформлення замовлення"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-5">
          ✅
        </div>

        <h1 className="text-3xl font-bold mb-3">
          Замовлення оформлено
        </h1>

        <p className="text-neutral-500 mb-8">
          Дякуємо за покупку. Наш менеджер
          скоро зв'яжеться з вами.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            to="/shop"
            className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition"
          >
            Продовжити покупки
          </Link>

          <Link
            to="/orders"
            className="border px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-50 transition"
          >
            Мої замовлення
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/cart"
          className="text-sm text-neutral-500 hover:text-black"
        >
          ← Назад до кошика
        </Link>

        <span className="text-sm text-neutral-500">
          ⓘ Підтримка клієнтів
        </span>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-2">
        Оформлення замовлення
      </h1>

      <p className="text-center text-neutral-500 text-sm mb-10">
        Вартість доставки та коди
        знижок застосовуються під час
        оформлення замовлення.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">
                Покупець
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="Ім'я"
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  required
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Прізвище"
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="Email"
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+380"
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <input
                required
                value={form.city}
                onChange={set("city")}
                placeholder="Місто"
                className="border rounded-xl px-4 py-3 w-full"
              />
            </section>

            <section className="border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">
                Доставка
              </h2>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  checked={
                    shipping === "delivery"
                  }
                  onChange={() =>
                    setShipping("delivery")
                  }
                />

                <div className="flex-1">
                  <div className="font-medium">
                    Нова пошта
                  </div>

                  <div className="text-sm text-neutral-500">
                    3–5 робочих днів
                  </div>
                </div>

                <div className="font-semibold">
                  99 ₴
                </div>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  checked={shipping === "pickup"}
                  onChange={() =>
                    setShipping("pickup")
                  }
                />

                <div className="flex-1">
                  <div className="font-medium">
                    Самовивіз
                  </div>

                  <div className="text-sm text-neutral-500">
                    Безкоштовно
                  </div>
                </div>
              </label>

              {shipping === "delivery" && (
                <input
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Адреса або відділення"
                  className="border rounded-xl px-4 py-3 w-full"
                />
              )}
            </section>

            <section className="border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">
                Оплата
              </h2>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "card"}
                  onChange={() =>
                    setPayment("card")
                  }
                />

                <span>
                  Картка онлайн
                </span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  checked={
                    payment === "monobank"
                  }
                  onChange={() =>
                    setPayment("monobank")
                  }
                />

                <span>
                  Monobank / Apple Pay /
                  Google Pay
                </span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "cash"}
                  onChange={() =>
                    setPayment("cash")
                  }
                />

                <span>
                  Накладений платіж
                </span>
              </label>
            </section>

            <section className="border rounded-2xl p-6">
              <textarea
                rows={4}
                value={form.comment}
                onChange={set("comment")}
                placeholder="Коментар до замовлення"
                className="border rounded-xl px-4 py-3 w-full resize-none"
              />
            </section>
          </div>

          <aside>
            <div className="border rounded-2xl p-6 sticky top-6">
              <h2 className="font-semibold text-lg mb-5">
                Короткий зміст
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3"
                  >
                    <img
                      src={resolveImage(
                        item.image
                      )}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-neutral-100"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-neutral-500">
                        × {item.quantity}
                      </p>
                    </div>

                    <div className="text-sm font-semibold">
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}{" "}
                      ₴
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-5 pt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    Товари
                  </span>

                  <span>
                    {total.toFixed(2)} ₴
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Доставка
                  </span>

                  <span>
                    {shippingPrice} ₴
                  </span>
                </div>

                {payment === "cash" && (
                  <div className="flex justify-between">
                    <span>
                      Комісія НП
                    </span>

                    <span>
                      20 ₴
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t mt-5 pt-5 flex justify-between font-bold text-lg">
                <span>Всього</span>

                <span>
                  {grandTotal.toFixed(2)} ₴
                </span>
              </div>

              {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  items.length === 0
                }
                className="w-full mt-5 bg-black text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {submitting
                  ? "Оформлення..."
                  : "ЗАВЕРШИТИ ПОКУПКУ"}
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
