// src/features/products/ui/ProductGrid.tsx

import React from "react";
import type { Product } from "../model/product.types";
import { ProductCard } from "./ProductCard";

interface Props {
  items: Product[];
}

export const ProductGrid: React.FC<Props> = ({ items }) => {
  if (!items.length)
    return <p className="text-neutral-400">Нічого не знайдено.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};
