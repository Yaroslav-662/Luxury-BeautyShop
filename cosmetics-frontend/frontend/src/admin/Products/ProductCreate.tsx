// src/features/products/pages/CreateProduct.tsx
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
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    images: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Завантаження категорій з бекенду
  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const pickFiles = () => fileRef.current?.click();

  const uploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    e.target.value = "";

    const free = MAX_IMAGES - form.images.length;
    const sliced = Array.from(files).slice(0, free);

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of sliced) {
        const formData = new FormData();
        formData.append("image", file);
        // бекенд очікує POST /api/uploads/products
        const res = await api.post<{ url: string }>(
          "/api/uploads/products",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        urls.push(res.data.url);
      }
      setForm((p) => ({ ...p, images: [...p.images, ...urls] }));
    } catch (err) {
      console.error(err);
      alert("Помилка завантаження фото");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((p) => ({ ...p, images: p.images.filter((x) => x !== url) }));
  };

  const makeMain = (idx: number) => {
    setForm((p) => {
      const next = [...p.images];
      const [u] = next.splice(idx, 1);
      next.unshift(u);
      return { ...p, images: next };
    });
  };

  const saveProduct = async () => {
    if (!form.name.trim()) return alert("Назва товару обов'язкова");
    if (form.price <= 0) return alert("Ціна має бути > 0");

    setSaving(true);
    try {
      await api.post("/api/products", form);
      nav("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Помилка створення товару");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Додати новий товар</h2>

      <div className="space-y-3">
        <label htmlFor="name" className="sr-only">Назва</label>
        <Input
          id="name"
          placeholder="Назва"
          value={form.name}
          aria-label="Назва товару"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label htmlFor="price" className="sr-only">Ціна</label>
        <Input
          id="price"
          type="number"
          placeholder="Ціна"
          value={String(form.price)}
          aria-label="Ціна товару"
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />

        <label htmlFor="stock" className="sr-only">Кількість на складі</label>
        <Input
          id="stock"
          type="number"
          placeholder="Кількість на складі"
          value={String(form.stock)}
          aria-label="Кількість на складі"
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />

        <label htmlFor="category" className="sr-only">Категорія</label>
        <Select
          id="category"
          value={form.category}
          aria-label="Категорія товару"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">— Виберіть категорію —</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </Select>

        <label htmlFor="description" className="sr-only">Опис</label>
        <textarea
          id="description"
          aria-label="Опис товару"
          placeholder="Опис"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          aria-label="Завантажити фото товару"
          onChange={uploadFiles}
        />
        <Button
          onClick={pickFiles}
          disabled={form.images.length >= MAX_IMAGES || uploading}
        >
          {uploading ? "Завантаження..." : "Додати фото"}
        </Button>

        <div className="flex gap-2 mt-2 flex-wrap">
          {form.images.map((url, i) => (
            <div key={url} className="relative w-24 h-24 border rounded overflow-hidden">
              <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs"
                aria-label="Видалити фото"
              >
                X
              </button>
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => makeMain(i)}
                  className="absolute bottom-0 left-0 bg-yellow-400 text-black px-1 text-xs"
                  aria-label="Зробити головним фото"
                >
                  Main
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="text-xs mt-1">{form.images.length}/{MAX_IMAGES} фото</div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={saveProduct} disabled={saving || uploading}>
          {saving ? "Збереження..." : "Створити"}
        </Button>
        <Button variant="outline" onClick={() => nav("/admin/products")} disabled={saving}>
          Відмінити
        </Button>
      </div>
    </div>
  );
}
