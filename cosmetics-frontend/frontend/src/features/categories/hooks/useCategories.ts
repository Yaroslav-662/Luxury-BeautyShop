// src/features/categories/hooks/useCategories.ts

import { create } from "zustand";
import { CategoriesApi } from "../api/categories.api";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../model/category.types";

interface CategoriesState {
  items: Category[];
  selected: Category | null;
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  createCategory: (dto: CreateCategoryDto) => Promise<Category | null>;
  updateCategory: (id: string, dto: UpdateCategoryDto) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategories = create<CategoriesState>((set, get) => ({
  items: [],
  selected: null,
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const items = await CategoriesApi.getAll();
      set({ items, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося завантажити категорії",
        loading: false,
      });
    }
  },

  fetchCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const selected = await CategoriesApi.getOne(id);
      set({ selected, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Категорію не знайдено",
        loading: false,
      });
    }
  },

  createCategory: async (dto) => {
    try {
      const cat = await CategoriesApi.create(dto);
      set({ items: [cat, ...get().items] });
      return cat;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося створити категорію",
      });
      return null;
    }
  },

  updateCategory: async (id, dto) => {
    try {
      const updated = await CategoriesApi.update(id, dto);
      set({
        items: get().items.map((c) => (c._id === id ? updated : c)),
        selected: updated,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося оновити категорію",
      });
      return null;
    }
  },

  deleteCategory: async (id) => {
    try {
      await CategoriesApi.delete(id);
      set({
        items: get().items.filter((c) => c._id !== id),
        selected: get().selected?._id === id ? null : get().selected,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося видалити категорію",
      });
    }
  },
}));
