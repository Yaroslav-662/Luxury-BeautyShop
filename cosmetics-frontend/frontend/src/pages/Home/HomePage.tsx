// src/pages/Home/HomePage.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Button from "@/shared/ui/Button";
import type { Product } from "@/features/products/model/product.types";

const SectionHeader: React.FC<{
  title: string;
  rightLink?: { to: string; label: string };
}> = ({ title, rightLink }) => (
  <div className="flex items-end justify-between gap-4">
    <h2 className="text-xl md:text-2xl font-bold text-neutral-900">{title}</h2>
    {rightLink ? (
      <Link
        to={rightLink.to}
        className="text-xs md:text-sm uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
      >
        {rightLink.label}
      </Link>
    ) : null}
  </div>
);

function useHorizontalScroll() {
  // ✅ важливо: null! щоб реф був RefObject<HTMLDivElement> (без | null)
  const ref = useRef<HTMLDivElement>(null!);

  const scrollLeft = () => {
    ref.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollRight = () => {
    ref.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return { ref, scrollLeft, scrollRight };
}

const HomePage: React.FC = () => {
  const { items, loading, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const newProducts = useMemo(() => items.slice(0, 10), [items]);
  const highlights = useMemo(() => items.slice(0, 10), [items]);

  const newScroll = useHorizontalScroll();
  const hiScroll = useHorizontalScroll();

  const quickTiles = [
    { title: "Bestsellers", to: "/shop?q=bestseller" },
    { title: "Seasonal", to: "/shop?q=season" },
    { title: "Category", to: "/shop" },
    { title: "Outlet", to: "/shop?q=outlet" },
  ];

  const RatingCard: React.FC<{
    title: string;
    text: string;
    author: string;
  }> = ({ title, text, author }) => (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2 text-neutral-900">
        <span className="text-sm">★★★★★</span>
      </div>
      <div className="mt-3 font-semibold text-neutral-900">{title}</div>
      <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{text}</p>
      <div className="mt-3 text-xs text-neutral-500">{author}</div>
    </div>
  );

  const Carousel: React.FC<{
    products: Product[];
    scrollRef: React.RefObject<HTMLDivElement>;
    onLeft: () => void;
    onRight: () => void;
  }> = ({ products, scrollRef, onLeft, onRight }) => (
    <div className="relative">
      <button
        type="button"
        onClick={onLeft}
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={onRight}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50"
        aria-label="Scroll right"
      >
        ›
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((p) => (
          <div key={p._id} className="min-w-[220px] max-w-[220px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <MetaTags title="Головна" />

      {/* HERO */}
      <section className="px-4 md:px-8 pt-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900">
            Твій преміальний beauty shop
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-600">
            Luxury BeautyShop — догляд, макіяж і бренди. Зручний каталог, швидке
            замовлення, а для адміна — повна панель керування товарами,
            категоріями, замовленнями та користувачами.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link to="/shop">
              <Button size="lg">Перейти в каталог</Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="lg">
                Усі товари
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neutral-900" />
            <span className="h-2 w-2 rounded-full bg-neutral-300" />
            <span className="h-2 w-2 rounded-full bg-neutral-300" />
          </div>
        </div>
      </section>

      {/* 4 tiles */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickTiles.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition p-6 flex items-center justify-center text-sm font-semibold text-neutral-700"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </section>

      {/* NEW PRODUCTS */}
      <section className="px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <SectionHeader
            title="New products!"
            rightLink={{ to: "/shop", label: "Browse all products" }}
          />

          {loading ? (
            <div className="text-neutral-500">Завантаження...</div>
          ) : newProducts.length === 0 ? (
            <div className="text-neutral-500">
              Наразі немає доступних товарів.
            </div>
          ) : (
            <Carousel
              products={newProducts}
              scrollRef={newScroll.ref}
              onLeft={newScroll.scrollLeft}
              onRight={newScroll.scrollRight}
            />
          )}
        </div>
      </section>

      {/* PROMO BOX */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="text-neutral-600 text-xs uppercase tracking-widest">
                Up to
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-neutral-900">
                50%
              </div>
              <div className="mt-2 text-neutral-600">
                знижка на товари з вибраної категорії
              </div>

              <div className="mt-5">
                <Link to="/shop?q=sale">
                  <Button>Shop now</Button>
                </Link>
              </div>
            </div>

            <div className="h-40 w-full md:w-[380px] rounded-2xl bg-white/60 border border-neutral-200 flex items-center justify-center text-neutral-400">
              Банер / фото
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY HIGHLIGHTS */}
      <section className="px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <SectionHeader
            title="Category highlights"
            rightLink={{ to: "/shop", label: "Browse all products" }}
          />

          {loading ? (
            <div className="text-neutral-500">Завантаження...</div>
          ) : highlights.length === 0 ? (
            <div className="text-neutral-500">Немає товарів для показу.</div>
          ) : (
            <Carousel
              products={highlights}
              scrollRef={hiScroll.ref}
              onLeft={hiScroll.scrollLeft}
              onRight={hiScroll.scrollRight}
            />
          )}
        </div>
      </section>

      {/* 2 promo cards */}
      <section className="px-4 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 flex items-center justify-between gap-6">
            <div>
              <div className="text-neutral-600 text-xs uppercase tracking-widest">
                Up to
              </div>
              <div className="text-5xl font-extrabold text-neutral-900">25%</div>
              <div className="mt-2 text-neutral-600">
                знижка на товари з Category
              </div>
              <div className="mt-5">
                <Link to="/shop?q=category">
                  <Button variant="outline">Shop now</Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex h-24 w-40 rounded-2xl bg-white/60 border border-neutral-200 items-center justify-center text-neutral-400">
              Банер
            </div>
          </div>

          <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 flex items-center justify-between gap-6">
            <div>
              <div className="text-neutral-600 text-xs uppercase tracking-widest">
                Up to
              </div>
              <div className="text-5xl font-extrabold text-neutral-900">50%</div>
              <div className="mt-2 text-neutral-600">знижка на Outlet</div>
              <div className="mt-5">
                <Link to="/shop?q=outlet">
                  <Button variant="outline">Browse products</Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex h-24 w-40 rounded-2xl bg-white/60 border border-neutral-200 items-center justify-center text-neutral-400">
              Банер
            </div>
          </div>
        </div>
      </section>

      {/* newsletter + rating */}
      <section className="px-4 md:px-8 mt-12 pb-14">
        <div className="max-w-6xl mx-auto rounded-3xl border border-neutral-200 bg-white p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-lg font-bold text-neutral-900">
                Grab an extra 5% discount
              </div>
              <p className="mt-2 text-neutral-600 text-sm">
                Підпишись на новини — отримаєш оновлення та спеціальні пропозиції.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="rounded-xl px-5 py-3 text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <RatingCard
              title="Great value and quality"
              text="Замовлення прийшло швидко, пакування акуратне. Якість — топ."
              author="Ірина, 2 дні тому"
            />
            <RatingCard
              title="Beautiful design"
              text="Сайт зручний, товари легко знайти. Оформлення — дуже стильне."
              author="Олег, 5 днів тому"
            />
            <RatingCard
              title="Exactly what I wanted"
              text="Замовляю вже вдруге — все ідеально. Рекомендую!"
              author="Марина, 6 днів тому"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
