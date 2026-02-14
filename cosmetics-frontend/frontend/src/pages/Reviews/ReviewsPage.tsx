import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

import type { Review } from "@/features/reviews/model/review.types";
import type { Product } from "@/features/products/model/product.types";

export default function ReviewsPage() {
  const { user } = useAuthStore();

  const { items: products, fetchProducts } = useProducts();
  const { reviews, loading, error, fetchReviews, createReview, deleteReview } = useReviews();

  const [product, setProduct] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>("");

  // 1) Завантажити товари (для фільтра)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2) Завантажити відгуки (з фільтром або без)
  useEffect(() => {
    fetchReviews(product || undefined);
  }, [fetchReviews, product]);

  const productsMap = useMemo(() => {
    const m = new Map<string, Product>();
    products.forEach((p) => m.set(p._id, p));
    return m;
  }, [products]);

  const canCreate = !!user; // guest не може POST

  const handleCreate = async () => {
    const trimmed = text.trim();
    if (!product) return alert("Оберіть товар");
    if (!trimmed) return alert("Введіть текст відгуку");

    // payload під твій бекенд: якщо в CreateReviewPayload інші поля — підправиш тут 1 рядок
    const ok = await createReview({
      product,
      rating,
      text: trimmed,
    } as any);

    if (ok) {
      setText("");
      setRating(5);
    }
  };

  const getAuthorId = (r: any) =>
    typeof r.user === "string" ? r.user : r.user?._id;

  const canDelete = (r: Review) => {
    if (!user) return false;
    const authorId = getAuthorId(r);
    return user.role === "admin" || (authorId && authorId === user._id);
  };

  return (
    <>
      <MetaTags title="Відгуки" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gold-300">Відгуки</h1>
            <p className="text-neutral-400 text-sm">
              Перегляд публічних відгуків. Додавати можуть лише зареєстровані користувачі.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-2">
            <label className="text-sm text-neutral-400 block">Фільтр по товару</label>
            <Select value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="">Всі товари</option>
              {products.map((p: Product) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* CREATE (тільки user/admin) */}
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Залишити відгук</h2>

          {!canCreate ? (
            <div className="text-neutral-400 text-sm">
              Увійдіть, щоб залишити відгук.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-3">
                <label className="text-xs text-neutral-400 block mb-1">Товар</label>
                <Select value={product} onChange={(e) => setProduct(e.target.value)}>
                  <option value="">Оберіть товар</option>
                  {products.map((p: Product) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="text-xs text-neutral-400 block mb-1">Рейтинг</label>
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

              <div className="md:col-span-2">
                <label className="text-xs text-neutral-400 block mb-1">Текст</label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ваш відгук…"
                />
              </div>

              <div className="md:col-span-6">
                <Button onClick={handleCreate}>Додати відгук</Button>
              </div>
            </div>
          )}
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {loading && <div className="text-neutral-400">Завантаження…</div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}

          {!loading && reviews.length === 0 && (
            <div className="text-neutral-400">Немає відгуків.</div>
          )}

          {reviews.map((r: any) => {
            const authorId = getAuthorId(r);
            const productName = r.product && productsMap.get(r.product)?.name;

            return (
              <div
                key={r._id}
                className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">
                      {productName ? productName : "Товар"}
                    </div>
                    <div className="text-xs text-neutral-400">
                      Рейтинг: <span className="text-gold-300">{r.rating ?? "-"}</span>
                      {" · "}
                      Автор: <span className="text-neutral-300">{authorId?.slice?.(-6) || "-"}</span>
                    </div>
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

                <div className="text-neutral-200 text-sm">
                  {r.text || r.comment || r.message || ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
