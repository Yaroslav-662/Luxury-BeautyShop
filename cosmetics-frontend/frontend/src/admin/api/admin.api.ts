// src/admin/api/admin.api.ts
import { api } from "@/core/api/axios";

// PRODUCTS
export type ProductDTO = {
  _id: string;
  name: string;
  price: number;
  category?: any; // string або populated object
  description?: string;
  stock?: number;
  images?: string[];
  createdAt?: string;
};

export type ProductsListResponse = {
  total: number;
  page: number;
  totalPages: number;
  products: ProductDTO[];
};

export async function adminGetProducts(params?: { page?: number; q?: string }) {
  const { data } = await api.get<ProductsListResponse>("/api/products", {
    params,
    withCredentials: true,
  });
  return data;
}

export async function adminGetProduct(id: string) {
  const { data } = await api.get<ProductDTO>(`/api/products/${id}`, {
    withCredentials: true,
  });
  return data;
}

export async function adminCreateProduct(payload: {
  name: string;
  price: number;
  category?: string;
  description?: string;
  stock?: number;
  images?: string[];
}) {
  const { data } = await api.post("/api/products", payload, { withCredentials: true });
  return data;
}

export async function adminUpdateProduct(
  id: string,
  payload: Partial<{
    name: string;
    price: number;
    category: string;
    description: string;
    stock: number;
    images: string[];
  }>
) {
  const { data } = await api.put(`/api/products/${id}`, payload, { withCredentials: true });
  return data;
}


export async function adminDeleteProduct(id: string) {
  const { data } = await api.delete(`/api/products/${id}`, {
    withCredentials: true,
  });
  return data;
}

// ✅ NEW: upload 1..10 product images -> urls[]
export async function adminUploadProductImages(files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));

  const { data } = await api.post("/api/upload/products", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data; // { urls: [...] }
}

export async function adminDeleteProductImageByUrl(url: string) {
  const { data } = await api.delete("/api/upload/by-url", {
    data: { url },
    withCredentials: true,
  });
  return data;
}




// CATEGORIES
export type CategoryDTO = { _id: string; name: string; description?: string };

export async function adminGetCategories() {
  const { data } = await api.get<CategoryDTO[]>("/api/categories", { withCredentials: true });
  return data;
}

export async function adminGetCategory(id: string) {
  const { data } = await api.get<CategoryDTO>(`/api/categories/${id}`, { withCredentials: true });
  return data;
}

export async function adminCreateCategory(payload: { name: string; description?: string }) {
  const { data } = await api.post("/api/categories", payload, { withCredentials: true });
  return data;
}

export async function adminUpdateCategory(id: string, payload: { name: string; description?: string }) {
  const { data } = await api.put(`/api/categories/${id}`, payload, { withCredentials: true });
  return data;
}

export async function adminDeleteCategory(id: string) {
  const { data } = await api.delete(`/api/categories/${id}`, { withCredentials: true });
  return data;
}

// ORDERS
export type OrderItemDTO = { product: any; quantity: number };
export type OrderDTO = {
  _id: string;
  user?: any;
  items: OrderItemDTO[];
  total?: number;
  status?: string;
  address?: string;
  paymentMethod?: string;
  createdAt?: string;
};

export async function adminGetOrders() {
  const { data } = await api.get<OrderDTO[]>("/api/orders", { withCredentials: true });
  return data;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  const { data } = await api.put(`/api/orders/${id}`, { status }, { withCredentials: true });
  return data;
}

// USERS
export type UserDTO = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified?: boolean;
  createdAt?: string;
};

export type UsersListResponse = {
  total: number;
  page: number;
  totalPages: number;
  users: UserDTO[];
};

export async function adminGetUsers(params?: { search?: string; role?: string; page?: number; limit?: number }) {
  const { data } = await api.get<UsersListResponse>("/api/users", { params, withCredentials: true });
  return data;
}

export async function adminGetUser(id: string) {
  const { data } = await api.get<UserDTO>(`/api/users/${id}`, { withCredentials: true });
  return data;
}

export async function adminSetUserRole(id: string, role: "user" | "admin") {
  const { data } = await api.put(`/api/users/${id}/role`, { role }, { withCredentials: true });
  return data;
}

export async function adminDeleteUser(id: string) {
  const { data } = await api.delete(`/api/users/${id}`, { withCredentials: true });
  return data;
}

// REVIEWS
export type ReviewDTO = {
  _id: string;
  product: any;
  user: any;
  rating: number;
  comment?: string;
  createdAt?: string;
};

export async function adminGetReviews(params?: { product?: string }) {
  const { data } = await api.get<ReviewDTO[]>("/api/reviews", { params, withCredentials: true });
  return data;
}

export async function adminDeleteReview(id: string) {
  const { data } = await api.delete(`/api/reviews/${id}`, { withCredentials: true });
  return data;
}

// UPLOADS (general files list, rename, delete)
export type UploadedFileDTO = {
  name: string;
  size: number;
  createdAt: string;
  path: string;
  url: string;
};

export async function adminGetFiles() {
  const { data } = await api.get<{ files: UploadedFileDTO[] }>("/api/upload", {
    withCredentials: true,
  });
  return data.files;
}


export async function adminUploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const { data } = await api.post("/api/upload/file", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return data;
}

export async function adminDeleteFile(name: string) {
  const { data } = await api.delete(`/api/upload/${encodeURIComponent(name)}`, { withCredentials: true });
  return data;
}

export async function adminRenameFile(oldName: string, newName: string) {
  const { data } = await api.put("/api/upload/rename", { oldName, newName }, { withCredentials: true });
  return data;
}





