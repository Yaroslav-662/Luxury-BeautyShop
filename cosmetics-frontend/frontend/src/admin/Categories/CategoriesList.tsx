import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { AdminShell } from "@/admin/_ui/AdminShell";
import { adminDeleteCategory, adminGetCategories, CategoryDTO } from "@/admin/api/admin.api";

export default function CategoriesList() {
  const [items, setItems] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetCategories();
      setItems(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Видалити категорію?")) return;
    await adminDeleteCategory(id);
    await load();
  }

  return (
    <>
      <MetaTags title="Admin — Categories" />
      <AdminShell
        title="Categories"
        subtitle="CRUD категорій: /api/categories"
        right={
          <Link to="/admin/categories/create">
            <Button>+ Add category</Button>
          </Link>
        }
      >
        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Description</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c._id} className="border-b border-neutral-900">
                    <td className="py-3 text-white font-medium">
                      <div className="flex flex-col">
                        <span>{c.name}</span>
                        <span className="text-xs text-neutral-500">ID: {c._id}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-300">{c.description || "—"}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/categories/${c._id}/edit`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        <Button variant="danger" onClick={() => onDelete(c._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-neutral-400">
                      Немає категорій.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </>
  );
}