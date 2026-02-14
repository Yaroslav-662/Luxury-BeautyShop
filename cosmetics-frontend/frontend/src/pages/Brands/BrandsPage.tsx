import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Input from "@/shared/ui/Input";
import type { Product } from "@/features/products/model/product.types";

function getBrand(p: any) {
  if (p.brand) return String(p.brand);
  const name = String(p.name ?? "").trim();
  return name ? name.split(" ")[0] : "Unknown";
}

export default function BrandsPage() {
  const { items, loading, fetchProducts } = useProducts();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("");

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const brands = useMemo(() => {
    const map = new Map<string, Product[]>();
    items.forEach((p: any) => {
      const b = getBrand(p);
      map.set(b, [...(map.get(b) || []), p]);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, products]) => ({ name, products }));
  }, [items]);

  const filteredBrands = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(qq));
  }, [brands, q]);

  const current = active
    ? brands.find((b) => b.name === active)
    : filteredBrands[0];

  useEffect(() => {
    if (!active && filteredBrands.length) setActive(filteredBrands[0].name);
  }, [active, filteredBrands]);

  return (
    <>
      <MetaTags title="Brands" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold-300">Brands</h1>
        <p className="text-sm text-neutral-400">Бренди сформовані на основі каталогу товарів.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Пошук бренду..." />

          <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-3 max-h-[520px] overflow-auto">
            {loading && <div className="text-neutral-400 p-2">Завантаження…</div>}
            {!loading && filteredBrands.map((b) => (
              <button
                key={b.name}
                onClick={() => setActive(b.name)}
                className={
                  "w-full text-left px-3 py-2 rounded-xl text-sm border " +
                  (active === b.name
                    ? "bg-white/10 border-white/10 text-white"
                    : "bg-transparent border-transparent text-neutral-300 hover:text-white hover:bg-white/5")
                }
              >
                {b.name} <span className="text-neutral-500">({b.products.length})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          {!current ? (
            <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6 text-neutral-300">
              Немає брендів.
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gold-200">{current.name}</h2>
                  <div className="text-sm text-neutral-400">{current.products.length} товар(ів)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {current.products.map((p: any) => <ProductCard key={p._id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
