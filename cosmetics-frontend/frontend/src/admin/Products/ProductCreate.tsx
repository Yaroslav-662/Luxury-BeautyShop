// src/admin/pages/CreateProduct.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/core/api/axios";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

interface Category {
  _id: string;
  name: string;
}

const MAX_IMAGES = 10;

export default function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    imagesUrls: [] as string[],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    e.target.value = "";
    setError(null);

    const freeSlots = MAX_IMAGES - form.imagesUrls.length;
    const selected = Array.from(files).slice(0, freeSlots);

    const fd = new FormData();
    selected.forEach(file => fd.append("images", file));

    setUploading(true);
    try {
      const res = await api.post<{ urls: string[] }>(
        "/api/upload/products",
        fd
      );

      setForm(prev => ({
        ...prev,
        imagesUrls: [...prev.imagesUrls, ...res.data.urls],
      }));
    } catch {
      setError("❌ Помилка завантаження фото. Перевір бекенд / Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async () => {
    setSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));
    fd.append("category", form.category);
    fd.append("description", form.description);

    form.imagesUrls.forEach(url => fd.append("imagesUrls", url));

    try {
      await api.post("/api/products", fd);
      navigate("/admin/products");
    } catch {
      setError("❌ Не вдалося створити товар");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Створення товару</h1>

      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label htmlFor="name">Назва товару</label>
        <Input
          id="name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="price">Ціна</label>
        <Input
          id="price"
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: +e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="stock">Кількість</label>
        <Input
          id="stock"
          type="number"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: +e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="category">Категорія</label>
        <Select
          id="category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Оберіть категорію</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="description">Опис товару</label>
        <textarea
          id="description"
          className="w-full border p-2 rounded"
          rows={4}
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <div>
        <label>Фото товару</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={uploadImages}
        />

        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? "Завантаження..." : "Додати фото"}
        </Button>

        {form.imagesUrls.length > 0 && (
          <div className="mt-3 space-y-2">
            <strong>URL завантажених фото:</strong>
            {form.imagesUrls.map(url => (
              <div key={url} className="text-xs break-all">
                {url}
              </div>
            ))}
          </div>
        )}
      </div>

      <Button onClick={saveProduct} disabled={saving || uploading}>
        {saving ? "Створення..." : "Створити товар"}
      </Button>
    </div>
  );
}
