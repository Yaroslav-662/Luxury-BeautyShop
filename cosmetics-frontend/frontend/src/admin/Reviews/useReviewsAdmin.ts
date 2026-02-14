import { create } from "zustand";
import { ReviewsApi } from "@/features/reviews/api/reviews.api";
import type { Review } from "@/features/reviews/model/review.types";

interface ReviewsAdminState {
  items: Review[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  deleteOne: (id: string) => Promise<boolean>;
}

export const useReviewsAdmin = create<ReviewsAdminState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      // адмін теж може викликати getReviews() без product
      const data = await ReviewsApi.getReviews();
      set({ items: data, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Не вдалося завантажити відгуки.",
      });
    }
  },

  deleteOne: async (id: string) => {
    try {
      await ReviewsApi.deleteReview(id);
      set({ items: get().items.filter((r) => r._id !== id) });
      return true;
    } catch {
      return false;
    }
  },
}));
