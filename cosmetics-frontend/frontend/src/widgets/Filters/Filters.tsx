import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import type { ProductsFilters } from "./filters.types.ts";

interface FiltersProps {
  value: ProductsFilters;
  categories?: { id: string; name: string }[];
  brands?: { id: string; name: string }[];
  onChange: (filters: ProductsFilters) => void;
  onReset?: () => void;
}

export default function Filters({
  value,
  categories = [],
  brands = [],
  onChange,
  onReset,
}: FiltersProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-5">
      <h2 className="text-lg font-semibold text-yellow-400">
        Фільтри
      </h2>

      {/* 🔍 Пошук */}
      <div>
        <label className="text-xs text-gray-400">Пошук</label>
        <Input
          placeholder="Назва або опис..."
          value={value.search}
          onChange={(e) =>
            onChange({ ...value, search: e.target.value })
          }
        />
      </div>

      {/* 📂 Категорія */}
      <div>
        <label className="text-xs text-gray-400">Категорія</label>
        <Select
          value={value.category || ""}
          onChange={(e) =>
            onChange({
              ...value,
              category: e.target.value || undefined,
            })
          }
        >
          <option value="">Всі</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {/* 🏷️ Бренд */}
      <div>
        <label className="text-xs text-gray-400">Бренд</label>
        <Select
          value={value.brand || ""}
          onChange={(e) =>
            onChange({
              ...value,
              brand: e.target.value || undefined,
            })
          }
        >
          <option value="">Всі</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      {/* 💰 Ціна */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400">Ціна від</label>
          <Input
            type="number"
            placeholder="0"
            value={value.priceFrom ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                priceFrom: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Ціна до</label>
          <Input
            type="number"
            placeholder="9999"
            value={value.priceTo ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                priceTo: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
      </div>

      {/* 📦 Наявність */}
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={Boolean(value.inStock)}
          onChange={(e) =>
            onChange({
              ...value,
              inStock: e.target.checked || undefined,
            })
          }
        />
        В наявності
      </label>

      {/* 🔃 Сортування */}
      <div>
        <label className="text-xs text-gray-400">Сортування</label>
        <Select
          value={value.sort || ""}
          onChange={(e) =>
            onChange({
              ...value,
              sort: e.target.value as ProductsFilters["sort"],
            })
          }
        >
          <option value="">За замовчуванням</option>
          <option value="newest">Нові</option>
          <option value="price-asc">Ціна ↑</option>
          <option value="price-desc">Ціна ↓</option>
        </Select>
      </div>

      {/* ♻️ Reset */}
      {onReset && (
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          Скинути фільтри
        </Button>
      )}
    </div>
  );
}
