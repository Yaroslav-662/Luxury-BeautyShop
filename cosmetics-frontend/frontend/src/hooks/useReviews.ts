import { useReviews as useFeatureReviews } from "@/features/reviews/hooks/useReviews";

export default function useReviews(params?: any) {
  return useFeatureReviews(params);
}
