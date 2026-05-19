// src/pages/Home/HomePage.tsx
import React, { useEffect, useMemo, useRef } from "react";
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
    <button type="button" onClick={onLeft}
      className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow hover:bg-neutral-50 text-xl"
      aria-label="Scroll left">‹</button>
    <button type="button" onClick={onRight}
      className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow hover:bg-neutral-50 text-xl"
      aria-label="Scroll right">›</button>
    <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {products.map((p) => (
        <div key={p._id} className="min-w-[160px] w-[160px] sm:min-w-[200px] sm:w-[200px] md:min-w-[220px] md:w-[220px] snap-start shrink-0">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  </div>
);

// ─── Скелетон ────────────────────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <div className="flex gap-3 overflow-hidden">
    {[1,2,3,4].map((i) => (
      <div key={i} className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] shrink-0 rounded-xl overflow-hidden">
        <div className="bg-neutral-100 animate-pulse" style={{ paddingBottom: "100%" }} />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-neutral-100 rounded animate-pulse" />
          <div className="h-3 bg-neutral-100 rounded w-2/3 animate-pulse" />
          <div className="h-8 bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const { items, loading, fetchProducts } = useProducts();
  const { items: categories, fetchCategories } = useCategories();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const newProducts = useMemo(() => [...items].slice(0, 10), [items]);
  const saleProducts = useMemo(() => items.filter((p) => (p as any).discount > 0).slice(0, 10), [items]);
  const highlights = saleProducts.length > 0 ? saleProducts : newProducts;

  const newScroll = useHorizontalScroll();
  const hiScroll = useHorizontalScroll();

  const maxDiscount = useMemo(() => {
    if (!items.length) return 50;
    const max = Math.max(...items.map((p) => (p as any).discount || 0));
    return max > 0 ? max : 50;
  }, [items]);

  return (
    <div className="bg-white min-h-screen">
      <MetaTags title="Головна | Luxury BeautyShop" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pt-6 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl md:rounded-3xl bg-neutral-900 overflow-hidden relative min-h-[220px] md:min-h-[300px] flex items-center">
            {/* Градієнт */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-transparent to-transparent" />
            {/* Декоративні кола */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-yellow-400/5" />
            <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-yellow-400/8" />

            <div className="relative z-10 px-6 md:px-12 py-8 md:py-12 max-w-lg">
              <span className="text-yellow-400 text-xs uppercase tracking-widest font-medium">Преміальна косметика</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 leading-tight">
                Твій beauty shop
              </h1>
              <p className="mt-3 text-neutral-400 text-sm md:text-base leading-relaxed">
                Догляд, макіяж і бренди. Зручний каталог, швидке замовлення.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop" className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors">
                  Перейти в каталог
                </Link>
                <Link to="/shop?sort=discount" className="border border-neutral-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                  🔥 Sale до -{maxDiscount}%
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── КАТЕГОРІЇ ────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="px-4 md:px-8 mt-5">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.slice(0, 4).map((c, i) => {
              const emojis = ["💄","🧴","🌸","✨","💅","🫧","🪞","💛"];
              return (
                <Link key={c._id} to={`/shop?category=${c._id}`}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition-all p-4 flex items-center justify-center gap-2 text-sm font-semibold text-neutral-700 text-center">
                  <span>{emojis[i] || "✨"}</span>
                  {c.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── НОВІ ТОВАРИ ──────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8 md:mt-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-900">Нові товари!</h2>
            <Link to="/shop" className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900 font-medium">
              Всі товари →
            </Link>
          </div>
          {loading ? <CarouselSkeleton /> : newProducts.length === 0
            ? <p className="text-neutral-500 text-sm">Наразі немає доступних товарів.</p>
            : <Carousel products={newProducts} scrollRef={newScroll.ref} onLeft={newScroll.scrollLeft} onRight={newScroll.scrollRight} />
          }
        </div>
      </section>

      {/* ── ВЕЛИКИЙ БАНЕР — SALE ─────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl md:rounded-3xl bg-neutral-900 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-0">
              {/* Текст */}
              <div className="px-6 md:px-10 py-8 md:py-10 flex-1">
                <span className="text-neutral-500 text-xs uppercase tracking-widest">До</span>
                <div className="text-5xl md:text-6xl font-extrabold text-yellow-400 mt-1">
                  {maxDiscount}%
                </div>
                <div className="mt-2 text-neutral-300 text-sm md:text-base">
                  знижка на обрані товари колекції
                </div>
                <div className="mt-2 text-neutral-500 text-xs">
                  Обмежена пропозиція · Тільки поки є в наявності
                </div>
                <Link to="/shop?sort=discount"
                  className="inline-block mt-5 bg-yellow-400 text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors">
                  Купити зараз
                </Link>
              </div>

              {/* Права частина — товари зі знижкою */}
              <div className="w-full md:w-64 flex-shrink-0 bg-neutral-800/50 flex items-center justify-center py-6 px-4 min-h-[140px] md:min-h-full md:self-stretch">
                {saleProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {saleProducts.slice(0, 4).map((p) => (
                      <Link key={p._id} to={`/product/${p._id}`}>
                        <div className="aspect-square rounded-lg overflow-hidden bg-neutral-700">
                          <img
                            src={p.images?.[0] || "https://placehold.co/100x100?text=?"}
                            alt={p.name}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=?"; }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl">💄</div>
                    <div className="text-neutral-500 text-xs mt-2">Додайте товари зі знижкою</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ТОВАРИ ЗІ ЗНИЖКОЮ / ХАЙЛАЙТИ ────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8 md:mt-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-900">
              {saleProducts.length > 0 ? "🔥 Товари зі знижкою" : "Рекомендовані товари"}
            </h2>
            <Link to={saleProducts.length > 0 ? "/shop?sort=discount" : "/shop"}
              className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900 font-medium">
              Всі товари →
            </Link>
          </div>
          {loading ? <CarouselSkeleton /> : highlights.length === 0
            ? <p className="text-neutral-500 text-sm">Немає товарів.</p>
            : <Carousel products={highlights} scrollRef={hiScroll.ref} onLeft={hiScroll.scrollLeft} onRight={hiScroll.scrollRight} />
          }
        </div>
      </section>

      {/* ── ДВА БАНЕРИ ───────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Банер 1 — Категорії */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-6 md:p-8 flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-rose-400 text-xs uppercase tracking-widest font-medium">Спеціальна пропозиція</span>
              <div className="text-4xl md:text-5xl font-extrabold text-neutral-900 mt-1">25%</div>
              <div className="mt-1 text-neutral-600 text-sm">знижка на догляд за шкірою</div>
              <div className="mt-1 text-neutral-400 text-xs">При купівлі від 2 товарів</div>
              <Link to="/shop?category=makeup"
                className="inline-block mt-4 bg-neutral-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors">
                Дивитись
              </Link>
            </div>
            <div className="text-6xl md:text-7xl shrink-0 select-none">🌸</div>
          </div>

          {/* Банер 2 — Outlet */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 p-6 md:p-8 flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-amber-500 text-xs uppercase tracking-widest font-medium">Розпродаж</span>
              <div className="text-4xl md:text-5xl font-extrabold text-neutral-900 mt-1">50%</div>
              <div className="mt-1 text-neutral-600 text-sm">знижка на товари outlet</div>
              <div className="mt-1 text-neutral-400 text-xs">Обмежена кількість</div>
              <Link to="/shop?sort=discount"
                className="inline-block mt-4 bg-neutral-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors">
                Переглянути
              </Link>
            </div>
            <div className="text-6xl md:text-7xl shrink-0 select-none">💛</div>
          </div>
        </div>
      </section>

      {/* ── ВСІ КАТЕГОРІЇ ────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="px-4 md:px-8 mt-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-4">Категорії</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((c, i) => {
                const emojis = ["💄","🧴","🌸","✨","💅","🫧","🪞","💛","🌿","🎀","🧖","🌺"];
                return (
                  <Link key={c._id} to={`/shop?category=${c._id}`}
                    className="rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition-all p-3 md:p-4 flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <span className="text-lg">{emojis[i] || "✨"}</span>
                    <span className="truncate">{c.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ПЕРЕВАГИ ─────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🚚", title: "Безкоштовна доставка", sub: "При замовленні від $200" },
            { icon: "✅", title: "Оригінальна продукція", sub: "100% автентичність" },
            { icon: "↩️", title: "Повернення 30 днів", sub: "Без зайвих питань" },
            { icon: "🔒", title: "Безпечна оплата", sub: "Картка / Monobank" },
          ].map((b) => (
            <div key={b.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="text-xs font-semibold text-neutral-800">{b.title}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{b.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER + ВІДГУКИ ─────────────────────────────────────────── */}
      <section className="px-4 md:px-8 mt-8 pb-12">
        <div className="max-w-6xl mx-auto rounded-2xl md:rounded-3xl border border-neutral-200 bg-white p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-base md:text-lg font-bold text-neutral-900">Отримай знижку 5% 🎁</div>
              <p className="mt-1 text-neutral-600 text-sm">Підпишись на новини — отримаєш оновлення та спеціальні пропозиції.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                className="flex-1 min-w-0 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="Ваш email"
              />
              <button type="submit"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 shrink-0 transition-colors">
                Підписатись
              </button>
            </form>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Чудова якість!", text: "Замовлення прийшло швидко, пакування акуратне. Якість — топ.", author: "Ірина", days: 2 },
              { title: "Зручний сайт", text: "Сайт зручний, товари легко знайти. Оформлення — дуже стильне.", author: "Олег", days: 5 },
              { title: "Рекомендую!", text: "Замовляю вже вдруге — все ідеально. Швидка доставка.", author: "Марина", days: 6 },
            ].map((r) => (
              <div key={r.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <div className="mt-2 font-semibold text-neutral-900 text-sm">{r.title}</div>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{r.text}</p>
                <div className="mt-2 text-xs text-neutral-400">{r.author}, {r.days} дні тому</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
