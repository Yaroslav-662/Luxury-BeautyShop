// src/pages/Shop/ShopPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Pagination from "@/shared/ui/Pagination";
import type { Product } from "@/features/products/model/product.types";
import type { Category } from "@/features/categories/model/category.types";

const PAGE_SIZE = 12;

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const { items: products, loading, fetchProducts } = useProducts();
  const { items: categories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🔍 ФІЛЬТРАЦІЯ (як у PDF)
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description?.toLowerCase().includes(q.toLowerCase());

      const matchCategory =
        !category || p.category === category;

      return matchQuery && matchCategory;
    });
  }, [products, q, category]);

  // 📄 ПАГІНАЦІЯ
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <>
      <MetaTags title="Каталог косметики" />

      <section className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gold-300">
            Каталог
          </h1>
          <p className="text-neutral-400 text-sm">
            Знайдено товарів: {filteredProducts.length}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* LEFT FILTERS */}
          <aside className="space-y-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-gold-200">
              Фільтри
            </h2>

            {/* SEARCH */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-neutral-400">
                Пошук
              </label>
              <Input
                placeholder="Назва або опис"
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-neutral-400">
                Категорія
              </label>
              <Select
                value={category}
                onChange={(e) => {
                  setPage(1);
                  setCategory(e.target.value);
                }}
              >
                <option value="">Всі категорії</option>
                {categories.map((c: Category) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* RESET */}
            {(q || category) && (
              <button
                onClick={() => {
                  setQ("");
                  setCategory("");
                  setPage(1);
                }}
                className="text-sm text-neutral-400 hover:text-gold-300 transition"
              >
                Скинути фільтри
              </button>
            )}
          </aside>

          {/* PRODUCTS GRID */}
          <div className="space-y-6">
            {loading && (
              <p className="text-neutral-400">Завантаження...</p>
            )}

            {!loading && visibleProducts.length === 0 && (
              <div className="text-neutral-400">
                Нічого не знайдено.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product: Product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
