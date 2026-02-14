// src/features/products/pages/ProductCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductForm, ProductFormData } from "../ui/ProductForm";
import type { CreateProductDto } from "../model/product.types";

export const ProductCreatePage: React.FC = () => {
  const { createProduct } = useProducts();
  const nav = useNavigate();

  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    images: [],
    categoryId: "",
    isActive: true,
  });

  const submit = async (v: ProductFormData) => {
    const dto: CreateProductDto = {
      name: v.name,
      description: v.description,
      price: v.price,
      images: v.images,
      category: v.categoryId,
      stock: v.isActive ? 999 : 0, // ⬅ тимчасова логіка
    };

    const res = await createProduct(dto);
    if (res) nav("/admin/products");
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Новий товар</h1>

      <ProductForm
        value={form}
        onChange={setForm}
        onSubmit={submit}
      />
    </div>
  );
};
