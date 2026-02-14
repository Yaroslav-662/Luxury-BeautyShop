// src/features/products/ui/ProductForm.tsx

import React from "react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { CategorySelect } from "@/features/categories/ui/CategorySelect";

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  isActive: boolean;
};

interface Props {
  value: ProductFormData;
  onChange: (v: ProductFormData) => void;
  onSubmit: (dto: ProductFormData) => void;
  loading?: boolean;
}

export const ProductForm: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  loading = false,
}) => {
  const submit = () => {
    onSubmit(value);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Назва товару"
        value={value.name}
        onChange={(e) =>
          onChange({ ...value, name: e.target.value })
        }
      />

      <textarea
        className="w-full rounded-xl bg-neutral-900 p-3"
        placeholder="Опис"
        value={value.description}
        onChange={(e) =>
          onChange({ ...value, description: e.target.value })
        }
      />

      <Input
        type="number"
        placeholder="Ціна"
        value={value.price}
        onChange={(e) =>
          onChange({ ...value, price: Number(e.target.value) })
        }
      />

      <CategorySelect
        value={value.categoryId}
        onChange={(id: string) =>
          onChange({ ...value, categoryId: id })
        }
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.isActive}
          onChange={(e) =>
            onChange({ ...value, isActive: e.target.checked })
          }
        />
        Активний товар
      </label>

      <Button type="button" onClick={submit} disabled={loading}>
        {loading ? "Saving…" : "Save product"}
      </Button>
    </div>
  );
};
