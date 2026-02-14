// src/features/categories/api/categories.api.ts

import { api } from "@/core/api/axios";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../model/category.types";

export const CategoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get("/api/categories");
    return data;
  },

  async getOne(id: string): Promise<Category> {
    const { data } = await api.get(`/api/categories/${id}`);
    return data;
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    const { data } = await api.post("/api/categories", dto);
    return data;
  },

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const { data } = await api.put(`/api/categories/${id}`, dto);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
  },
};
