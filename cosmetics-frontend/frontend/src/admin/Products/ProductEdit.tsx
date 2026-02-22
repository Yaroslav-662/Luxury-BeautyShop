// src/admin/Products/ProductEdit.tsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/shared/api/api";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
};

const MAX_IMAGES = 10;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (!id) return;

    api
      .get<Product>(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const pickImages = () => fileRef.current?.click();

  const uploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || !product) return;

    e.target.value = "";

    const free = MAX_IMAGES - product.images.length;
    const selected = Array.from(files).slice(0, free);

    setUploading(true);
    try {
      for (const file of selected) {
        const fd = new FormData();
        fd.append("image", file);

        const res = await api.post<{ urls: string[] }>(
          "/api/uploads/products",
          fd
        );

        setProduct((prev) =>
          prev
            ? { ...prev, images: [...prev.images, ...res.data.urls] }
            : prev
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    if (!product) return;
    setProduct({
      ...product,
      images: product.images.filter((img) => img !== url),
    });
  };

  const makeMain = (index: number) => {
    if (!product) return;
    const images = [...product.images];
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setProduct({ ...product, images });
  };

  const onSave = async () => {
    if (!product) return;

    setSaving(true);
    try {
      await api.put(`/api/products/${product._id}`, product);
      navigate("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Завантаження…</div>;
  if (!product) return <div>Товар не знайдено</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <h1 className="text-2xl font-bold">Редагування товару</h1>

      {/* Назва */}
      <div>
        <label
          htmlFor="product-name"
          className="block text-sm font-medium mb-1"
        >
          Назва товару
        </label>
        <Input
          id="product-name"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
        />
      </div>

      {/* Ціна */}
      <div>
        <label
          htmlFor="product-price"
          className="block text-sm font-medium mb-1"
        >
          Ціна (грн)
        </label>
        <Input
          id="product-price"
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({
              ...product,
              price: Number(e.target.value),
            })
          }
        />
      </div>

      {/* Кількість */}
      <div>
        <label
          htmlFor="product-stock"
          className="block text-sm font-medium mb-1"
        >
          Кількість на складі
        </label>
        <Input
          id="product-stock"
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({
              ...product,
              stock: Number(e.target.value),
            })
          }
        />
      </div>

      {/* Опис */}
      <div>
        <label
          htmlFor="product-description"
          className="block text-sm font-medium mb-1"
        >
          Опис товару
        </label>
        <textarea
          id="product-description"
          className="w-full p-2 border rounded"
          rows={4}
          value={product.description}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value,
            })
          }
        />
      </div>

      {/* Фото */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Фото товару
        </label>

        <input
          ref={fileRef}
          id="product-images"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={uploadImages}
        />

        <Button
          type="button"
          onClick={pickImages}
          disabled={uploading || product.images.length >= MAX_IMAGES}
        >
          {uploading ? "Завантаження..." : "Додати фото"}
        </Button>

        <div className="flex gap-3 flex-wrap mt-3">
          {product.images.map((url, index) => (
            <div
              key={url}
              className="relative w-24 h-24 border rounded overflow-hidden"
            >
              <img
                src={url}
                alt={`Фото ${index + 1}`}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
              >
                ✕
              </button>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeMain(index)}
                  className="absolute bottom-0 left-0 bg-yellow-400 text-xs px-1"
                >
                  Головне
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <Button onClick={onSave} disabled={saving || uploading}>
          {saving ? "Збереження..." : "Зберегти"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/products")}
        >
          Скасувати
        </Button>
      </div>
    </div>
  );
};

export default ProductEdit;
