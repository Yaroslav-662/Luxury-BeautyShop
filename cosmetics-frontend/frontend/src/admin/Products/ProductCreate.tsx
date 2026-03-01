// src/admin/pages/CreateProduct.tsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/core/api/axios";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

/**
 * Категорія товару (отримується з бекенду)
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
   * Дані форми створення товару
   * ❗ imagesUrls — це URL фото, отримані з API завантаження фото
   */
  const [form, setForm] = useState({
    name: "",               // Назва товару
    price: 0,               // Ціна
    stock: 0,               // Кількість
    category: "",            // ID категорії
    description: "",         // Опис
    imagesUrls: [] as string[], // URL фото з Cloudinary
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * Завантаження категорій
   */
  useEffect(() => {
    api.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

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
    if (!files) return;

    e.target.value = "";

    const freeSlots = MAX_IMAGES - form.imagesUrls.length;
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

      setForm((prev) => ({
        ...prev,
        imagesUrls: [...prev.imagesUrls, ...res.data.urls],
      }));
    } finally {
      setUploading(false);
    }
  };

  /**
   * Видалення фото (тільки URL)
   */
  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      imagesUrls: prev.imagesUrls.filter((i) => i !== url),
    }));
  };

  /**
   * Зробити фото головним (перше в масиві)
   */
  const makeMainImage = (index: number) => {
    setForm((prev) => {
      const images = [...prev.imagesUrls];
      const [selected] = images.splice(index, 1);
      images.unshift(selected);
      return { ...prev, imagesUrls: images };
    });
  };

  /**
   * Створення товару
   * ❗ Відправляємо FormData, як у Swagger
   */
  const saveProduct = async () => {
    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));
    fd.append("category", form.category);
    fd.append("description", form.description);

    // Swagger: imagesUrls[]
    form.imagesUrls.forEach((url) => {
      fd.append("imagesUrls", url);
    });

    setSaving(true);
    try {
      await api.post("/api/products", fd);
      navigate("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Створення товару</h1>

      {/* Назва товару */}
      <Input
        placeholder="Назва товару"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Ціна */}
      <Input
        type="number"
        placeholder="Ціна"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: +e.target.value })}
      />

      {/* Кількість */}
      <Input
        type="number"
        placeholder="Кількість"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: +e.target.value })}
      />

      {/* Категорія */}
      <Select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Оберіть категорію</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </Select>

      {/* Опис */}
      <textarea
        className="w-full border p-2"
        rows={4}
        placeholder="Опис товару"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* Фото */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        accept="image/*"
        onChange={uploadImages}
      />

      <Button onClick={openFilePicker} disabled={uploading}>
        Додати фото
      </Button>

      <div className="flex gap-2 flex-wrap">
        {form.imagesUrls.map((url, i) => (
          <div key={url} className="relative w-24 h-24">
            <img src={url} alt="Фото товару" className="w-full h-full object-cover"/>
            <button onClick={() => removeImage(url)}>✕</button>
            {i !== 0 && (
              <button onClick={() => makeMainImage(i)}>Головне</button>
            )}
          </div>
        ))}
      </div>

      <Button onClick={saveProduct} disabled={saving}>
        Створити товар
      </Button>
    </div>
  );
  }
