// src/pages/ProductPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import Input from "@/shared/ui/Input";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

import { api } from "@/core/api/axios";
import type { Product } from "@/features/products/model/product.types";
import { useReviews } from "@/features/reviews/hooks/useReviews";

// Завжди віддає повний URL або placeholder
function resolveImage(src?: string) {
  if (src && src.startsWith("http")) return src;
  return "https://placehold.co/900x900?text=No+Image";
}

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const cart = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [pLoading, setPLoading] = useState(false);
  const [pError, setPError] = useState<string | null>(null);

  const { reviews, loading, error, fetchReviews, createReview, deleteReview } = useReviews();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const canCreate = !!user;

  // Завантаження продукту
  useEffect(() => {
    if (!id) return;
    setPLoading(true);
    setPError(null);

    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((e: any) => setPError(e?.response?.data?.message || "Не вдалося завантажити товар."))
      .finally(() => setPLoading(false));
  }, [id]);

  // Завантаження відгуків
  useEffect(() => {
    if (!id) return;
    fetchReviews(id);
  }, [id, fetchReviews]);

  // Масив фото (тільки URL з бекенду)
  const images = useMemo(() => {
    if (!product) return ["https://placehold.co/900x900?text=No+Image"];
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["https://placehold.co/900x900?text=No+Image"];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => setActiveImage(0), [id]);

  const avg = useMemo(() => {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const canDelete = (r: any) => {
    if (!user) return false;
    const authorId = typeof r.user === "string" ? r.user : r.user?.id || r.user?._id;
    return user.role === "admin" || (authorId && authorId === user._id);
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

  function addToCart() {
    if (!product) return;
    cart.add({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: resolveImage(images[0]),
    });
  }

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
        {/* LEFT: GALLERY */}
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
                  className={
                    "border rounded-xl overflow-hidden w-20 h-20 shrink-0 " +
                    (idx === activeImage ? "border-white/60" : "border-neutral-800 hover:border-neutral-600")
                  }
                >
                  <img src={resolveImage(src)} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: INFO */}
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-gold-300">{product.name}</h1>
            <div className="text-sm text-neutral-400 mt-1">
              {reviews.length ? (
                <>
                  ⭐ <span className="text-neutral-200">{avg}</span> / 5{" "}
                  <span className="text-neutral-500">({reviews.length} відгуків)</span>
                </>
              ) : (
                <span className="text-neutral-500">Поки немає відгуків</span>
              )}
            </div>
          </div>

          <div className="text-2xl font-semibold text-white">{product.price} ₴</div>
          {product.description && <p className="text-neutral-300 text-sm leading-relaxed">{product.description}</p>}

          <div className="flex gap-3">
            <Button onClick={addToCart}>Додати в кошик</Button>
            <NavLink to="/checkout">
              <Button variant="outline">Оформити зараз</Button>
            </NavLink>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
            <div className="font-semibold text-white mb-2">Доставка та гарантія</div>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li>• Доставка 1–3 дні (залежить від міста)</li>
              <li>• Повернення протягом 14 днів</li>
              <li>• Підтримка: /contact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-12 space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Відгуки</h2>
            <p className="text-sm text-neutral-400">Публічні відгуки по цьому товару.</p>
          </div>

          <NavLink to="/reviews" className="text-sm text-neutral-200 hover:text-white underline">
            Дивитися всі відгуки →
          </NavLink>
        </div>

        {/* CREATE REVIEW */}
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
          <div className="font-semibold text-white mb-3">Залишити відгук</div>

          {!canCreate ? (
            <div className="text-sm text-neutral-400">Увійдіть, щоб залишити відгук.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-1">
                <label className="text-xs text-neutral-400 block mb-1">Рейтинг</label>
                <Select value={String(rating)} onChange={(e) => setRating(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="md:col-span-4">
                <label className="text-xs text-neutral-400 block mb-1">Коментар</label>
                <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ваш відгук…" />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button onClick={onCreateReview} className="w-full">
                  Додати
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* LIST REVIEWS */}
        <div className="space-y-3">
          {loading && <div className="text-neutral-400">Завантаження…</div>}
          {error && <div className="text-red-300 text-sm">{error}</div>}

          {!loading && reviews.length === 0 && <div className="text-neutral-500">Поки немає відгуків.</div>}

          {reviews.map((r: any) => (
            <div key={r._id} className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-300">
                    ⭐ <span className="text-gold-300 font-semibold">{r.rating ?? "-"}</span> / 5
                  </div>
                  <div className="text-xs text-neutral-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString("uk-UA") : ""}
                  </div>
                </div>

                {canDelete(r) && (
                  <Button variant="outline" onClick={() => deleteReview(r._id)}>
                    Видалити
                  </Button>
                )}
              </div>

              <div className="text-neutral-200 text-sm mt-2">{r.comment || r.text || r.message || ""}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
