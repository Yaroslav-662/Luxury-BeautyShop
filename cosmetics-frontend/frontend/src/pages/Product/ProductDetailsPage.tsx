// src/features/products/pages/ProductDetailsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { useCartStore } from "@/features/cart/model/cart.store";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { selected } = useProducts();
  const addToCart = useCartStore((s) => s.addToCart);

  if (!selected || selected._id !== id) {
    return <div className="text-neutral-400">Завантаження…</div>;
  }

  function onAdd() {
  if (!selected || !selected.images?.[0]) return;

  addToCart({
    id: selected._id,
    title: selected.name,
    price: selected.price,
    imageUrl: selected.images[0], // обов'язково
  });
}


  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-6">
      <img
        src={selected.images?.[0]}
        alt={selected.name}
        className="w-full max-h-[400px] object-cover rounded-xl"
      />

      <h1 className="text-3xl font-bold">{selected.name}</h1>

      <p className="text-neutral-400">{selected.description}</p>

      <div className="text-2xl font-semibold">
        {selected.price} ₴
      </div>

      <Button onClick={onAdd}>
        Додати в кошик
      </Button>
    </div>
  );
}

