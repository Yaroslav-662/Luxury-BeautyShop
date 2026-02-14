import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import type { Product } from "@/features/products/model/product.types";

const SALE_KEYWORDS = ["sale", "акція", "зниж", "discount", "promo"];

export default function SalePage() {
  const { items, loading, fetchProducts } = useProducts();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "priceAsc" | "priceDesc">("new");

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const avgPrice = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((s: number, p: any) => s + (p.price || 0), 0) / items.length;
  }, [items]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const base = items.filter((p: any) => {
      const hay = `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase();
      const kw = SALE_KEYWORDS.some((k) => hay.includes(k));
      const cheap = (p.price ?? 0) > 0 && (p.price ?? 0) <= avgPrice * 0.9;
      const matchQ = !qq || hay.includes(qq);
      return matchQ && (kw || cheap);
    });

    const sorted = [...base].sort((a: any, b: any) => {
      if (sort === "priceAsc") return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "priceDesc") return (b.price ?? 0) - (a.price ?? 0);
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

    return sorted as Product[];
  }, [items, q, sort, avgPrice]);

  return (
    <>
      <MetaTags title="SALE" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold-300">SALE</h1>
        <p className="text-sm text-neutral-400">
          Акційні пропозиції та товари зі зниженою ціною (за логікою каталогу).
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Пошук по Sale..."
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="new">Спочатку нові</option>
            <option value="priceAsc">Ціна ↑</option>
            <option value="priceDesc">Ціна ↓</option>
          </Select>
        </div>
      </div>

      {loading && <div className="text-neutral-400">Завантаження…</div>}

      {!loading && filtered.length === 0 ? (
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6 text-neutral-300">
          Нічого не знайдено у SALE.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </>
  );
}
