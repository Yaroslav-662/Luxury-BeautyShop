// src/sockets/ws-events.ts
import { io } from "socket.io-client";
import { tokenStore } from "@/core/auth/tokenStore";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface OrderCreatePayload {
  items: {
    product: string;
    quantity: number;
  }[];
  address: string;
  paymentMethod: "card" | "cash";
}

export interface OrderStatusPayload {
  orderId: string;
  status: string;
}

export interface MessagePayload {
  text: string;
  room?: string;
}

export type PresenceStatus = "online" | "offline" | "away";

export const socket = io(API_URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: (cb) => {
    const token = tokenStore.getAccessToken();
    cb({ token });
  },
});

export const initSocket = () => {
  if (socket.connected) return;

  socket.connect();

  socket.on("connect", () => {
    console.log("🟢 WebSocket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected");
  });

  socket.on("order:updated", (data: unknown) => {
    console.log("📦 Order updated:", data);
  });

  socket.on("presence:update", (data: unknown) => {
    console.log("🟠 Presence updated:", data);
  });

  socket.on("message", (msg: MessagePayload) => {
    console.log("💬 Message received:", msg);
  });

  socket.on("whoami", (info: unknown) => {
    console.log("🪪 User info:", info);
  });
};

export const socketAPI = {
  createOrder: (payload: OrderCreatePayload) =>
    socket.emit("order:create", payload),

  updateOrderStatus: (payload: OrderStatusPayload) =>
    socket.emit("order:updateStatus", payload),

  sendPresence: (status: PresenceStatus) =>
    socket.emit("presence:update", { status }),

  joinRoom: (room: string) =>
    socket.emit("joinRoom", room),

  leaveRoom: (room: string) =>
    socket.emit("leaveRoom", room),

  sendMessage: (payload: MessagePayload) =>
    socket.emit("message", payload),

  whoAmI: () =>
    socket.emit("whoami"),
};
