// src/features/products/hooks/useProducts.ts
import { create } from "zustand";
import { ProductsApi } from "../api/products.api";
import type { Product, CreateProductDto, UpdateProductDto } from "../model/product.types";

interface ProductsState {
  items: Product[];
  selected: Product | null;

  // ✅ paging + search
  page: number;
  total: number;
  totalPages: number;
  q: string;

  loading: boolean;
  error: string | null;

  // actions
  setPage: (page: number) => void;
  setQuery: (q: string) => void;
  reset: () => void;

  fetchProducts: (opts?: { page?: number; q?: string }) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (dto: CreateProductDto) => Promise<Product | null>;
  updateProduct: (id: string, dto: UpdateProductDto) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const initialState = {
  items: [] as Product[],
  selected: null as Product | null,

  page: 1,
  total: 0,
  totalPages: 1,
  q: "",

  loading: false,
  error: null as string | null,
};

export const useProducts = create<ProductsState>((set, get) => ({
  ...initialState,

  setPage: (page) => set({ page }),
  setQuery: (q) => set({ q }),

  reset: () => set({ ...initialState }),

  // ✅ головне: завжди кладемо items як масив
  fetchProducts: async (opts) => {
    const page = opts?.page ?? get().page ?? 1;
    const q = opts?.q ?? get().q ?? "";

    set({ loading: true, error: null });

    try {
      const res = await ProductsApi.getAll({ page, q });

      set({
        items: Array.isArray(res.products) ? res.products : [],
        page: res.page ?? page,
        total: res.total ?? 0,
        totalPages: res.totalPages ?? 1,
        q,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Помилка при завантаженні товарів",
        loading: false,
        items: [], // щоб UI не ламався
        total: 0,
        totalPages: 1,
      });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await ProductsApi.getOne(id);
      set({ selected: product, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Товар не знайдено",
        selected: null,
        loading: false,
      });
    }
  },

  createProduct: async (dto) => {
    set({ error: null });
    try {
      const product = await ProductsApi.create(dto);

      // ✅ додаємо на початок
      set({ items: [product, ...get().items], total: get().total + 1 });

      return product;
    } catch (err: any) {
      set({ error: err?.message || "Помилка створення товару" });
      return null;
    }
  },

  updateProduct: async (id, dto) => {
    set({ error: null });
    try {
      const updated = await ProductsApi.update(id, dto);

      set({
        items: get().items.map((p) => (p._id === id ? updated : p)),
        selected: get().selected?._id === id ? updated : get().selected,
      });

      return updated;
    } catch (err: any) {
      set({ error: err?.message || "Помилка оновлення товару" });
      return null;
    }
  },

  deleteProduct: async (id) => {
    set({ error: null });
    try {
      await ProductsApi.delete(id);

      const before = get().items.length;
      const next = get().items.filter((p) => p._id !== id);
      const removed = before !== next.length;

      set({
        items: next,
        total: Math.max(0, get().total - (removed ? 1 : 0)),
        selected: get().selected?._id === id ? null : get().selected,
      });

      return true;
    } catch (err: any) {
      set({ error: err?.message || "Помилка видалення товару" });
      return false;
    }
  },
}));
