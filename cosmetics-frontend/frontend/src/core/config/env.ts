// src/core/config/env.ts

const rawApiUrl =
  import.meta.env.VITE_API_URL ??
  "https://ecommerce-backend-mgfu.onrender.com";

// ⛔ гарантовано без "string" і без "/" в кінці
export const API_URL =
  typeof rawApiUrl === "string"
    ? rawApiUrl.replace(/\/+$/, "")
    : "https://ecommerce-backend-mgfu.onrender.com";

export const SOCKET_URL = API_URL;

export const IS_DEV = import.meta.env.MODE === "development";
export const IS_PROD = import.meta.env.MODE === "production";
