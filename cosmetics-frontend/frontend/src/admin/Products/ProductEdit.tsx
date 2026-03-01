import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/shared/api/api";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

/**
 * Тип товару з бекенду
 */
type Product = {
  _id: string;
  name: string;              // Назва товару
  price: number;             // Ціна
  stock: number;             // Кількість на складі
  category?: string;         // ID категорії
  description: string;       // Опис
  imagesUrls: string[];      // URL фото (Cloudinary)
};

/**
 * Максимальна кількість фото
 */
const MAX_IMAGES = 10;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Дані товару
   */
  const [product, setProduct] = useState<Product | null>(null);

  /**
   * Стани
   */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * Отримання товару з бекенду
   */
  useEffect(() => {
    if (!id) return;

    api
      .get<Product>(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  /**
   * Відкрити вибір файлів
   */
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  /**
   * Завантаження фото:
   * File → POST /api/upload/products → URL → imagesUrls[]
   */
  const uploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || !product) return;

    // дозволяє повторно вибрати той самий файл
    e.target.value = "";

    const freeSlots = MAX_IMAGES - product.imagesUrls.length;
    const selectedFiles = Array.from(files).slice(0, freeSlots);

    setUploading(true);
    try {
      const fd = new FormData();

      // Swagger: images[] — масив файлів
      selectedFiles.forEach((file) => {
        fd.append("images", file);
      });

      const res = await api.post<{ urls: string[] }>(
        "/api/upload/products",
        fd
      );

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              imagesUrls: [...prev.imagesUrls, ...res.data.urls],
            }
          : prev
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Видалення фото (видаляємо URL зі state)
   */
  const removeImage = (url: string) => {
    if (!product) return;
    setProduct({
      ...product,
      imagesUrls: product.imagesUrls.filter((img) => img !== url),
    });
  };

  /**
   * Зробити фото головним (перше в масиві)
   */
  const makeMainImage = (index: number) => {
    if (!product) return;
    const images = [...product.imagesUrls];
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setProduct({ ...product, imagesUrls: images });
  };

  /**
   * Збереження змін товару
   * ❗ FormData — як у Swagger
   */
  const saveProduct = async () => {
    if (!product) return;

    const fd = new FormData();

    fd.append("name", product.name);
    fd.append("price", String(product.price));
    fd.append("stock", String(product.stock));
    if (product.category) fd.append("category", product.category);
    fd.append("description", product.description);

    // Swagger: imagesUrls[]
    product.imagesUrls.forEach((url) => {
      fd.append("imagesUrls", url);
    });

    setSaving(true);
    try {
      await api.put(`/api/products/${product._id}`, fd);
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

      {/* Назва товару */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Назва товару
        </label>
        <Input
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
        />
      </div>

      {/* Ціна */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ціна (грн)
        </label>
        <Input
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
        <label className="block text-sm font-medium mb-1">
          Кількість на складі
        </label>
        <Input
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

      {/* Фото товару */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Фото товару
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={uploadImages}
        />

        <Button
          type="button"
          onClick={openFilePicker}
          disabled={uploading || product.imagesUrls.length >= MAX_IMAGES}
        >
          {uploading ? "Завантаження..." : "Додати фото"}
        </Button>

        <div className="flex gap-3 flex-wrap mt-3">
          {product.imagesUrls.map((url, index) => (
            <div
              key={url}
              className="relative w-24 h-24 border rounded overflow-hidden"
            >
              <img
                src={url}
                alt={`Фото ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Видалення фото */}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
              >
                ✕
              </button>

              {/* Зробити головним */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeMainImage(index)}
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
        <Button onClick={saveProduct} disabled={saving || uploading}>
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
