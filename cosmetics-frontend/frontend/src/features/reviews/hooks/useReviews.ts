// src/features/reviews/hooks/useReviews.ts

import { create } from "zustand";
import { ReviewsApi } from "../api/reviews.api";
import type { Review, CreateReviewPayload } from "../model/review.types";

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;

  fetchReviews: (product?: string) => Promise<void>;
  createReview: (payload: CreateReviewPayload) => Promise<Review | null>;
  deleteReview: (id: string) => Promise<boolean>;
}

export const useReviews = create<ReviewsState>((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (product?: string) => {
    set({ loading: true, error: null });
    try {
      const reviews = await ReviewsApi.getReviews(product);
      set({ reviews, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося завантажити відгуки.",
        loading: false,
      });
    }
  },

  createReview: async (payload: CreateReviewPayload) => {
    try {
      const review = await ReviewsApi.createReview(payload);
      set({ reviews: [review, ...get().reviews] });
      return review;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося додати відгук.",
      });
      return null;
    }
  },

  deleteReview: async (id: string) => {
    try {
      await ReviewsApi.deleteReview(id);
      set({ reviews: get().reviews.filter((r) => r._id !== id) });
      return true;
    } catch {
      return false;
    }
  },
}));
