// src/pages/Product/ProductPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import Input from "@/shared/ui/Input";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";

import { api } from "@/core/api/axios";
import type { Product } from "@/features/products/model/product.types";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const cart = useCartStore();
  const fav = useFavoritesStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [pLoading, setPLoading] = useState(false);
  const [pError, setPError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { reviews, fetchReviews, createReview, deleteReview } = useReviews();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  // Завантаження продукту
  useEffect(() => {
    if (!id) return;
    setPLoading(true);
    setPError(null);
    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((e: any) =>
        setPError(e?.response?.data?.message || "Не вдалося завантажити товар.")
      )
      .finally(() => setPLoading(false));
  }, [id]);

  // Завантаження відгуків
  useEffect(() => {
    if (!id) return;
    fetchReviews(id);
  }, [id, fetchReviews]);

  // Масив фото
  const images = useMemo(() => {
    if (!product) return ["https://placehold.co/900x900?text=No+Image"];
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["https://placehold.co/900x900?text=No+Image"];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => setActiveImage(0), [id]);

  // Середній рейтинг
  const avg = useMemo(() => {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const canDelete = (r: any) => {
    if (!user) return false;
    const authorId = typeof r.user === "string" ? r.user : r.user?.id || r.user?._id;
    return (user as any).role === "admin" || (authorId && authorId === (user as any)._id);
  };

  async function onCreateReview() {
    if (!id) return;
    const c = comment.trim();
    if (!c) return alert("Введіть текст відгуку");
    const created = await createReview({ product: id, rating, comment: c } as any);
    if (created) {
      setComment("");
      setRating(5);
    }
  }

  // Додати в кошик (використовує store/cart.store.ts)
  function addToCart() {
    if (!product) return;
    cart.add({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: resolveImage(images[0]),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  // Додати / видалити з обраних
  function toggleFavorite() {
    if (!product) return;
    fav.toggle({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
    });
  }

  const isFav = product ? fav.has(product._id) : false;

  if (pLoading) return <div className="text-neutral-300">Завантаження…</div>;
  if (pError)
    return (
      <div className="space-y-3">
        <div className="text-red-300">{pError}</div>
        <NavLink to="/shop" className="text-sm text-neutral-200 hover:text-white underline">
          ← Назад в каталог
        </NavLink>
      </div>
    );
  if (!product) return null;

  return (
    <>
      <MetaTags title={product.name || "Product"} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ГАЛЕРЕЯ */}
        <div className="space-y-4">
          <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl overflow-hidden">
            <img
              src={resolveImage(images[activeImage])}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-auto pb-1">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`border rounded-xl overflow-hidden w-20 h-20 shrink-0 transition-colors ${
                    idx === activeImage
                      ? "border-white/60"
                      : "border-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  <img src={resolveImage(src)} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ІНФО */}
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-gold-300">{product.name}</h1>
            <div className="text-sm text-neutral-400 mt-1">
              {reviews.length ? (
                <>⭐ <span className="text-neutral-200">{avg}</span> / 5{" "}
                  <span className="text-neutral-500">({reviews.length} відгуків)</span></>
              ) : (
                <span className="text-neutral-500">Поки немає відгуків</span>
              )}
            </div>
          </div>

          <div className="text-2xl font-semibold text-white">{product.price} ₴</div>

          {product.stock > 0 ? (
            <span className="text-sm text-green-400">✓ В наявності ({product.stock} шт.)</span>
          ) : (
            <span className="text-sm text-red-400">✗ Немає в наявності</span>
          )}

          {product.description && (
            <p className="text-neutral-300 text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Дії */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={addToCart} disabled={product.stock === 0}>
              {addedToCart ? "✓ Додано до кошика!" : "Додати в кошик"}
            </Button>

            <NavLink to="/checkout">
              <Button variant="outline">Оформити зараз</Button>
            </NavLink>

            <button
              onClick={toggleFavorite}
              title={isFav ? "Видалити з обраних" : "Додати до обраних"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isFav
                  ? "border-rose-500 text-rose-400 hover:bg-rose-500/10"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"
              }`}
            >
              {isFav ? "♥ В обраних" : "♡ В обрані"}
            </button>
          </div>
        </div>
      </div>

      {/* ВІДГУКИ */}
      <div className="mt-12 space-y-5">
        <h2 className="text-2xl font-bold text-white">Відгуки</h2>

        {!user ? (
          <div className="text-sm text-neutral-400">
            <NavLink to="/login" className="text-white underline hover:text-neutral-300">Увійдіть</NavLink>
            , щоб залишити відгук.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-1">
              <label className="text-xs text-neutral-400 block mb-1">Рейтинг</label>
              <Select value={String(rating)} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} ⭐</option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-4">
              <label className="text-xs text-neutral-400 block mb-1">Коментар</label>
              <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ваш відгук…" />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button onClick={onCreateReview} className="w-full">Додати</Button>
            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-neutral-500 text-sm">Відгуків поки немає. Будьте першим!</div>
        )}

        {reviews.map((r: any) => (
          <div key={r._id} className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <div>⭐ <span className="text-gold-300 font-semibold">{r.rating ?? "-"}</span> / 5</div>
                <div className="text-xs text-neutral-500">
                  {r.user?.name || r.user?.email || "Анонім"}
                  {r.createdAt && <> · {new Date(r.createdAt).toLocaleDateString("uk-UA")}</>}
                </div>
              </div>
              {canDelete(r) && (
                <Button variant="outline" onClick={() => deleteReview(r._id)}>Видалити</Button>
              )}
            </div>
            <div className="text-neutral-200 text-sm mt-2">{r.comment || r.text || r.message || ""}</div>
          </div>
        ))}
      </div>
    </>
  );
}
