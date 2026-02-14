// src/features/reviews/api/reviews.api.ts

import { api } from "@/core/api/axios";
import type { Review, CreateReviewPayload } from "../model/review.types";

export const ReviewsApi = {
  async getReviews(product?: string): Promise<Review[]> {
    const { data } = await api.get("/api/reviews", {
      params: product ? { product } : undefined,
    });
    return data;
  },

  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await api.post("/api/reviews", payload);
    return data;
  },

  async deleteReview(id: string) {
    const { data } = await api.delete(`/api/reviews/${id}`);
    return data;
  },
};
