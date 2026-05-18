// src/pages/Home/HomePage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductCard } from "@/features/products/ui/ProductCard";
import type { Product } from "@/features/products/model/product.types";

// ─── Горизонтальний скрол ────────────────────────────────────────────────────
function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null!);
  const scrollLeft = () => ref.current?.scrollBy({ left: -280, behavior: "smooth" });
  const scrollRight = () => ref.current?.scrollBy({ left: 280, behavior: "smooth" });
  return { ref, scrollLeft, scrollRight };
}

// ─── Карусель ────────────────────────────────────────────────────────────────
const Carousel: React.FC<{
  products: Product[];
  scrollRef: React.RefObject<HTMLDivElement>;
  onLeft: () => void;
  onRight: () => void;
}> = ({ products, scrollRef, onLeft, onRight }) => (
  <div className="relative">
    <button
      type="button" onClick={onLeft}
      className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow hover:bg-neutral-50"
      aria-label="Scroll left"
    >‹</button>
    <button
      type="button" onClick={onRight}
      className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow hover:bg-neutral-50"
      aria-label="Scroll right"
    >›</button>
    <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth pb-2 -mx-1 px-1 snap-x snap-mandatory">
      {products.map((p) => (
        <div key={p._id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] md:min-w-[220px] md:max-w-[220px] snap-start">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  </div>
);

// ─── RatingCard ───────────────────────────────────────────────────────────────
const RatingCard: React.FC<{ title: string; text: string; author: string }> = ({ title, text, author }) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
    <span className="text-sm text-yellow-400">★★★★★</span>
    <div className="mt-2 font-semibold text-neutral-900 text-sm">{title}</div>
    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{text}</p>
    <div className="mt-2 text-xs text-neutral-400">{author}</div>
  </div>
);

// ─── PromoBanner ─────────────────────────────────────────────────────────────
const PromoBanner: React.FC<{
  label: string;
  percent: string;
  text: string;
  to: string;
  btnLabel: string;
  image?: string;
  dark?: boolean;
}> = ({ label, percent, text, to, btnLabel, image, dark }) => (
  <div className={`rounded-2xl md:rounded-3xl p-6 md:p-8 flex items-center justify-between gap-4 ${dark ? "bg-neutral-900 text-white" : "bg-neutral-100 border border-neutral-200 text-neutral-900"}`}>
    <div className="flex-1 min-w-0">
      <div className={`text-xs uppercase tracking-widest ${dark ? "text-neutral-400" : "text-neutral-500"}`}>{label}</div>
      <div className={`text-4xl md:text-5xl font-extrabold mt-1 ${dark ? "text-yellow-400" : "text-neutral-900"}`}>{percent}</div>
      <div className={`mt-1 text-sm ${dark ? "text-neutral-400" : "text-neutral-600"}`}>{text}</div>
      <Link to={to} className={`inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
        ${dark ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-neutral-900 text-white hover:bg-neutral-700"}`}>
        {btnLabel}
      </Link>
    </div>
    {image ? (
      <img src={image} alt="" className="hidden md:block h-24 w-36 object-cover rounded-2xl shrink-0" />
    ) : (
      <div className={`hidden md:flex h-24 w-36 rounded-2xl items-center justify-center text-xs shrink-0 ${dark ? "bg-neutral-800 text-neutral-600" : "bg-white/60 border border-neutral-200 text-neutral-400"}`}>
        Банер
      </div>
    )}
  </div>
);

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const { items, loading, fetchProducts } = useProducts();
  const { items: categories, fetchCategories } = useCategories();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Нові товари — останні 10
  const newProducts = useMemo(() => [...items].slice(0, 10), [items]);

  // Товари зі знижкою
  const saleProducts = useMemo(() =>
    items.filter((p) => (p as any).discount > 0).slice(0, 10),
    [items]
  );

  // Показуємо або sale або всі
  const highlights = saleProducts.length > 0 ? saleProducts : newProducts;

  const newScroll = useHorizontalScroll();
  const hiScroll = useHorizontalScroll();

  // Максимальна знижка для банера
  const maxDiscount = useMemo(() => {
    if (!items.length) return 50;
    const max = Math.max(...items.map((p) => (p as any).discount || 0));
    return max > 0 ? max : 50;
  }, [items]);

  const quickTiles = [
    { title: "✨ Новинки",    to: "/shop",           emoji: "✨" },
    { title: "🔥 Sale",       to: "/shop?sort=discount", emoji: "🔥" },
    { title: "💄 Макіяж",     to: categories[0] ? `/shop?category=${categories[0]._id}` : "/shop", emoji: "💄" },
    { title: "🛍️ Каталог",   to: "/shop",           emoji: "🛍️" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <MetaTags title="Головна | Luxury BeautyShop" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pt-8 md:pt-12 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl md:rounded-3xl bg-neutral-900 px-6 py-10 md:px-12 md:py-16 text-center relative overflow-hidden">
            {/* Декоративний градієнт */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />

            <p className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Преміальна косметика</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Твій beauty shop
            </h1>
            <p className="mt-3 text-neutral-400 text-sm md:text-base max-w-xl mx-auto">
              Догляд, макіяж і бренди. Зручний каталог, швидке замовлення.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/shop"
                className="bg-yellow-400 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors"
              >
                Перейти в каталог
              </Link>
              <Link
                to="/shop?sort=discount"
                className="border border-neutral-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:border-neutral-400 transition-colors"
              >
                🔥 Sale до -{maxDiscount}%
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 TILES ──────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickTiles.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              className="rounded-xl md:rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors p-4 md:p-6 flex items-center justify-center text-sm font-semibold text-neutral-700 text-center"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW PRODUCTS ─────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-900">Нові товари!</h2>
            <Link to="/shop" className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900">
              Всі товари →
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-hidden">
              {[1,2,3,4].map((i) => (
                <div key={i} className="min-w-[160px] sm:min-w-[200px] h-64 bg-neutral-100 rounded-xl animate-pulse shrink-0" />
              ))}
            </div>
          ) : newProducts.length === 0 ? (
            <p className="text-neutral-500 text-sm">Наразі немає доступних товарів.</p>
          ) : (
            <Carousel products={newProducts} scrollRef={newScroll.ref} onLeft={newScroll.scrollLeft} onRight={newScroll.scrollRight} />
          )}
        </div>
      </section>

      {/* ── PROMO BOX (великий) ───────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto">
          <PromoBanner
            label="До"
            percent={`${maxDiscount}%`}
            text="знижка на товари зі знижкою"
            to="/shop?sort=discount"
            btnLabel="Shop now"
            dark
          />
        </div>
      </section>

      {/* ── CATEGORY HIGHLIGHTS ──────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-900">
              {saleProducts.length > 0 ? "🔥 Товари зі знижкою" : "Категорії"}
            </h2>
            <Link to="/shop" className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900">
              Всі товари →
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-hidden">
              {[1,2,3,4].map((i) => (
                <div key={i} className="min-w-[160px] sm:min-w-[200px] h-64 bg-neutral-100 rounded-xl animate-pulse shrink-0" />
              ))}
            </div>
          ) : highlights.length === 0 ? (
            <p className="text-neutral-500 text-sm">Немає товарів.</p>
          ) : (
            <Carousel products={highlights} scrollRef={hiScroll.ref} onLeft={hiScroll.scrollLeft} onRight={hiScroll.scrollRight} />
          )}
        </div>
      </section>

      {/* ── 2 PROMO CARDS ────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <PromoBanner
            label="До"
            percent="25%"
            text="знижка на обрані категорії"
            to="/shop?sort=discount"
            btnLabel="Shop now"
          />
          <PromoBanner
            label="До"
            percent="50%"
            text="знижка на outlet товари"
            to="/shop?sort=discount"
            btnLabel="Browse products"
          />
        </div>
      </section>

      {/* ── CATEGORIES GRID ──────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="px-4 md:px-8 mt-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-900 mb-4">Категорії</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c._id}
                  to={`/shop?category=${c._id}`}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors p-4 text-center text-sm font-medium text-neutral-700"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER + REVIEWS ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-10 pb-12">
        <div className="max-w-6xl mx-auto rounded-2xl md:rounded-3xl border border-neutral-200 bg-white p-6 md:p-10">

          {/* Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-base md:text-lg font-bold text-neutral-900">
                Отримай знижку 5% 🎁
              </div>
              <p className="mt-1 text-neutral-600 text-sm">
                Підпишись на новини — отримаєш оновлення та спеціальні пропозиції.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                className="flex-1 min-w-0 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="Ваш email"
              />
              <button
                type="submit"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Reviews */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <RatingCard
              title="Чудова якість!"
              text="Замовлення прийшло швидко, пакування акуратне. Якість — топ."
              author="Ірина, 2 дні тому"
            />
            <RatingCard
              title="Зручний сайт"
              text="Сайт зручний, товари легко знайти. Оформлення — дуже стильне."
              author="Олег, 5 днів тому"
            />
            <RatingCard
              title="Рекомендую!"
              text="Замовляю вже вдруге — все ідеально. Швидка доставка."
              author="Марина, 6 днів тому"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
