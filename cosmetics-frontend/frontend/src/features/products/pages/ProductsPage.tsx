// src/features/products/pages/ProductsPage.tsx

import React, { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../ui/ProductGrid";

export const ProductsPage: React.FC = () => {
  const { items, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-white text-2xl font-bold mb-4">Каталог</h1>
      <ProductGrid items={items} />
    </div>
  );
};
