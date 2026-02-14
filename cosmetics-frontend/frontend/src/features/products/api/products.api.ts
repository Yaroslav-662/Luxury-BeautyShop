// src/features/products/api/products.api.ts
import { api } from "@/core/api/axios";
import type { Product, CreateProductDto, UpdateProductDto } from "../model/product.types";

export type ProductsPagedResponse = {
  total: number;
  page: number;
  totalPages: number;
  products: Product[];
};

// якщо бекенд може інколи повернути масив — зробимо нормалізацію
function normalizeProductsResponse(data: any): ProductsPagedResponse {
  // case A: бекенд повернув масив напряму
  if (Array.isArray(data)) {
    return {
      total: data.length,
      page: 1,
      totalPages: 1,
      products: data,
    };
  }

  // case B: бекенд повернув обʼєкт як у тебе
  if (data && Array.isArray(data.products)) {
    return {
      total: Number(data.total ?? data.products.length ?? 0),
      page: Number(data.page ?? 1),
      totalPages: Number(data.totalPages ?? 1),
      products: data.products,
    };
  }

  // fallback: щоб не падало
  return { total: 0, page: 1, totalPages: 1, products: [] };
}

export const ProductsApi = {
  // ✅ повертає ПЕЙДЖИНГ + масив products
  async getAll(params?: { page?: number; q?: string }): Promise<ProductsPagedResponse> {
    const { data } = await api.get("/api/products", {
      params,
      withCredentials: true, // важливо якщо куки-автентифікація
    });

    return normalizeProductsResponse(data);
  },

  async getOne(id: string): Promise<Product> {
    const { data } = await api.get(`/api/products/${id}`, { withCredentials: true });
    return data;
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await api.post("/api/products", dto, { withCredentials: true });
    return data;
  },

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { data } = await api.put(`/api/products/${id}`, dto, { withCredentials: true });
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/api/products/${id}`, { withCredentials: true });
    return data;
  },
};
