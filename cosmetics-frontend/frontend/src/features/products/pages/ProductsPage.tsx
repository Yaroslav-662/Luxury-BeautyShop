// src/features/products/pages/ProductsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import { api } from "@/core/api/axios";
import type { Product } from "@/features/products/model/product.types";
import { useCartStore } from "@/features/cart/model/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import { resolveImage } from "@/shared/lib/resolveImage";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const cart = useCartStore();
  const { user } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { reviews, fetchReviews } = useReviews();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Не вдалося завантажити товар"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (id) fetchReviews(id);
  }, [id, fetchReviews]);

  const images = useMemo(() => {
    return product?.images?.length
      ? product.images
      : ["https://placehold.co/600x600?text=No+Image"];
  }, [product]);

  const [active, setActive] = useState(0);

  function addToCart() {
    if (!product) return;

    cart.addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      imageUrl: resolveImage(images[0]),
    });
  }

  if (loading) return <div className="text-neutral-300">Завантаження…</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!product) return null;

  return (
    <>
      <MetaTags title={product.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div className="space-y-4">
          <img
            src={resolveImage(images[active])}
            alt={`Фото товару: ${product.name}`}
            className="w-full aspect-square object-cover rounded-2xl"
          />

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Показати фото ${i + 1}`}
                  onClick={() => setActive(i)}
                  className="rounded-xl overflow-hidden"
                >
                  <img
                    src={resolveImage(img)}
                    alt={`Мініатюра ${i + 1} товару ${product.name}`}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <div className="text-2xl text-white">{product.price} ₴</div>

          {product.description && (
            <p className="text-neutral-300">{product.description}</p>
          )}

          <div className="flex gap-3">
            <Button onClick={addToCart} aria-label="Додати товар у кошик">
              Додати в кошик
            </Button>

            <NavLink to="/checkout">
              <Button variant="outline" aria-label="Перейти до оформлення замовлення">
                Оформити
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
