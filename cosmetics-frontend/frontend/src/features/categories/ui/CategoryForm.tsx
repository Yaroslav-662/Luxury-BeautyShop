// src/features/categories/ui/CategoryForm.tsx

import React, { useEffect, useState } from "react";
import type { Category } from "../model/category.types";
import Button from "@/shared/ui/Button";

interface Props {
  initialValues?: Partial<Category>;
  onSubmit: (dto: { name: string; description?: string }) => void;
}

export const CategoryForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name ?? "");
      setDescription(initialValues.description ?? "");
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description?.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4"
    >
      <div>
        <label className="text-xs text-neutral-400 mb-1 block">
          Назва категорії
        </label>
        <input
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 mb-1 block">
          Опис
        </label>
        <textarea
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Зберегти
      </Button>
    </form>
  );
};
