// src/app/providers/socket.types.ts

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderUser = {
  _id: string;
  email?: string;
  name?: string;
};

export type OrderDTO = {
  _id: string;
  user?: string | OrderUser;
  total?: number;
  items?: { quantity?: number }[];
  status?: OrderStatus;
  paymentMethod?: string;
  address?: string;
  createdAt: string;
};

// ✅ Server → Client events (ОСЬ ТУТ ДОДАЄМО ТВОЇ ПОДІЇ)
export type ServerToClientEvents = {
  "orders:updated": (payload: any) => void;
  "orderStatusUpdated": (payload: any) => void;
  "order:updated": (payload: any) => void;
};

// ✅ Client → Server events (поки пусто, можна додати потім)
export type ClientToServerEvents = Record<string, (...args: any[]) => void>;
