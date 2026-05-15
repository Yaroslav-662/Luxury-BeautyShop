// src/pages/Favorites/FavoritesPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { useFavoritesStore } from "@/store/favorites.store";
import { useCartStore } from "@/store/cart.store";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function FavoritesPage() {
  const { items, toggle, clear } = useFavoritesStore();
  const addToCart = useCartStore((s) => s.add);

  function handleAddToCart(item: typeof items[0]) {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: resolveImage(item.images?.[0]),
    });
  }

  return (
    <>
      <MetaTags title="Обрані товари" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gold-300">Обрані товари</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {items.length > 0
                ? `${items.length} товар${items.length === 1 ? "" : items.length < 5 ? "и" : "ів"}`
                : "Збережені товари відображаються тут"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm text-neutral-400 hover:text-red-400 transition-colors border border-neutral-700 px-3 py-1.5 rounded-lg"
            >
              Очистити все
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">♡</div>
            <h2 className="text-lg font-semibold text-neutral-300 mb-2">Список порожній</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Натискай ♡ на товарах, щоб зберегти їх тут
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => {
              const imageSrc = resolveImage(item.images?.[0] || item.image);
              return (
                <div
                  key={item._id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group relative"
                >
                  {/* Видалити з обраних */}
                  <button
                    onClick={() => toggle(item)}
                    title="Видалити з обраних"
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-rose-500 text-white text-sm hover:bg-rose-600 transition-colors"
                  >
                    ♥
                  </button>

                  {/* Фото */}
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300?text=No+Image";
                      }}
                    />
                  </Link>

                  {/* Інфо */}
                  <div className="p-4 space-y-3">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-semibold text-white hover:text-yellow-400 transition-colors text-sm line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-yellow-400 font-bold">{item.price} ₴</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-white text-black py-2 rounded text-xs font-medium hover:bg-yellow-400 transition-colors"
                      >
                        До кошика
                      </button>
                      <Link
                        to={`/product/${item._id}`}
                        className="border border-neutral-700 text-neutral-400 px-3 py-2 rounded text-xs hover:border-neutral-500 hover:text-white transition-colors"
                      >
                        Детальніше
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
