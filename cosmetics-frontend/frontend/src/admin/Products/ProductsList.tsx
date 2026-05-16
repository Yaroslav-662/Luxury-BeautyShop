// src/admin/Products/ProductsList.tsx
import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "@/shared/ui/Pagination";
import { AdminShell } from "@/admin/_ui/AdminShell";
import {
  adminDeleteProduct,
  adminGetProducts,
  adminGetCategories,
  type ProductDTO,
  type CategoryDTO,
} from "@/admin/api/admin.api";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function ProductsList() {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || "1");
  const q = sp.get("q") || "";

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [data, setData] = useState<{
    total: number;
    totalPages: number;
    products: ProductDTO[];
  }>({ total: 0, totalPages: 1, products: [] });

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetProducts({ page, q });
      setData({ total: res.total, totalPages: res.totalPages, products: res.products });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    adminGetCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [page, q]);

  async function onDelete(id: string, name: string) {
    if (!window.confirm(`Видалити товар "${name}"?\n\nЦю дію неможливо скасувати.`)) return;
    setDeleting(id);
    try {
      await adminDeleteProduct(id);
      await load();
    } finally {
      setDeleting(null);
    }
  }

  // Клієнтська фільтрація по категорії
  const visibleProducts = categoryFilter
    ? data.products.filter((p) => {
        const catId = typeof p.category === "object" ? p.category?._id : p.category;
        return catId === categoryFilter;
      })
    : data.products;

  function StockBadge({ stock }: { stock?: number }) {
    const s = stock ?? 0;
    if (s === 0) return <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Немає</span>;
    if (s <= 5) return <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">{s} шт ⚠️</span>;
    return <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">{s} шт</span>;
  }

  return (
    <>
      <MetaTags title="Admin — Товари" />
      <AdminShell
        title="Товари"
        subtitle={`Всього: ${data.total}`}
        right={
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
          >
            + Додати товар
          </Link>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            className="flex-1 min-w-[200px] bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="Пошук за назвою або описом..."
            value={q}
            onChange={(e) => setSp({ page: "1", q: e.target.value })}
          />
          <select
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Всі категорії</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {(q || categoryFilter) && (
            <button
              onClick={() => { setSp({ page: "1", q: "" }); setCategoryFilter(""); }}
              className="text-xs text-neutral-400 hover:text-white border border-neutral-700 px-3 py-2 rounded-lg transition-colors"
            >
              Скинути
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-neutral-900 rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="text-left py-3 font-medium w-12"></th>
                  <th className="text-left py-3 font-medium">Назва</th>
                  <th className="text-left py-3 font-medium">Ціна</th>
                  <th className="text-left py-3 font-medium">Залишок</th>
                  <th className="text-left py-3 font-medium">Категорія</th>
                  <th className="text-right py-3 font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((p) => {
                  const image = p.images?.[0];
                  const catName = typeof p.category === "object"
                    ? p.category?.name
                    : categories.find((c) => c._id === p.category)?.name || "—";

                  return (
                    <tr key={p._id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                      {/* Фото */}
                      <td className="py-2 pr-2">
                        <img
                          src={image ? resolveImage(image) : "https://placehold.co/40x40?text=?"}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-neutral-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=?";
                          }}
                        />
                      </td>

                      {/* Назва */}
                      <td className="py-3">
                        <div className="font-medium text-white leading-tight line-clamp-1 max-w-[200px]">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-neutral-600 font-mono mt-0.5">
                          {p._id.slice(-8)}
                        </div>
                      </td>

                      {/* Ціна */}
                      <td className="py-3 text-yellow-400 font-semibold">
                        {p.price} ₴
                      </td>

                      {/* Залишок */}
                      <td className="py-3">
                        <StockBadge stock={p.stock} />
                      </td>

                      {/* Категорія */}
                      <td className="py-3 text-neutral-400 text-xs">
                        {catName}
                      </td>

                      {/* Дії */}
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/product/${p._id}`}
                            target="_blank"
                            className="text-xs text-neutral-400 hover:text-white border border-neutral-700 px-2.5 py-1.5 rounded-lg transition-colors"
                            title="Переглянути на сайті"
                          >
                            👁
                          </Link>
                          <Link
                            to={`/admin/products/${p._id}/edit`}
                            className="text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-lg transition-colors hover:bg-yellow-500/10"
                          >
                            Редагувати
                          </Link>
                          <button
                            onClick={() => onDelete(p._id, p.name)}
                            disabled={deleting === p._id}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {deleting === p._id ? "..." : "Видалити"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-neutral-500">
                      {data.total === 0 ? "Товарів ще немає" : "Нічого не знайдено"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onChange={(p) => setSp({ page: String(p), q })}
            />
          </div>
        )}
      </AdminShell>
    </>
  );
}
