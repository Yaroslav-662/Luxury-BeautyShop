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

  // ✅ Cloudinary автоматично ресайзить до 600x600 fill
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
    <div className="bg-zinc-900 rounded-xl overflow-hidden relative group flex flex-col">
      {/* Знижка badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
          -{discount}%
        </div>
      )}

      {/* Обрані */}
      <button
        onClick={handleToggleFav}
        title={isFav ? "Видалити з обраних" : "Додати до обраних"}
        className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
          ${isFav ? "bg-rose-500 text-white" : "bg-black/50 text-white hover:bg-rose-500"}`}
      >
        {isFav ? "♥" : "♡"}
      </button>

      {/* ✅ Контейнер з aspect-ratio 1:1 — фото завжди квадратне */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x600?text=No+Image";
            }}
          />
        </div>
      </Link>

      {/* Інфо */}
      <div className="p-3 md:p-4 space-y-2 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <div className="font-semibold text-white hover:text-yellow-400 transition-colors line-clamp-2 text-sm leading-snug">
            {product.name}
          </div>
        </Link>

        {/* Ціна */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-yellow-400 font-bold text-base md:text-lg">{finalPrice} ₴</span>
          {hasDiscount && (
            <span className="text-neutral-500 text-xs line-through">{product.price} ₴</span>
          )}
        </div>

        {product.stock === 0 && (
          <span className="text-xs text-red-400">Немає в наявності</span>
        )}

        {/* Кнопка — завжди внизу картки */}
        <div className="flex-1 flex items-end pt-1">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-3 rounded text-xs md:text-sm font-medium transition-colors
              ${product.stock > 0
                ? "bg-white text-black hover:bg-yellow-400"
                : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              }`}
          >
            {product.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
          </button>
        </div>
      </div>
    </div>
  );
};
