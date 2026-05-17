// src/features/products/model/product.types.ts
export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string | { _id: string; name: string };
  stock: number;
  images: string[];
  // Знижка
  discount?: number;        // відсоток знижки 0–100
  discountPrice?: number;   // ціна зі знижкою (може рахуватись на бекенді)
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
  discount?: number;
};

export type UpdateProductDto = Partial<CreateProductDto>;
