import { useProducts as useFeatureProducts } from "@/features/products/hooks/useProducts";

export default function useProducts(params?: any) {
  return useFeatureProducts(params);
}
