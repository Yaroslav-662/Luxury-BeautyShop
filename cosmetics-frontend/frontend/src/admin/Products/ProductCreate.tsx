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
    discount: "",       // ✅ знижка %
    imagesUrls: [] as string[],
  });

  useEffect(() => {
    api.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // ─── Завантаження фото → Cloudinary ───────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);

    const freeSlots = MAX_IMAGES - form.imagesUrls.length;
    if (freeSlots <= 0) return setError(`Максимум ${MAX_IMAGES} фото.`);

    const selected = Array.from(files).slice(0, freeSlots);
    const fd = new FormData();
    selected.forEach((file) => fd.append("images", file, file.name));
    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploading(true);
    try {
      const res = await api.post<{ urls: string[] }>(
        "/api/upload/products", fd,
        { headers: { "Content-Type": undefined } }
      );
      const urls = Array.isArray(res.data?.urls) ? res.data.urls.filter(Boolean) : [];
      if (!urls.length) throw new Error("Бекенд не повернув URL");
      setForm((prev) => ({ ...prev, imagesUrls: [...prev.imagesUrls, ...urls] }));
    } catch (err: any) {
      setError(`❌ Помилка завантаження: ${err?.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) =>
    setForm((prev) => ({ ...prev, imagesUrls: prev.imagesUrls.filter((u) => u !== url) }));

  // ─── Розрахунок ціни зі знижкою для preview ───────────────────────────────
  const discountNum = Number(form.discount) || 0;
  const priceNum = Number(form.price) || 0;
  const finalPrice = discountNum > 0
    ? Math.round(priceNum * (1 - discountNum / 100))
    : priceNum;

  // ─── Збереження ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError("Введіть назву товару");
    if (!form.price || isNaN(Number(form.price))) return setError("Введіть коректну ціну");

    setSaving(true);
    try {
      await api.post("/api/products", {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: form.category || undefined,
        description: form.description.trim(),
        discount: discountNum,
        imagesUrls: form.imagesUrls,
      });
      navigate("/admin/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Не вдалося створити товар");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Створення товару</h1>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Назва */}
        <div>
          <label className="block text-sm font-medium mb-1">Назва товару *</label>
          <input
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Ціна / Кількість / Знижка */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ціна (₴) *</label>
            <input
              type="number" min="0" step="0.01" required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Кількість</label>
            <input
              type="number" min="0"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Знижка (%)</label>
            <input
              type="number" min="0" max="100"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </div>
        </div>

        {/* Preview ціни зі знижкою */}
        {discountNum > 0 && priceNum > 0 && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <span className="text-sm text-neutral-500 line-through">{priceNum} ₴</span>
            <span className="text-green-700 font-bold text-lg">{finalPrice} ₴</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">-{discountNum}%</span>
          </div>
        )}

        {/* Категорія */}
        <div>
          <label className="block text-sm font-medium mb-1">Категорія</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Оберіть категорію</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Опис */}
        <div>
          <label className="block text-sm font-medium mb-1">Опис товару</label>
          <textarea
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Фото */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Фото товару ({form.imagesUrls.length}/{MAX_IMAGES})
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {form.imagesUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {form.imagesUrls.map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url} alt="фото"
                    className="h-28 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button" onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {form.imagesUrls.length < MAX_IMAGES && (
            <button
              type="button" disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              {uploading ? "⏳ Завантаження..." : "📎 Додати фото"}
            </button>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={saving || uploading}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Створення..." : "Створити товар"}
          </button>
          <button
            type="button" onClick={() => navigate("/admin/products")}
            className="border px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Відмінити
          </button>
        </div>
      </form>
    </div>
  );
}
