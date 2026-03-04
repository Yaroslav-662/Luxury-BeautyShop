// src/core/config/env.ts

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  "https://ecommerce-backend-mgfu.onrender.com";

// ❗ прибираємо слеш в кінці, якщо він є
export const API_URL = rawApiUrl.replace(/\/$/, "");

// якщо сокет — використовуємо ту ж адресу
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, "") || API_URL;

// коректні boolean прапори
export const IS_DEV = import.meta.env.MODE === "development";
export const IS_PROD = import.meta.env.MODE === "production";
