// src/features/categories/pages/CategoriesPage.tsx

import React, { useEffect } from "react";
import { useCategories } from "../hooks/useCategories";
import { CategoryForm } from "../ui/CategoryForm";
import  Button  from "@/shared/ui/Button";
import { useNavigate } from "react-router-dom";

export const CategoriesPage: React.FC = () => {
  const { items, fetchCategories, createCategory, deleteCategory, error, loading } =
    useCategories();
  const nav = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Категорії</h1>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {loading && <p className="text-xs text-neutral-400">Завантаження...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-neutral-200">
            Список категорій
          </h2>
          <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/70">
            <table className="min-w-full text-sm">
              <thead className="border-b border-neutral-800 bg-neutral-900">
                <tr>
                  <th className="px-4 py-3 text-left text-neutral-400">
                    Назва
                  </th>
                  <th className="px-4 py-3 text-left text-neutral-400">
                    Опис
                  </th>
                  <th className="px-4 py-3 text-left text-neutral-400">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <td className="px-4 py-3 text-neutral-100">{c.name}</td>
                    <td className="px-4 py-3 text-neutral-300">
                      {c.description}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => nav(`/admin/categories/${c._id}`)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteCategory(c._id)}
                      >
                        Видалити
                      </Button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-neutral-400"
                    >
                      Категорій ще немає.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-200 mb-2">
            Нова категорія
          </h2>
          <CategoryForm
            onSubmit={(dto) => {
              createCategory(dto);
            }}
          />
        </div>
      </div>
    </div>
  );
};
