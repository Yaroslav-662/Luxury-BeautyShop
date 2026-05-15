// src/features/users/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { OrdersApi } from "@/features/orders/api/orders.api";
import type { Order } from "@/features/orders/model/order.types";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: "Очікує",      color: "bg-yellow-500/20 text-yellow-300" },
  paid:       { label: "Оплачено",    color: "bg-blue-500/20 text-blue-300" },
  processing: { label: "Обробляється", color: "bg-purple-500/20 text-purple-300" },
  shipped:    { label: "Відправлено", color: "bg-indigo-500/20 text-indigo-300" },
  delivered:  { label: "Доставлено",  color: "bg-green-500/20 text-green-300" },
  cancelled:  { label: "Скасовано",   color: "bg-red-500/20 text-red-300" },
};

type Tab = "profile" | "orders" | "security";

export const ProfilePage: React.FC = () => {
  const {
    me, fetchMe, updateProfile, changePassword,
    deactivate, sendVerifyEmail, loading, error, success,
  } = useUserProfile();

  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  useEffect(() => {
    if (me) {
      setName(me.name || "");
      setEmail(me.email || "");
    }
  }, [me]);

  useEffect(() => {
    if (tab === "orders") {
      setOrdersLoading(true);
      OrdersApi.getOrders()
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, file });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    if (newPassword !== confirmPassword) return setPassError("Паролі не збігаються");
    if (newPassword.length < 6) return setPassError("Мінімум 6 символів");
    await changePassword({ oldPassword, newPassword });
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  if (!me) return <p className="text-neutral-400 p-6">Завантаження профілю...</p>;

  const TABS: { key: Tab; label: string }[] = [
    { key: "profile", label: "Профіль" },
    { key: "orders",  label: "Мої замовлення" },
    { key: "security", label: "Безпека" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Мій акаунт</h1>

      {/* Avatar + name */}
      <div className="flex items-center gap-4 bg-neutral-900/70 border border-neutral-800 rounded-xl p-5">
        <img
          src={(me as any).avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(me.name || "User")}&background=random`}
          className="w-16 h-16 rounded-full object-cover border border-neutral-700"
          alt="Avatar"
        />
        <div>
          <p className="font-semibold text-lg">{me.name}</p>
          <p className="text-sm text-neutral-400">{me.email}</p>
          <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
            (me as any).role === "admin"
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-neutral-700 text-neutral-300"
          }`}>
            {(me as any).role === "admin" ? "Адміністратор" : "Користувач"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
          {loading && <p className="text-xs text-neutral-400">Збереження...</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}

          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Ім'я</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Аватар</label>
            <input
              type="file"
              accept="image/*"
              className="text-xs text-neutral-300"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Зберегти зміни</Button>
            <Button type="button" variant="secondary" onClick={sendVerifyEmail}>
              Підтвердити email
            </Button>
          </div>
        </form>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === "orders" && (
        <div className="space-y-4">
          {ordersLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-neutral-900 rounded-xl h-20 animate-pulse" />
              ))}
            </div>
          )}

          {!ordersLoading && orders.length === 0 && (
            <div className="text-center py-12 bg-neutral-900/70 border border-neutral-800 rounded-xl">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-neutral-400">У вас ще немає замовлень</p>
            </div>
          )}

          {!ordersLoading && orders.map((order) => {
            const status = STATUS_LABELS[order.status] || { label: order.status, color: "bg-neutral-700 text-neutral-300" };
            return (
              <div
                key={order._id}
                className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Замовлення #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {order.address && (
                  <p className="text-xs text-neutral-400">
                    📍 {order.address}
                  </p>
                )}

                {order.paymentMethod && (
                  <p className="text-xs text-neutral-400">
                    💳 {order.paymentMethod === "card" ? "Картка онлайн"
                      : order.paymentMethod === "monobank" ? "Monobank"
                      : order.paymentMethod === "cash" ? "Накладений платіж"
                      : order.paymentMethod}
                  </p>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
                  <p className="text-xs text-neutral-400">
                    {order.items?.length || 0} товар{
                      (order.items?.length || 0) === 1 ? "" :
                      (order.items?.length || 0) < 5 ? "и" : "ів"
                    }
                  </p>
                  <p className="font-bold text-yellow-400">{order.total?.toFixed(2)} ₴</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {tab === "security" && (
        <div className="space-y-5">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold">Зміна пароля</h2>

            {passError && <p className="text-xs text-red-400">{passError}</p>}
            {success && <p className="text-xs text-emerald-400">{success}</p>}

            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Поточний пароль</label>
              <input
                type="password"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Новий пароль</label>
              <input
                type="password"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Підтвердіть пароль</label>
              <input
                type="password"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit">Змінити пароль</Button>
          </form>

          <div className="bg-neutral-900/70 border border-red-900/50 rounded-xl p-6 space-y-3">
            <h2 className="font-semibold text-red-400">Небезпечна зона</h2>
            <p className="text-xs text-neutral-400">
              Деактивація акаунту призупинить доступ до всіх функцій.
            </p>
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm("Ви впевнені, що хочете деактивувати акаунт?")) {
                  deactivate();
                }
              }}
            >
              Деактивувати акаунт
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
