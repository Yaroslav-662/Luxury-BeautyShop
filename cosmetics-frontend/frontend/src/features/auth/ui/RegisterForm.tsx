// src/features/auth/ui/RegisterForm.tsx

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import  Button  from "@/shared/ui/Button";
import  Input  from "@/shared/ui/Input";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser, loading, error } = useAuth();
  const [name, setName] = useState("Ірина");
  const [email, setEmail] = useState("iryna@example.com");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirm) {
      setLocalError("Паролі не співпадають");
      return;
    }

    const ok = await registerUser({ name, email, password });
    if (ok && onSuccess) onSuccess();
  };

  const finalError = localError || error;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-7 shadow-xl"
    >
      <h1 className="text-2xl font-semibold text-white mb-1">
        Створити акаунт
      </h1>
      <p className="text-sm text-neutral-400">
        Після реєстрації ми надішлемо лист для підтвердження електронної пошти.
      </p>

      {finalError && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
          {finalError}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-300">Імʼя</label>
        <Input
          placeholder="Ваше імʼя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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
          placeholder="Мінімум 6 символів"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-300">
          Підтвердження пароля
        </label>
        <Input
          type="password"
          placeholder="Повторіть пароль"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-2"
        disabled={loading}
      >
        {loading ? "Створення..." : "Створити акаунт"}
      </Button>
    </form>
  );
};
