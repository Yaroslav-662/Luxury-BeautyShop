// src/features/reviews/pages/ReviewsPage.tsx

import React, { useEffect } from "react";
import { useReviews } from "../hooks/useReviews";
import { ReviewList } from "../ui/ReviewList";

export const ReviewsPage: React.FC = () => {
  const { reviews, fetchReviews, deleteReview, loading, error } = useReviews();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    await deleteReview(id);
  };

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Відгуки</h1>

      {loading && (
        <p className="text-sm text-neutral-400">
          Завантаження...
        </p>
      )}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <ReviewList
        reviews={reviews}
        canDelete
        onDelete={handleDelete}
      />
    </div>
  );
};
