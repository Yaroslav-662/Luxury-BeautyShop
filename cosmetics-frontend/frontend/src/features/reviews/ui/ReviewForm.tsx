// src/features/reviews/ui/ReviewForm.tsx

import React, { useState } from "react";
import { useReviews } from "../hooks/useReviews";
import  Button  from "@/shared/ui/Button";
import  Input  from "@/shared/ui/Input";

interface Props {
  productId: string;
}

export const ReviewForm: React.FC<Props> = ({ productId }) => {
  const { createReview } = useReviews();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!comment.trim()) {
      setLocalError("Введіть текст відгуку.");
      return;
    }

    setLoading(true);
    const res = await createReview({
      product: productId,
      rating,
      comment,
    });
    setLoading(false);

    if (res) {
      setComment("");
      setRating(5);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-3 bg-neutral-900/70 border border-neutral-800 rounded-xl p-4"
    >
      <h3 className="text-sm font-semibold text-white">
        Залишити відгук
      </h3>

      {localError && (
        <p className="text-xs text-red-400">{localError}</p>
      )}

      <div className="space-y-1">
        <label className="text-xs text-neutral-300">Оцінка (1-5)</label>
        <Input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-neutral-300">Коментар</label>
        <textarea
          className="w-full min-h-[80px] bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Поділіться враженнями про продукт..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Надсилання..." : "Надіслати відгук"}
      </Button>
    </form>
  );
};
