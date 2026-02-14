// src/features/users/model/user.types.ts

export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateMeDto {
  name?: string;
  email?: string;
  password?: string; // опціонально, якщо хочеш міняти з профілю
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UsersQuery {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}
