// src/features/categories/ui/CategorySelect.tsx

import React, { useEffect } from "react";
import { useCategories } from "../hooks/useCategories";

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

export const CategorySelect: React.FC<Props> = ({ value, onChange }) => {
  const { items, fetchCategories } = useCategories();

  useEffect(() => {
    if (!items.length) fetchCategories();
  }, []);

  return (
    <select
      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Оберіть категорію</option>
      {items.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>
  );
};
