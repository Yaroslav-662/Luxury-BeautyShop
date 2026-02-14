// src/features/products/pages/ProductPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import Input from "@/shared/ui/Input";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/features/cart/model/cart.store";

import { api } from "@/core/api/axios";
import type { Product } from "@/features/products/model/product.types";
import { useReviews } from "@/features/reviews/hooks/useReviews";

function resolveImage(src?: string) {
  if (!src) return "https://placehold.co/900x900?text=No+Image";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return src;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const cart = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [pLoading, setPLoading] = useState(false);
  const [pError, setPError] = useState<string | null>(null);

  const { reviews, loading, error, fetchReviews, createReview, deleteReview } =
    useReviews();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const canCreate = !!user;

  useEffect(() => {
    if (!id) return;

    setPLoading(true);
    setPError(null);

    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(
        (e) =>
          setPError(
            e?.response?.data?.message || "Не вдалося завантажити товар."
          )
      )
      .finally(() => setPLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchReviews(id);
  }, [id, fetchReviews]);

  const images = useMemo<string[]>(() => {
    if (product?.images?.length) return product.images;
    return ["https://placehold.co/900x900?text=No+Image"];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce(
      (s: number, r: any) => s + (Number(r.rating) || 0),
      0
    );
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const canDelete = (r: any) => {
    if (!user) return false;
    const authorId = typeof r.user === "string" ? r.user : r.user?._id;
    return user.role === "admin" || authorId === user._id;
  };

  async function onCreateReview() {
    if (!id) return;
    const text = comment.trim();
    if (!text) {
      alert("Введіть текст відгуку");
      return;
    }

    const created = await createReview({
      product: id,
      rating,
      comment: text,
    });

    if (created) {
      setComment("");
      setRating(5);
    }
  }

 function addToCart() {
  if (!product) return;

  cart.addToCart({
    id: product._id,
    title: product.name,
    price: product.price,
    imageUrl: resolveImage(images[0]),
  });
}


  if (pLoading) return <div className="text-neutral-300">Завантаження…</div>;

  if (pError)
    return (
      <div className="space-y-3">
        <div className="text-red-300">{pError}</div>
        <NavLink
          to="/shop"
          className="text-sm text-neutral-200 hover:text-white underline"
        >
          ← Назад в каталог
        </NavLink>
      </div>
    );

  if (!product) return null;

  return (
    <>
      <MetaTags title={product.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
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
                  className={`border rounded-xl overflow-hidden w-20 h-20 shrink-0 ${
                    idx === activeImage
                      ? "border-white/60"
                      : "border-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  <img
                    src={resolveImage(src)}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-gold-300">
              {product.name}
            </h1>
            <div className="text-sm text-neutral-400 mt-1">
              {reviews.length ? (
                <>
                  ⭐ <span className="text-neutral-200">{avg}</span> / 5{" "}
                  <span className="text-neutral-500">
                    ({reviews.length} відгуків)
                  </span>
                </>
              ) : (
                <span className="text-neutral-500">Поки немає відгуків</span>
              )}
            </div>
          </div>

          <div className="text-2xl font-semibold text-white">
            {product.price} ₴
          </div>

          {product.description && (
            <p className="text-neutral-300 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex gap-3">
            <Button onClick={addToCart}>Додати в кошик</Button>
            <NavLink to="/checkout">
              <Button variant="outline">Оформити зараз</Button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-12 space-y-5">
        <h2 className="text-2xl font-bold text-white">Відгуки</h2>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
          {!canCreate ? (
            <div className="text-sm text-neutral-400">
              Увійдіть, щоб залишити відгук.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-1">
                <Select
                  value={String(rating)}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="md:col-span-4">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ваш відгук…"
                />
              </div>

              <div className="md:col-span-1">
                <Button onClick={onCreateReview} className="w-full">
                  Додати
                </Button>
              </div>
            </div>
          )}
        </div>

        {reviews.map((r: any) => (
          <div
            key={r._id}
            className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4"
          >
            <div className="flex justify-between">
              <div>
                ⭐ {r.rating} / 5
              </div>
              {canDelete(r) && (
                <Button
                  variant="outline"
                  onClick={() => deleteReview(r._id)}
                >
                  Видалити
                </Button>
              )}
            </div>
            <div className="text-sm text-neutral-200 mt-2">
              {r.comment}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
