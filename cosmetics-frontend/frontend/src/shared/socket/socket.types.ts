// src/shared/socket/socket.types.ts

export type UserRole = "user" | "admin";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  product: string; // product id
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
  user?: OrderUser | string; // бекенд може повертати populated object або просто id
  items: OrderItem[];
  address?: string;
  paymentMethod?: string;

  status: OrderStatus;
  total: number;

  createdAt: string;
  updatedAt?: string;
};

export type OrdersUpdatedPayload = {
  orders: Order[];
};

export type OrderStatusUpdatedPayload = {
  orderId: string;
  status: OrderStatus;
};

// ✅ Server → Client events
export type ServerToClientEvents = {
  "orders:updated": (payload: OrdersUpdatedPayload) => void;
  "orderStatusUpdated": (payload: OrderStatusUpdatedPayload) => void;

  // можна додати:
  // "order:created": (payload: { order: Order }) => void;
};

// ✅ Client → Server events
export type ClientToServerEvents = {
  "order:updateStatus": (payload: { orderId: string; status: OrderStatus }) => void;
};

// якщо захочеш typed socket.data
export type SocketData = {
  user?: { id: string; role: UserRole };
};
