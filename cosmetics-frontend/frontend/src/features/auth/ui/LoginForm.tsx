// src/features/auth/ui/LoginForm.tsx

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import  Button  from "@/shared/ui/Button";
import  Input  from "@/shared/ui/Input";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("admin@beautystore.com");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login({ email, password, twoFactorCode: twoFactorCode || undefined });
    if (ok && onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-7 shadow-xl"
    >
      <h1 className="text-2xl font-semibold text-white mb-1">
        Вхід до <span className="text-amber-400">Beauty Store</span>
      </h1>
      <p className="text-sm text-neutral-400">
        Увійдіть, щоб оформлювати замовлення, відстежувати статус і залишати відгуки.
      </p>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-300">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-300">Пароль</label>
        <Input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-neutral-300">
            2FA код (якщо ввімкнено)
          </label>
          <span className="text-[10px] text-neutral-500">необовʼязково</span>
        </div>
        <Input
          type="text"
          placeholder="123456"
          value={twoFactorCode}
          onChange={(e) => setTwoFactorCode(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-2"
        disabled={loading}
      >
        {loading ? "Вхід..." : "Увійти"}
      </Button>

      <button
        type="button"
        onClick={() => {
          window.location.href = "/api/auth/google";
        }}
        className="w-full text-xs text-neutral-300 hover:text-white underline underline-offset-4 mt-1"
      >
        Увійти через Google
      </button>
    </form>
  );
};
