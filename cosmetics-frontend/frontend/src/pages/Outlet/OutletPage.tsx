import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Select from "@/shared/ui/Select";
import Input from "@/shared/ui/Input";
import type { Product } from "@/features/products/model/product.types";

export default function OutletPage() {
  const { items, loading, fetchProducts } = useProducts();
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(500); // поріг для outlet
  const [sort, setSort] = useState<"priceAsc" | "priceDesc">("priceAsc");

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const base = items.filter((p: any) => {
      const hay = `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase();
      const matchQ = !qq || hay.includes(qq);
      const matchPrice = (p.price ?? 0) <= maxPrice;
      return matchQ && matchPrice;
    });

    const sorted = [...base].sort((a: any, b: any) =>
      sort === "priceAsc"
        ? (a.price ?? 0) - (b.price ?? 0)
        : (b.price ?? 0) - (a.price ?? 0)
    );

    return sorted as Product[];
  }, [items, q, maxPrice, sort]);

  return (
    <>
      <MetaTags title="Outlet" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold-300">Outlet</h1>
        <p className="text-sm text-neutral-400">
          Швидкі пропозиції за ціною до {maxPrice} ₴.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
        <div className="md:col-span-6">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Пошук в Outlet..." />
        </div>

        <div className="md:col-span-3">
          <Select value={String(maxPrice)} onChange={(e) => setMaxPrice(Number(e.target.value))}>
            {[200, 300, 500, 800, 1000, 1500].map((v) => (
              <option key={v} value={v}>До {v} ₴</option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="priceAsc">Ціна ↑</option>
            <option value="priceDesc">Ціна ↓</option>
          </Select>
        </div>
      </div>

      {loading && <div className="text-neutral-400">Завантаження…</div>}

      {!loading && filtered.length === 0 ? (
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6 text-neutral-300">
          Немає товарів під цей фільтр.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </>
  );
}
