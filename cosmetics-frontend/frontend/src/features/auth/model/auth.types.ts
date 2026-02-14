// src/features/auth/model/auth.types.ts

export type UserRole = "user" | "admin";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface SessionInfo {
  token: string;
  userAgent: string;
  ip?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface LoginHistoryEntry {
  ip: string;
  userAgent: string;
  createdAt: string;
  location?: string;
}

export interface TwoFASetupResponse {
  qrCode: string;
  secret: string;
}
