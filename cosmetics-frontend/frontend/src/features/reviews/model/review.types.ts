// src/features/reviews/model/review.types.ts

export interface Review {
  _id: string;
  product: string; // ID товару
  user?: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  product: string;
  rating: number;
  comment: string;
}
