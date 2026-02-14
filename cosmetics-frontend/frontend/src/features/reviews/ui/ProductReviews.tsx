import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuthStore();
  const { reviews, loading, error, fetchReviews, createReview, deleteReview } = useReviews();

  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (productId) fetchReviews(productId);
  }, [fetchReviews, productId]);

  const getAuthorId = (r: any) =>
    typeof r.user === "string" ? r.user : r.user?._id;

  const canDelete = (r: any) => {
    if (!user) return false;
    const authorId = getAuthorId(r);
    return user.role === "admin" || (authorId && authorId === user._id);
  };

  const canCreate = !!user;

  const handleCreate = async () => {
    const trimmed = text.trim();
    if (!trimmed) return alert("Введіть текст відгуку");

    const ok = await createReview({
      product: productId, // або productId — дивись свій CreateReviewPayload
      rating,
      text: trimmed,
    } as any);

    if (ok) {
      setText("");
      setRating(5);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-bold text-gold-200">Відгуки</h2>
        <Button variant="outline" onClick={() => fetchReviews(productId)}>
          Оновити
        </Button>
      </div>

      {/* Create */}
      <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
        {!canCreate ? (
          <div className="text-neutral-400 text-sm">
            Увійдіть, щоб залишити відгук.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-1">
              <label className="text-xs text-neutral-400 block mb-1">Рейтинг</label>
              <Select
                value={String(rating)}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
            </div>

            <div className="md:col-span-4">
              <label className="text-xs text-neutral-400 block mb-1">Текст</label>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ваш відгук…" />
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button onClick={handleCreate}>Додати</Button>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      {loading && <div className="text-neutral-400">Завантаження…</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}

      {!loading && reviews.length === 0 && (
        <div className="text-neutral-400">Поки немає відгуків.</div>
      )}

      <div className="space-y-3">
        {reviews.map((r: any) => (
          <div key={r._id} className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-neutral-400">
                  Рейтинг: <span className="text-gold-300">{r.rating ?? "-"}</span>
                  {" · "}
                  Автор: <span className="text-neutral-300">{getAuthorId(r)?.slice?.(-6) || "-"}</span>
                </div>
                <div className="text-neutral-200 text-sm mt-2">
                  {r.text || r.comment || r.message || ""}
                </div>
              </div>

              {canDelete(r) && (
                <Button variant="outline" onClick={() => deleteReview(r._id)}>
                  Видалити
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
