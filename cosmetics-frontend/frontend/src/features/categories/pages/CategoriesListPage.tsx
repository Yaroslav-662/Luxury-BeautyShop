// src/features/categories/pages/CategoriesListPage.tsx

import React, { useEffect } from "react";
import { useCategories } from "../hooks/useCategories";

export const CategoriesListPage: React.FC = () => {
  const { items, fetchCategories, loading, error } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Категорії</h1>

      {loading && (
        <p className="text-xs text-neutral-400">Завантаження...</p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}

      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c._id}
            className="bg-neutral-900/70 border border-neutral-800 rounded-xl px-4 py-3"
          >
            <p className="text-sm font-semibold text-white">{c.name}</p>
            {c.description && (
              <p className="text-xs text-neutral-400">{c.description}</p>
            )}
          </li>
        ))}
        {!items.length && !loading && (
          <p className="text-neutral-400 text-sm">
            Категорій поки немає.
          </p>
        )}
      </ul>
    </div>
  );
};
