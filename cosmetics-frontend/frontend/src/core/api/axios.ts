// src/core/api/axios.ts
import axios from "axios";
import { API_URL } from "@/core/config/env";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // якщо в тебе refresh/access cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // або звідки ти береш
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // щоб не падало HTML -> JSON
    const contentType = err?.response?.headers?.["content-type"] || "";
    if (contentType.includes("text/html")) {
      err.message = "Server returned HTML (maybe proxy/timeout).";
    }
    return Promise.reject(err);
  }
);
