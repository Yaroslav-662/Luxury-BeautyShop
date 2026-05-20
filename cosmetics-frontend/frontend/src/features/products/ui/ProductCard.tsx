// src/features/products/ui/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { resolveCard } from "@/shared/lib/resolveImage";
import type { Product } from "../model/product.types";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const add = useCartStore((s) => s.add);
  const fav = useFavoritesStore();
  const isFav = fav.has(product._id);

  const imageSrc = resolveCard(product.images?.[0]);

  const discount = product.discount ?? 0;
  const finalPrice = product.discountPrice ??
    (discount > 0 ? Math.round(product.price * (1 - discount / 100)) : product.price);
  const hasDiscount = discount > 0 ||
    (product.discountPrice !== undefined && product.discountPrice < product.price);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    add({ _id: product._id, name: product.name, price: finalPrice, image: imageSrc });
  }

  function handleToggleFav(e: React.MouseEvent) {
    e.preventDefault();
    fav.toggle({ _id: product._id, name: product.name, price: finalPrice, images: product.images });
  }

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden relative group flex flex-col h-full">
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          -{discount}%
        </div>
      )}

      <button
        onClick={handleToggleFav}
        className={`absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all
          ${isFav ? "bg-rose-500 text-white scale-110" : "bg-black/50 text-white hover:bg-rose-500 hover:scale-110"}`}
      >
        {isFav ? "♥" : "♡"}
      </button>

      {/* Білий фон + object-contain */}
      <Link to={`/product/${product._id}`} className="block bg-white">
        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
            }}
          />
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1 space-y-1.5">
        <Link to={`/product/${product._id}`}>
          <div className="font-medium text-white hover:text-yellow-400 transition-colors line-clamp-2 text-xs leading-snug">
            {product.name}
          </div>
        </Link>

        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-yellow-400 font-bold text-sm">{finalPrice} ₴</span>
          {hasDiscount && (
            <span className="text-neutral-500 text-xs line-through">{product.price} ₴</span>
          )}
        </div>

        {product.stock === 0 && (
          <span className="text-[10px] text-red-400">Немає в наявності</span>
        )}

        <div className="flex-1 flex items-end pt-1">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-1.5 rounded text-xs font-medium transition-colors
              ${product.stock > 0
                ? "bg-white text-black hover:bg-yellow-400"
                : "bg-zinc-700 text-zinc-500 cursor-not-allowed"}`}
          >
            {product.stock > 0 ? "Додати в кошик" : "Немає"}
          </button>
        </div>
      </div>
    </div>
  );
};
