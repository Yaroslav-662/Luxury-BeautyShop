// src/widgets/ProductCard/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { resolveImage } from "@/shared/lib/resolveImage";
import type { Product } from "@/features/products/model/product.types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const add = useCartStore((s) => s.add);
  const fav = useFavoritesStore();
  const isFav = fav.has(product._id);

  const imageSrc = resolveImage(product.images?.[0]);

  // Знижка
  const discount = product.discount ?? 0;
  const finalPrice = product.discountPrice ??
    (discount > 0 ? Math.round(product.price * (1 - discount / 100)) : product.price);
  const hasDiscount = discount > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    add({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: imageSrc,
    });
  }

  function handleToggleFav(e: React.MouseEvent) {
    e.preventDefault();
    fav.toggle({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      images: product.images,
    });
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition group relative">
      {/* Знижка badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          -{discount}%
        </div>
      )}

      {/* Обрані */}
      <button
        onClick={handleToggleFav}
        title={isFav ? "Видалити з обраних" : "Додати до обраних"}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors
          ${isFav ? "bg-rose-500 text-white" : "bg-black/50 text-white hover:bg-rose-500"}`}
      >
        {isFav ? "♥" : "♡"}
      </button>

      {/* Фото */}
      <Link to={`/product/${product._id}`}>
        <img
          src={imageSrc}
          alt={product.name}
          className="h-56 w-full object-cover group-hover:opacity-90 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
          }}
        />
      </Link>

      <div className="p-4 space-y-2">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-base font-semibold text-white hover:text-yellow-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Ціна */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-lg">{finalPrice} ₴</span>
          {hasDiscount && (
            <span className="text-neutral-500 text-sm line-through">{product.price} ₴</span>
          )}
        </div>

        <button
          className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors
            ${product.stock > 0
              ? "bg-white text-black hover:bg-yellow-400 hover:text-black"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
          disabled={product.stock <= 0}
          onClick={handleAddToCart}
        >
          {product.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
        </button>
      </div>
    </div>
  );
}
