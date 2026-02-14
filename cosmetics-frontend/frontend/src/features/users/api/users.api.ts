// src/features/users/api/users.api.ts

import { api } from "@/core/api/axios";
import type {
  User,
  UpdateMeDto,
  ChangePasswordDto,
  UsersQuery,
  UserRole,
} from "../model/user.types";

export const UsersApi = {
  // ---- Self (поточний користувач) ----
  async getMe(): Promise<User> {
    const { data } = await api.get("/api/users/me");
    return data;
  },

  async updateMe(form: FormData): Promise<User> {
    const { data } = await api.put("/api/users/me", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deactivateMe(): Promise<{ message: string }> {
    const { data } = await api.put("/api/users/me/deactivate");
    return data;
  },

  async changeMyPassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const { data } = await api.put("/api/users/me/password", dto);
    return data;
  },

  async sendVerifyEmail(): Promise<{ message: string }> {
    const { data } = await api.post("/api/users/verify/send");
    return data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await api.get(`/api/users/verify/${token}`);
    return data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post("/api/users/forgot", { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const { data } = await api.post(`/api/users/reset/${token}`, { password });
    return data;
  },

  // ---- Admin ----
  async getUsers(params?: UsersQuery): Promise<User[]> {
    const { data } = await api.get("/api/users", { params });
    return data;
  }

  ,
  async getUser(id: string): Promise<User> {
    const { data } = await api.get(`/api/users/${id}`);
    return data;
  },

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const { data } = await api.put(`/api/users/${id}/role`, { role });
    return data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const { data } = await api.delete(`/api/users/${id}`);
    return data;
  },
};
