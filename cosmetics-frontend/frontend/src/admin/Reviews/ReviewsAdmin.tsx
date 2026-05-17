// src/admin/Reviews/ReviewsAdmin.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { AdminShell } from "@/admin/_ui/AdminShell";
import {
  adminDeleteReview,
  adminGetProducts,
  adminGetReviews,
  type ProductDTO,
  type ReviewDTO,
} from "@/admin/api/admin.api";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {"★".repeat(Math.min(5, Math.max(0, rating)))}
      <span className="text-neutral-700">{"★".repeat(5 - Math.min(5, Math.max(0, rating)))}</span>
    </span>
  );
}

function authorLabel(r: ReviewDTO): string {
  if (typeof r.user === "string") return r.user.slice(-8);
  return r.user?.email || r.user?.name || (r.user as any)?._id?.slice?.(-6) || "—";
}

function productLabel(r: ReviewDTO, map: Map<string, string>): string {
  if (typeof r.product === "string") return map.get(r.product) || r.product.slice(-8);
  return (r.product as any)?.name || "—";
}

export default function ReviewsAdmin() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [productFilter, setProductFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ReviewDTO[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        adminGetProducts({ page: 1, q: "" }),
        adminGetReviews(productFilter ? { product: productFilter } : undefined),
      ]);
      setProducts(p.products);
      setItems(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [productFilter]);

  const productsMap = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((x) => m.set(x._id, x.name));
    return m;
  }, [products]);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchRating = !ratingFilter || r.rating === Number(ratingFilter);
      const matchQ = !searchQ ||
        (r.comment || "").toLowerCase().includes(searchQ.toLowerCase()) ||
        authorLabel(r).toLowerCase().includes(searchQ.toLowerCase());
      return matchRating && matchQ;
    });
  }, [items, ratingFilter, searchQ]);

  async function onDelete(id: string) {
    if (!window.confirm("Видалити відгук? Цю дію неможливо скасувати.")) return;
    setDeleting(id);
    try {
      await adminDeleteReview(id);
      setItems((prev) => prev.filter((r) => r._id !== id));
    } finally {
      setDeleting(null);
    }
  }

  // Статистика
  const avgRating = items.length
    ? (items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1)
    : "—";

  const ratingCounts = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: items.filter((r) => r.rating === n).length,
  }));

  return (
    <>
      <MetaTags title="Admin — Відгуки" />
      <AdminShell
        title="Відгуки"
        subtitle={`Всього: ${items.length} · Середній рейтинг: ${avgRating} ★`}
        right={
          <button
            onClick={load}
            className="text-sm text-neutral-400 hover:text-white border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            🔄 Оновити
          </button>
        }
      >
        {/* Rating distribution */}
        {!loading && items.length > 0 && (
          <div className="flex gap-3 mb-5 flex-wrap">
            {ratingCounts.map(({ n, count }) => (
              <button
                key={n}
                onClick={() => setRatingFilter(ratingFilter === String(n) ? "" : String(n))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  ratingFilter === String(n)
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                    : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                }`}
              >
                <span className="text-yellow-400">{"★".repeat(n)}</span>
                <span className="text-xs">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 min-w-[200px]"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">Всі товари</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <input
            className="flex-1 min-w-[180px] bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="Пошук по тексту або автору..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />

          {(productFilter || ratingFilter || searchQ) && (
            <button
              onClick={() => { setProductFilter(""); setRatingFilter(""); setSearchQ(""); }}
              className="text-xs text-neutral-400 hover:text-white border border-neutral-700 px-3 py-2 rounded-lg transition-colors"
            >
              Скинути
            </button>
          )}

          <span className="text-xs text-neutral-500 self-center">
            {filtered.length} з {items.length}
          </span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-900 rounded-xl h-14 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="text-left py-3 font-medium">Товар</th>
                  <th className="text-left py-3 font-medium">Автор</th>
                  <th className="text-left py-3 font-medium">Рейтинг</th>
                  <th className="text-left py-3 font-medium">Коментар</th>
                  <th className="text-left py-3 font-medium">Дата</th>
                  <th className="text-right py-3 font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r._id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="py-3 text-white font-medium text-xs max-w-[140px]">
                      <span className="line-clamp-1" title={productLabel(r, productsMap)}>
                        {productLabel(r, productsMap)}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-400 text-xs">
                      {authorLabel(r)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-neutral-500">{r.rating}/5</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-300 text-xs max-w-[240px]">
                      <span className="line-clamp-2">{r.comment || "—"}</span>
                    </td>
                    <td className="py-3 text-neutral-500 text-xs whitespace-nowrap">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("uk-UA")
                        : "—"}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        disabled={deleting === r._id}
                        onClick={() => onDelete(r._id)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deleting === r._id ? "..." : "Видалити"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-neutral-500">
                      {items.length === 0 ? "Відгуків ще немає" : "Нічого не знайдено"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </>
  );
}
