// src/admin/Products/CreateProduct.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/core/api/axios";

interface Category {
  _id: string;
  name: string;
}

const MAX_IMAGES = 10;

export default function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imagesUrls: [] as string[],
  });

  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // ─── КРОК 1: завантажити фото на Cloudinary ───────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    const freeSlots = MAX_IMAGES - form.imagesUrls.length;
    if (freeSlots <= 0) {
      setError(`Максимум ${MAX_IMAGES} фото.`);
      return;
    }

    const selected = Array.from(files).slice(0, freeSlots);

    const fd = new FormData();
    selected.forEach((file) => {
      fd.append("images", file, file.name);
    });

    // Скидаємо input
    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploading(true);
    try {
      const res = await api.post<{ urls: string[] }>(
        "/api/upload/products",
        fd,
        {
          // НЕ вказуємо Content-Type вручну — браузер сам додасть boundary
          headers: { "Content-Type": undefined },
        }
      );

      const urls: string[] = Array.isArray(res.data?.urls)
        ? res.data.urls.filter(Boolean)
        : [];

      if (!urls.length) throw new Error("Бекенд не повернув URL");

      setForm((prev) => ({
        ...prev,
        imagesUrls: [...prev.imagesUrls, ...urls],
      }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Невідома помилка завантаження";
      setError(`❌ Помилка завантаження: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      imagesUrls: prev.imagesUrls.filter((u) => u !== url),
    }));
  };

  // ─── КРОК 2: створити продукт з готовими URL ──────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Введіть назву товару");
    if (!form.price || isNaN(Number(form.price)))
      return setError("Введіть коректну ціну");

    setSaving(true);
    try {
      await api.post("/api/products", {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: form.category || undefined,
        description: form.description.trim(),
        imagesUrls: form.imagesUrls,
      });

      navigate("/admin/products");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Невідома помилка";
      setError(`❌ Не вдалося створити товар: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Створення товару</h1>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Назва */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Назва товару *
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Ціна / Кількість */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Ціна (грн) *
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="stock">
              Кількість
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>

        {/* Категорія */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">
            Категорія
          </label>
          <select
            id="category"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Оберіть категорію</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Опис */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            Опис товару
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Фото */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Фото товару ({form.imagesUrls.length}/{MAX_IMAGES})
          </label>

          {/* Прихований input — керується виключно через ref.click() */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Превʼю завантажених фото */}
          {form.imagesUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {form.imagesUrls.map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt="фото товару"
                    className="h-28 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Кнопка відкриває file picker через ref */}
          {form.imagesUrls.length < MAX_IMAGES && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 border rounded px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "⏳ Завантаження на Cloudinary..." : "📎 Додати фото"}
            </button>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Створення..." : "Створити товар"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            disabled={saving}
            className="border px-6 py-2 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Відмінити
          </button>
        </div>
      </form>
    </div>
  );
}
