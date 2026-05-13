// src/features/products/ui/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { resolveImage } from "@/shared/lib/resolveImage";
import type { Product } from "../model/product.types";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const add = useCartStore((s) => s.add);
  const fav = useFavoritesStore();
  const isFav = fav.has(product._id);

  const imageSrc = resolveImage(product.images?.[0]);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    add({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: imageSrc,
    });
  }

  function handleToggleFav(e: React.MouseEvent) {
    e.preventDefault();
    fav.toggle({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
    });
  }

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden relative group">
      {/* Кнопка обраних */}
      <button
        onClick={handleToggleFav}
        title={isFav ? "Видалити з обраних" : "Додати до обраних"}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
          ${isFav
            ? "bg-rose-500 text-white"
            : "bg-black/50 text-white hover:bg-rose-500"
          }`}
      >
        {isFav ? "♥" : "♡"}
      </button>

      {/* Фото */}
      <Link to={`/product/${product._id}`}>
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x300?text=No+Image";
          }}
        />
      </Link>

      {/* Інфо */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${product._id}`}>
          <div className="font-semibold text-white hover:text-yellow-400 transition-colors line-clamp-2">
            {product.name}
          </div>
        </Link>

        <div className="text-neutral-400 text-sm">{product.price} ₴</div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          aria-label="Додати товар у кошик"
          className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors
            ${product.stock > 0
              ? "bg-white text-black hover:bg-yellow-400"
              : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
            }`}
        >
          {product.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
        </button>
      </div>
    </div>
  );
};
