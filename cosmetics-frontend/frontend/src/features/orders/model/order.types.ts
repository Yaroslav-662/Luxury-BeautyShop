// src/features/orders/model/order.types.ts
export type UserRole = "user" | "admin";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  product: string;
  quantity: number;
};

export type OrderUser = {
  _id: string;
  name?: string;
  email?: string;
  role?: UserRole;
};

export type Order = {
  _id: string;
  user?: OrderUser | string;

  items: OrderItem[];
  address?: string;
  paymentMethod?: string;

  status: OrderStatus;
  total: number;

  createdAt: string;
  updatedAt?: string;
};
