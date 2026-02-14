import React from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import { useFavoritesStore } from "@/store/favorites.store";
import { ProductCard } from "@/features/products/ui/ProductCard";

export default function FavoritesPage() {
  const { items, clear } = useFavoritesStore();

  return (
    <>
      <MetaTags title="Wishlist" />
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gold-300">Wishlist</h1>
          <p className="text-sm text-neutral-400">Збережені товари (локально в браузері).</p>
        </div>

        {items.length > 0 && (
          <Button variant="outline" onClick={clear}>Очистити</Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6 text-neutral-300">
          Тут поки пусто. Натискай ❤ на товарах, щоб додати в wishlist.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
