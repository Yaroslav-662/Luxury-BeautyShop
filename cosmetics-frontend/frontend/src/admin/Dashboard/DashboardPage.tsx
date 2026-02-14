import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { AdminShell, AdminCard } from "@/admin/_ui/AdminShell";
import {
  adminGetCategories,
  adminGetOrders,
  adminGetProducts,
  adminGetReviews,
  adminGetUsers,
} from "@/admin/api/admin.api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    reviews: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [p, c, o, u, r] = await Promise.all([
          adminGetProducts({ page: 1, q: "" }),
          adminGetCategories(),
          adminGetOrders(),
          adminGetUsers({ page: 1, limit: 10 }),
          adminGetReviews(),
        ]);

        setStats({
          products: p?.total ?? p?.products?.length ?? 0,
          categories: c.length,
          orders: o.length,
          users: u?.total ?? u?.users?.length ?? 0,
          reviews: r.length,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <MetaTags title="Admin — Dashboard" />
      <AdminShell
        title="Dashboard"
        subtitle="Коротка статистика системи (підтягнуто з твоїх API)."
      >
        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <AdminCard title="Products" subtitle="GET /api/products">
              <div className="text-3xl font-bold text-white">{stats.products}</div>
            </AdminCard>
            <AdminCard title="Categories" subtitle="GET /api/categories">
              <div className="text-3xl font-bold text-white">{stats.categories}</div>
            </AdminCard>
            <AdminCard title="Orders" subtitle="GET /api/orders">
              <div className="text-3xl font-bold text-white">{stats.orders}</div>
            </AdminCard>
            <AdminCard title="Users" subtitle="GET /api/users">
              <div className="text-3xl font-bold text-white">{stats.users}</div>
            </AdminCard>
            <AdminCard title="Reviews" subtitle="GET /api/reviews">
              <div className="text-3xl font-bold text-white">{stats.reviews}</div>
            </AdminCard>
          </div>
        )}
      </AdminShell>
    </>
  );
}