// src/features/products/model/product.types.ts

export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string; // або об'єкт — якщо в тебе populated
  stock: number;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductDto = {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
};

export type UpdateProductDto = Partial<CreateProductDto>;

