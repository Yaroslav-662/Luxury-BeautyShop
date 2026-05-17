// src/pages/Shop/ShopPage.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Pagination from "@/shared/ui/Pagination";
import type { Product } from "@/features/products/model/product.types";
import type { Category } from "@/features/categories/model/category.types";

const PAGE_SIZE = 12;
type Sort = "" | "newest" | "price-asc" | "price-desc";

// ─── Sidebar винесений ЗА МЕЖІ ShopPage ─────────────────────────────────────
// Це критично — якщо Sidebar всередині ShopPage, React перестворює його
// при кожному ререндері і input втрачає фокус після кожної букви
interface SidebarProps {
  q: string;
  setQ: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  priceFrom: string;
  setPriceFrom: (v: string) => void;
  priceTo: string;
  setPriceTo: (v: string) => void;
  inStock: boolean;
  setInStock: (v: boolean) => void;
  sort: Sort;
  setSort: (v: Sort) => void;
  categories: Category[];
  hasFilters: boolean;
  onReset: () => void;
  count: number;
}

const ShopSidebar: React.FC<SidebarProps> = ({
  q, setQ, category, setCategory,
  priceFrom, setPriceFrom, priceTo, setPriceTo,
  inStock, setInStock, sort, setSort,
  categories, hasFilters, onReset, count,
}) => (
  <aside className="space-y-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
    <div className="flex justify-between items-center">
      <h2 className="text-base font-semibold text-gold-200">Фільтри</h2>
      {hasFilters && (
        <button onClick={onReset} className="text-xs text-neutral-400 hover:text-gold-300 transition">
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
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Всі категорії</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
    </div>

    {/* Ціна */}
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wide text-neutral-400">Ціна (₴)</label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number" min="0"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          placeholder="Від"
          value={priceFrom}
          onChange={(e) => setPriceFrom(e.target.value)}
        />
        <input
          type="number" min="0"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          placeholder="До"
          value={priceTo}
          onChange={(e) => setPriceTo(e.target.value)}
        />
      </div>
    </div>

    {/* В наявності */}
    <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
      <input
        type="checkbox"
        className="accent-yellow-500"
        checked={inStock}
        onChange={(e) => setInStock(e.target.checked)}
      />
      Тільки в наявності
    </label>

    {/* Знижки */}
    <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
      <input
        type="checkbox"
        className="accent-yellow-500"
        checked={sort === "price-asc"}
        onChange={(e) => setSort(e.target.checked ? "price-asc" : "")}
      />
      Тільки зі знижкою
    </label>

    {/* Сортування */}
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wide text-neutral-400">Сортування</label>
      <select
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
      >
        <option value="">За замовчуванням</option>
        <option value="newest">Нові</option>
        <option value="price-asc">Ціна ↑</option>
        <option value="price-desc">Ціна ↓</option>
        <option value="discount">Зі знижкою</option>
      </select>
    </div>

    <div className="text-xs text-neutral-500 pt-1">
      Знайдено: <span className="text-white">{count}</span>
    </div>
  </aside>
);

// ─── ShopPage ────────────────────────────────────────────────────────────────
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

  // Debounce пошуку — не викликає ререндер на кожну букву
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

      const effectivePrice = (p as any).discountPrice ?? p.price;
      const matchFrom = !priceFrom || effectivePrice >= Number(priceFrom);
      const matchTo = !priceTo || effectivePrice <= Number(priceTo);
      const matchStock = !inStock || p.stock > 0;
      const matchDiscount = sort !== "discount" || !!(p as any).discount;

      return matchQ && matchCat && matchFrom && matchTo && matchStock && matchDiscount;
    });

    if (sort === "newest") result = [...result].reverse();
    if (sort === "price-asc") result = [...result].sort((a, b) => {
      const aP = (a as any).discountPrice ?? a.price;
      const bP = (b as any).discountPrice ?? b.price;
      return aP - bP;
    });
    if (sort === "price-desc") result = [...result].sort((a, b) => {
      const aP = (a as any).discountPrice ?? a.price;
      const bP = (b as any).discountPrice ?? b.price;
      return bP - aP;
    });
    if (sort === "discount") result = result.filter((p) => !!(p as any).discount);

    return result;
  }, [products, debouncedQ, category, priceFrom, priceTo, inStock, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!(q || category || priceFrom || priceTo || inStock || sort);

  const resetFilters = useCallback(() => {
    setQ(""); setDebouncedQ(""); setCategory("");
    setPriceFrom(""); setPriceTo(""); setInStock(false);
    setSort(""); setPage(1);
  }, []);

  const sidebarProps: SidebarProps = {
    q, setQ, category, setCategory,
    priceFrom, setPriceFrom, priceTo, setPriceTo,
    inStock, setInStock, sort, setSort,
    categories, hasFilters, onReset: resetFilters,
    count: filteredProducts.length,
  };

  return (
    <>
      <MetaTags title="Каталог косметики" />

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gold-300">Каталог</h1>
            <p className="text-neutral-400 text-sm mt-1">
              {loading ? "Завантаження..." : `Знайдено: ${filteredProducts.length} товарів`}
            </p>
          </div>
          <button
            className="lg:hidden border border-neutral-700 rounded-lg px-4 py-2 text-sm text-neutral-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Сховати фільтри" : "⚙ Фільтри"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <ShopSidebar {...sidebarProps} />
          </div>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="lg:hidden">
              <ShopSidebar {...sidebarProps} />
            </div>
          )}

          {/* Grid */}
          <div className="space-y-6">
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-neutral-900 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && visibleProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-neutral-400">Нічого не знайдено.</p>
                {hasFilters && (
                  <button onClick={resetFilters} className="mt-3 text-sm text-yellow-500 hover:underline">
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
