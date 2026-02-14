export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ecommerce-backend-mgfu.onrender.com/";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_URL;

export const IS_DEV = import.meta.env;
export const IS_PROD = import.meta.env;
