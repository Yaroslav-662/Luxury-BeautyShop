export interface ProductsFilters {
  search: string;
  category?: string;
  brand?: string;
  priceFrom?: number;
  priceTo?: number;
  inStock?: boolean;
  sort?: "price-asc" | "price-desc" | "newest";
}
