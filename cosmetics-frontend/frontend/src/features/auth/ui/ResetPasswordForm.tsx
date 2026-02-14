import { useState } from "react";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { AuthApi } from "../api/auth.api";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Пароль має містити мінімум 8 символів");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Паролі не співпадають");
      return;
    }

    try {
      setLoading(true);
      await AuthApi.resetPassword(token, password);
      setSuccess("Пароль успішно змінено. Тепер ви можете увійти.");
      setPassword("");
      setPasswordConfirm("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Сталася помилка. Спробуйте ще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto bg-black/40 border border-yellow-500/30 rounded-2xl p-6 shadow-lg backdrop-blur"
    >
      <h1 className="text-2xl font-semibold text-white text-center">
        Скидання пароля
      </h1>

      {error && (
        <div className="text-sm text-red-400 bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-emerald-300 bg-emerald-900/30 border border-emerald-500/40 rounded-lg px-3 py-2">
          {success}
        </div>
      )}

      <div>
        <label className="text-xs text-neutral-400 mb-1 block">
          Новий пароль
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введіть новий пароль"
          required
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 mb-1 block">
          Підтвердження пароля
        </label>
        <Input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Повторіть новий пароль"
          required
        />
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Змінити пароль
      </Button>
    </form>
  );
}
