// src/core/api/axios.ts
import axios from "axios";
import { API_URL } from "@/core/config/env";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const contentType = error?.response?.headers?.["content-type"] || "";
    if (contentType.includes("text/html")) {
      error.message = "Server returned HTML instead of JSON (timeout / proxy / crash).";
    }
    return Promise.reject(error);
  }
);
