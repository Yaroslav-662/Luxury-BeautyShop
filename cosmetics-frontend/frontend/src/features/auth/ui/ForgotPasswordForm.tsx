// src/features/auth/ui/ForgotPasswordForm.tsx

import React, { useState } from "react";
import { AuthApi } from "../api/auth.api";
import  Button  from "@/shared/ui/Button";
import  Input  from "@/shared/ui/Input";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await AuthApi.forgotPassword(email);
      setMessage(
        res?.message ||
          "Якщо користувач існує — лист для відновлення було надіслано."
      );
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Не вдалося надіслати лист. Спробуйте пізніше.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-7 shadow-xl"
    >
      <h1 className="text-2xl font-semibold text-white mb-1">
        Відновлення паролю
      </h1>
      <p className="text-sm text-neutral-400">
        Введіть email, і ми надішлемо посилання для скидання пароля, якщо акаунт існує.
      </p>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {message && (
        <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
          {message}
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

      <Button
        type="submit"
        className="w-full mt-2"
        disabled={loading}
      >
        {loading ? "Надсилання..." : "Надіслати посилання"}
      </Button>
    </form>
  );
};
