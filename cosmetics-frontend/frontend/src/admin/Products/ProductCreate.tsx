// src/admin/pages/CreateProduct.tsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/core/api/axios";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

/**
 * Категорія товару (з бекенду)
 */
interface Category {
  _id: string;
  name: string;
}

/**
 * Максимальна кількість фото товару
 */
const MAX_IMAGES = 10;

export default function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Список категорій
   */
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * Форма створення товару
   */
  const [form, setForm] = useState({
    name: "",           // Назва товару
    price: 0,           // Ціна
    stock: 0,           // Кількість на складі
    category: "",       // ID категорії
    description: "",    // Опис товару
    images: [] as string[], // URLs фото з Cloudinary
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * Завантаження категорій з бекенду
   */
  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /**
   * Відкрити системний вибір файлів
   */
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  /**
   * Завантаження фото в Cloudinary через бекенд
   */
  const uploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // очищаємо input, щоб можна було вибрати той самий файл ще раз
    e.target.value = "";

    const freeSlots = MAX_IMAGES - form.images.length;
    const selectedFiles = Array.from(files).slice(0, freeSlots);

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("image", file);

        /**
         * Бекенд:
         * POST /api/uploads/products
         * -> { urls: string[] }
         */
        const res = await api.post<{ urls: string[] }>(
          "/api/uploads/products",
          formData
        );

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.urls],
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Помилка завантаження зображення");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Видалення фото з форми (тільки URL)
   */
  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  /**
   * Зробити фото головним (перше в масиві)
   */
  const makeMainImage = (index: number) => {
    setForm((prev) => {
      const images = [...prev.images];
      const [selected] = images.splice(index, 1);
      images.unshift(selected);
      return { ...prev, images };
    });
  };

  /**
   * Збереження товару
   */
  const saveProduct = async () => {
    if (!form.name.trim()) {
      alert("Введіть назву товару");
      return;
    }

    if (form.price <= 0) {
      alert("Ціна повинна бути більшою за 0");
      return;
    }

    if (!form.category) {
      alert("Оберіть категорію");
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/products", form);
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Помилка створення товару");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Створення нового товару</h1>

      {/* Назва */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Назва товару
        </label>
        <Input
          placeholder="Наприклад: Крем для обличчя"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
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
          placeholder="Наприклад: 499"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
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
          placeholder="Наприклад: 20"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
        />
      </div>

      {/* Категорія */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Категорія товару
        </label>
        <Select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">— Оберіть категорію —</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Опис */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Опис товару
        </label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Детальний опис товару"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* Фото */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Фото товару (до {MAX_IMAGES})
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
          disabled={uploading || form.images.length >= MAX_IMAGES}
        >
          {uploading ? "Завантаження..." : "Додати фото"}
        </Button>

        <div className="flex flex-wrap gap-3 mt-3">
          {form.images.map((url, index) => (
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
                  onClick={() => makeMainImage(index)}
                  className="absolute bottom-0 left-0 bg-yellow-400 text-xs px-1"
                >
                  Головне
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs mt-1">
          {form.images.length} / {MAX_IMAGES} фото
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <Button
          onClick={saveProduct}
          disabled={saving || uploading}
        >
          {saving ? "Збереження..." : "Створити товар"}
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={() => navigate("/admin/products")}
        >
          Скасувати
        </Button>
      </div>
    </div>
  );
}
