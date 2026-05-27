// src/pages/Home/HomePage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductCard } from "@/features/products/ui/ProductCard";
import { api } from "@/core/api/axios";
import type { Product } from "@/features/products/model/product.types";

function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null!);
  const scrollLeft = () => ref.current?.scrollBy({ left: -280, behavior: "smooth" });
  const scrollRight = () => ref.current?.scrollBy({ left: 280, behavior: "smooth" });
  return { ref, scrollLeft, scrollRight };
}

const Carousel: React.FC<{
  products: Product[];
  scrollRef: React.RefObject<HTMLDivElement>;
  onLeft: () => void;
  onRight: () => void;
}> = ({ products, scrollRef, onLeft, onRight }) => (
  <div className="relative">
    <button type="button" onClick={onLeft}
      className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:border-yellow-500/50 hover:text-yellow-400 transition-all shadow-lg"
      aria-label="Попередні">&#8249;</button>
    <button type="button" onClick={onRight}
      className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:border-yellow-500/50 hover:text-yellow-400 transition-all shadow-lg"
      aria-label="Наступні">&#8250;</button>
    <div ref={scrollRef}
      className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {products.map((p) => (
        <div key={p._id}
          className="min-w-[180px] w-[180px] sm:min-w-[210px] sm:w-[210px] md:min-w-[230px] md:w-[230px] snap-start shrink-0">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  </div>
);

const CarouselSkeleton = () => (
  <div className="flex gap-4 overflow-hidden">
    {[1,2,3,4].map((i) => (
      <div key={i} className="min-w-[180px] sm:min-w-[210px] md:min-w-[230px] shrink-0 rounded-xl overflow-hidden">
        <div className="bg-neutral-800 animate-pulse" style={{ paddingBottom: "100%" }} />
        <div className="bg-neutral-900 p-3 space-y-2">
          <div className="h-3 bg-neutral-800 rounded animate-pulse" />
          <div className="h-3 bg-neutral-800 rounded w-2/3 animate-pulse" />
          <div className="h-8 bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const { items, loading, fetchProducts } = useProducts();
  const { items: categories, fetchCategories } = useCategories();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    api.get("/api/reviews")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setReviews(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const newProducts = useMemo(() => [...items], [items]);
  const saleProducts = useMemo(
    () => items.filter((p) => (p as any).discount > 0),
    [items]
  );
  const highlights = saleProducts.length > 0 ? saleProducts : newProducts;

  const maxDiscount = useMemo(() => {
    if (!items.length) return 0;
    return Math.max(...items.map((p) => (p as any).discount || 0));
  }, [items]);

  const newScroll = useHorizontalScroll();
  const hiScroll = useHorizontalScroll();

  return (
    <div className="bg-[#0b0b0c] min-h-screen text-white">
      <MetaTags title="Luxury BeautyShop — Преміальна косметика" />

      {/* HERO */}
      <section className="relative px-4 md:px-8 pt-8 md:pt-14 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-800/80 min-h-[240px] md:min-h-[340px] flex items-center">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-yellow-500/3 blur-2xl pointer-events-none" />

            <div className="relative z-10 px-6 md:px-14 py-10 md:py-16 max-w-xl">
              <p className="text-yellow-500/80 text-xs uppercase tracking-[0.3em] font-medium mb-3">
                Преміальна косметика
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                Твій beauty<br className="hidden sm:block" /> shop
              </h1>
              <p className="mt-4 text-neutral-400 text-sm md:text-base leading-relaxed max-w-sm">
                Догляд, макіяж та бренди. Зручний каталог, швидке замовлення по Україні.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/shop"
                  className="inline-flex items-center gap-2 bg-yellow-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Перейти в каталог
                </Link>
                {maxDiscount > 0 && (
                  <Link to="/shop?sort=discount"
                    className="inline-flex items-center gap-2 border border-neutral-700 text-neutral-300 px-5 py-3 rounded-xl text-sm font-medium hover:border-yellow-500/50 hover:text-yellow-400 transition-all">
                    Sale до -{maxDiscount}%
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-3">
              {[
                { value: items.length || "...", label: "Товарів" },
                { value: categories.length || "...", label: "Категорій" },
                { value: "UA", label: "Доставка" },
              ].map((s) => (
                <div key={s.label}
                  className="text-center border border-neutral-700/60 rounded-xl px-5 py-3 bg-neutral-800/40 backdrop-blur-sm">
                  <div className="text-xl font-bold text-yellow-400">{s.value}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* КАТЕГОРІЇ */}
      {categories.length > 0 && (
        <section className="px-4 md:px-8 mt-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c) => (
  <Link
    key={c._id}
    to={`/shop?category=${c._id}`}
    className="group border border-neutral-800 rounded-xl p-4 hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all"
  >
    <div className="text-sm font-semibold text-neutral-200 group-hover:text-yellow-400 transition-colors">
      {c.name}
    </div>

    <div className="text-xs text-neutral-500 mt-2 line-clamp-2">
      {c.description || "Преміальна косметика та beauty товари"}
    </div>
  </Link>
))}
          </div>
        </section>
      )}

      {/* НОВІ ТОВАРИ */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Нові надходження</h2>
              <div className="h-0.5 w-12 bg-yellow-500 mt-1.5 rounded-full" />
            </div>
            <Link to="/shop" className="text-xs text-neutral-500 hover:text-yellow-400 transition-colors uppercase tracking-widest">
              Всі товари &rarr;
            </Link>
          </div>
          {loading ? <CarouselSkeleton /> : newProducts.length === 0
            ? <p className="text-neutral-600 text-sm">Товарів поки немає.</p>
            : <Carousel products={newProducts} scrollRef={newScroll.ref} onLeft={newScroll.scrollLeft} onRight={newScroll.scrollRight} />
          }
        </div>
      </section>

      {/* БАНЕР SALE */}
      {maxDiscount > 0 && (
        <section className="px-4 md:px-8 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/8 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-yellow-500/50 via-yellow-500/20 to-transparent" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 md:py-10 gap-6">
                <div>
                  <p className="text-yellow-500/70 text-xs uppercase tracking-[0.25em] mb-2">Спеціальна пропозиція</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-6xl font-bold text-white">-{maxDiscount}%</span>
                    <span className="text-neutral-400 text-sm">на обрані товари</span>
                  </div>
                  <p className="text-neutral-500 text-xs mt-2">Обмежена пропозиція · Тільки поки є в наявності</p>
                  <Link to="/shop?sort=discount"
                    className="inline-block mt-5 bg-yellow-500 text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all hover:scale-[1.02]">
                    Переглянути товари
                  </Link>
                </div>
                {saleProducts.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 shrink-0">
                    {saleProducts.slice(0, 4).map((p) => (
                      <Link key={p._id} to={`/product/${p._id}`}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 hover:border-yellow-500/40 transition-colors">
                        <img
                          src={p.images?.[0] || "https://placehold.co/96x96?text=?"}
                          alt={p.name}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/96x96?text=?"; }}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HIGHLIGHTS */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {saleProducts.length > 0 ? "Товари зі знижкою" : "Рекомендовані"}
              </h2>
              <div className="h-0.5 w-12 bg-yellow-500 mt-1.5 rounded-full" />
            </div>
            <Link to={saleProducts.length > 0 ? "/shop?sort=discount" : "/shop"}
              className="text-xs text-neutral-500 hover:text-yellow-400 transition-colors uppercase tracking-widest">
              Всі товари &rarr;
            </Link>
          </div>
          {loading ? <CarouselSkeleton /> : highlights.length === 0
            ? <p className="text-neutral-600 text-sm">Немає товарів.</p>
            : <Carousel products={highlights} scrollRef={hiScroll.ref} onLeft={hiScroll.scrollLeft} onRight={hiScroll.scrollRight} />
          }
        </div>
      </section>

      {/* ДВА БАНЕРИ */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-500/5 blur-2xl pointer-events-none" />
            <p className="text-yellow-500/70 text-xs uppercase tracking-[0.2em] mb-2">Догляд за шкірою</p>
            <div className="text-4xl font-bold text-white">25%</div>
            <p className="text-neutral-400 text-sm mt-1">знижка при купівлі від 2 товарів</p>
            <Link to="/shop"
              className="inline-block mt-5 border border-neutral-700 text-neutral-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-yellow-500/50 hover:text-yellow-400 transition-all">
              Переглянути
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-500/5 blur-2xl pointer-events-none" />
            <p className="text-yellow-500/70 text-xs uppercase tracking-[0.2em] mb-2">Розпродаж</p>
            <div className="text-4xl font-bold text-white">50%</div>
            <p className="text-neutral-400 text-sm mt-1">знижка на товари outlet</p>
            <Link to="/shop?sort=discount"
              className="inline-block mt-5 border border-neutral-700 text-neutral-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-yellow-500/50 hover:text-yellow-400 transition-all">
              Переглянути
            </Link>
          </div>
        </div>
      </section>

      {/* КАТЕГОРІЇ ПОВНІ */}
      {categories.length > 0 && (
        <section className="px-4 md:px-8 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-white">Категорії</h2>
              <div className="h-0.5 w-12 bg-yellow-500 mt-1.5 rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((c) => (
                <Link key={c._id} to={`/shop?category=${c._id}`}
                  className="group border border-neutral-800 rounded-xl p-4 text-sm font-medium text-neutral-400 hover:border-yellow-500/40 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all text-center">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ПЕРЕВАГИ */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: "Безкоштовна доставка", sub: "При замовленні від $200", icon: "▲" },
            { title: "Оригінальна продукція", sub: "100% автентичність", icon: "◆" },
            { title: "Повернення 30 днів", sub: "Без зайвих питань", icon: "↺" },
            { title: "Безпечна оплата", sub: "Картка / Monobank", icon: "◉" },
          ].map((b) => (
            <div key={b.title} className="border border-neutral-800 rounded-xl p-4 text-center group hover:border-yellow-500/30 transition-colors">
              <div className="text-yellow-500/60 text-xl font-bold mb-2 group-hover:text-yellow-500/80 transition-colors">{b.icon}</div>
              <div className="text-xs font-semibold text-neutral-300">{b.title}</div>
              <div className="text-xs text-neutral-600 mt-0.5">{b.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER + ВІДГУКИ */}
      <section className="px-4 md:px-8 mt-10 pb-14">
        <div className="max-w-6xl mx-auto border border-neutral-800 rounded-2xl md:rounded-3xl p-6 md:p-10 bg-neutral-900/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pb-8 border-b border-neutral-800">
            <div>
              <p className="text-yellow-500/70 text-xs uppercase tracking-[0.2em] mb-2">Newsletter</p>
              <div className="text-lg md:text-xl font-bold text-white">Отримай знижку 5%</div>
              <p className="mt-1 text-neutral-500 text-sm">Підпишись — отримай спеціальні пропозиції першим.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                className="flex-1 min-w-0 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50"
                placeholder="Ваш email"
              />
              <button type="submit"
                className="bg-yellow-500 text-black px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors shrink-0">
                OK
              </button>
            </form>
          </div>

          <div className="mt-8">
            <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] mb-5">Відгуки покупців</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reviews.length > 0 ? reviews.map((r: any) => (
                <div key={r._id} className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/60">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-xs ${i < r.rating ? "text-yellow-400" : "text-neutral-700"}`}>&#9733;</span>
                    ))}
                    <span className="text-xs text-neutral-500 ml-1">{r.rating}/5</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">{r.comment || r.text || "—"}</p>
                  <p className="text-xs text-neutral-600 mt-3">
                    {r.user?.name || r.user?.email || "Анонім"}
                    {r.createdAt && <> &middot; {new Date(r.createdAt).toLocaleDateString("uk-UA")}</>}
                  </p>
                </div>
              )) : [
                { text: "Замовлення прийшло швидко, пакування акуратне. Якість — топ.", name: "Ірина К.", rating: 5 },
                { text: "Сайт зручний, товари легко знайти. Оформлення — дуже стильне.", name: "Олег М.", rating: 5 },
                { text: "Замовляю вже вдруге — все ідеально. Рекомендую!", name: "Марина В.", rating: 5 },
              ].map((r) => (
                <div key={r.name} className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/60">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs text-yellow-400">&#9733;</span>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">{r.text}</p>
                  <p className="text-xs text-neutral-600 mt-3">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
