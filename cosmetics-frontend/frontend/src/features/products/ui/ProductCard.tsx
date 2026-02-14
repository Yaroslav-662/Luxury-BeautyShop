// src/features/products/ui/ProductCard.tsx
import React from "react";
import Button from "@/shared/ui/Button";
import { useCartStore } from "@/features/cart/model/cart.store";
import type { Product } from "../model/product.types";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((s) => s.addToCart);

  function onAdd() {
    addToCart({
      id: product._id,
      title: product.name, // ✅ ВАЖЛИВО
      price: product.price,
      imageUrl: product.images?.[0],
    });
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-3">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />

      <div className="font-semibold text-white">{product.name}</div>

      <div className="text-neutral-400 text-sm">
        {product.price} ₴
      </div>

      <Button onClick={onAdd} className="w-full">
        Додати в кошик
      </Button>
    </div>
  );
};
