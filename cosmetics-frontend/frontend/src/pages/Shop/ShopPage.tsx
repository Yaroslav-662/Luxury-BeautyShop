// src/pages/Shop/ShopPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Pagination from "@/shared/ui/Pagination";
import type { Product } from "@/features/products/model/product.types";
import type { Category } from "@/features/categories/model/category.types";

const PAGE_SIZE = 12;

type Sort = "" | "newest" | "price-asc" | "price-desc";

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [category, setCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<Sort>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const { items: products, loading, fetchProducts } = useProducts();
  const { items: categories, fetchCategories } = useCategories();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounce пошуку
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => {
      const matchQ = !debouncedQ ||
        p.name.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedQ.toLowerCase());

      const catId = typeof p.category === "object"
        ? (p.category as any)?._id
        : p.category;
      const matchCat = !category || catId === category;

      const matchFrom = !priceFrom || p.price >= Number(priceFrom);
      const matchTo = !priceTo || p.price <= Number(priceTo);
      const matchStock = !inStock || p.stock > 0;

      return matchQ && matchCat && matchFrom && matchTo && matchStock;
    });

    if (sort === "newest") result = [...result].reverse();
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [products, debouncedQ, category, priceFrom, priceTo, inStock, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = q || category || priceFrom || priceTo || inStock || sort;

  function resetFilters() {
    setQ(""); setDebouncedQ(""); setCategory("");
    setPriceFrom(""); setPriceTo(""); setInStock(false);
    setSort(""); setPage(1);
  }

  const Sidebar = () => (
    <aside className="space-y-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-gold-200">Фільтри</h2>
        {hasFilters && (
          <button onClick={resetFilters} className="text-xs text-neutral-400 hover:text-gold-300 transition">
            Скинути
          </button>
        )}
      </div>

      {/* Пошук */}
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Пошук</label>
        <input
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          placeholder="Назва або опис"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Категорія */}
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Категорія</label>
        <select
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">Всі категорії</option>
          {categories.map((c: Category) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Ціна */}
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Ціна (₴)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="Від"
            value={priceFrom}
            onChange={(e) => { setPriceFrom(e.target.value); setPage(1); }}
          />
          <input
            type="number"
            min="0"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="До"
            value={priceTo}
            onChange={(e) => { setPriceTo(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* В наявності */}
      <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
        <input
          type="checkbox"
          className="accent-yellow-500"
          checked={inStock}
          onChange={(e) => { setInStock(e.target.checked); setPage(1); }}
        />
        Тільки в наявності
      </label>

      {/* Сортування */}
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Сортування</label>
        <select
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
          value={sort}
          onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }}
        >
          <option value="">За замовчуванням</option>
          <option value="newest">Нові</option>
          <option value="price-asc">Ціна ↑</option>
          <option value="price-desc">Ціна ↓</option>
        </select>
      </div>
    </aside>
  );

  return (
    <>
      <MetaTags title="Каталог косметики" />

      <section className="space-y-6">
        {/* HEADER */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gold-300">Каталог</h1>
            <p className="text-neutral-400 text-sm mt-1">
              {loading ? "Завантаження..." : `Знайдено: ${filteredProducts.length} товарів`}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="lg:hidden border border-neutral-700 rounded-lg px-4 py-2 text-sm text-neutral-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Сховати фільтри" : "Фільтри"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* SIDEBAR desktop */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* SIDEBAR mobile */}
          {sidebarOpen && (
            <div className="lg:hidden">
              <Sidebar />
            </div>
          )}

          {/* GRID */}
          <div className="space-y-6">
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-neutral-900 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && visibleProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-neutral-400">Нічого не знайдено.</p>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 text-sm text-yellow-500 hover:underline"
                  >
                    Скинути фільтри
                  </button>
                )}
              </div>
            )}

            {!loading && visibleProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleProducts.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
