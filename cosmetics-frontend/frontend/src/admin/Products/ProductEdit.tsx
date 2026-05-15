// src/admin/Products/ProductEdit.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/core/api/axios";

type Category = { _id: string; name: string };

type ProductForm = {
  _id: string;
  name: string;
  price: number | "";
  stock: number | "";
  category: string;
  description: string;
  images: string[];
};

const MAX_IMAGES = 10;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<ProductForm | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Завантаження товару і категорій
  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/api/products/${id}`),
      api.get("/api/categories"),
    ]).then(([productRes, catRes]) => {
      const p = productRes.data;
      setProduct({
        _id: p._id,
        name: p.name || "",
        price: p.price ?? "",
        stock: p.stock ?? "",
        category: typeof p.category === "object" ? p.category?._id : p.category || "",
        description: p.description || "",
        images: Array.isArray(p.images) ? p.images : [],
      });
      setCategories(catRes.data);
    }).catch(() => setError("Не вдалося завантажити товар"))
      .finally(() => setLoading(false));
  }, [id]);

  // Завантаження фото → Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !product) return;

    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);

    const freeSlots = MAX_IMAGES - product.images.length;
    const selected = Array.from(files).slice(0, freeSlots);

    const fd = new FormData();
    selected.forEach((file) => fd.append("images", file, file.name));

    setUploading(true);
    try {
      const res = await api.post<{ urls: string[] }>(
        "/api/upload/products",
        fd,
        { headers: { "Content-Type": undefined } }
      );

      const urls = Array.isArray(res.data?.urls) ? res.data.urls.filter(Boolean) : [];
      if (!urls.length) throw new Error("Бекенд не повернув URL");

      setProduct((prev) => prev ? { ...prev, images: [...prev.images, ...urls] } : prev);
    } catch (err: any) {
      setError(`❌ Помилка завантаження: ${err?.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    if (!product) return;
    setProduct({ ...product, images: product.images.filter((img) => img !== url) });
  };

  const makeMain = (index: number) => {
    if (!product) return;
    const imgs = [...product.images];
    const [selected] = imgs.splice(index, 1);
    imgs.unshift(selected);
    setProduct({ ...product, images: imgs });
  };

  // Збереження
  const handleSave = async () => {
    if (!product) return;
    if (!product.name.trim()) return setError("Введіть назву товару");
    if (!product.price) return setError("Введіть ціну");

    setError(null);
    setSaving(true);

    try {
      await api.put(`/api/products/${product._id}`, {
        name: product.name.trim(),
        price: Number(product.price),
        stock: Number(product.stock) || 0,
        category: product.category || undefined,
        description: product.description.trim(),
        imagesUrls: product.images,
      });

      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Не вдалося зберегти товар");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-neutral-400">Завантаження…</div>;
  if (!product) return <div className="p-6 text-red-400">Товар не знайдено</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редагування товару</h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="text-sm text-neutral-400 hover:text-neutral-600"
        >
          ← Назад
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✅ Збережено! Перенаправлення...
        </div>
      )}

      {/* Назва */}
      <div>
        <label className="block text-sm font-medium mb-1">Назва товару *</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
      </div>

      {/* Ціна / Кількість */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ціна (грн) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value === "" ? "" : Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Кількість на складі</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value === "" ? "" : Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Категорія */}
      <div>
        <label className="block text-sm font-medium mb-1">Категорія</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        >
          <option value="">Без категорії</option>
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
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
      </div>

      {/* Фото */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Фото товару ({product.images.length}/{MAX_IMAGES})
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Превʼю */}
        {product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-3">
            {product.images.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Фото ${index + 1}`}
                  className={`h-20 w-full object-cover rounded-lg border-2 transition-colors ${
                    index === 0 ? "border-yellow-400" : "border-transparent"
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=?";
                  }}
                />
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded">
                    Головне
                  </span>
                )}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(index)}
                      title="Зробити головним"
                      className="bg-yellow-400 text-black text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    title="Видалити"
                    className="bg-red-500 text-white text-[10px] w-5 h-5 rounded flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {product.images.length < MAX_IMAGES && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "⏳ Завантаження на Cloudinary..." : "📎 Додати фото"}
          </button>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-2 border-t">
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>
        <button
          onClick={() => navigate("/admin/products")}
          disabled={saving}
          className="border px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default ProductEdit;
