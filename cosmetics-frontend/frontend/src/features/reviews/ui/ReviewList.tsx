// src/features/reviews/ui/ReviewList.tsx

import React from "react";
import type { Review } from "../model/review.types";
import  Button  from "@/shared/ui/Button";

interface Props {
  reviews: Review[];
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export const ReviewList: React.FC<Props> = ({
  reviews,
  canDelete,
  onDelete,
}) => {
  if (!reviews.length) {
    return (
      <p className="text-sm text-neutral-400">
        Поки немає відгуків. Станьте першим!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 flex justify-between gap-3"
        >
          <div>
            <p className="text-sm text-white">
              {r.userName || "Анонім"}
            </p>
            <p className="text-xs text-amber-300">
              Оцінка: {r.rating} / 5
            </p>
            <p className="text-sm text-neutral-200 mt-1">
              {r.comment}
            </p>
            <p className="text-[10px] text-neutral-500 mt-1">
              {new Date(r.createdAt).toLocaleString()}
            </p>
          </div>
          {canDelete && onDelete && (
            <div>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(r._id)}
              >
                Видалити
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
