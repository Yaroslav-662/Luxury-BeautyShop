// src/features/categories/pages/CategoryEditPage.tsx

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { CategoryForm } from "../ui/CategoryForm";

export const CategoryEditPage: React.FC = () => {
  const { id } = useParams();
  const { selected, fetchCategory, updateCategory, loading, error } =
    useCategories();

  useEffect(() => {
    if (id) fetchCategory(id);
  }, [id]);

  if (loading || !selected) {
    return <p className="text-neutral-400 p-6">Завантаження...</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-white space-y-4">
      <h1 className="text-2xl font-bold">Редагувати категорію</h1>
      {error && <p className="text-xs text-red-400">{error}</p>}

      <CategoryForm
        initialValues={selected}
        onSubmit={(dto) => updateCategory(selected._id, dto)}
      />
    </div>
  );
};
