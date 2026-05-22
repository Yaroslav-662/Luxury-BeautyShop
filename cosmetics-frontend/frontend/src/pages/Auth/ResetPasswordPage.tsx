import React, { useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { AuthApi } from "@/features/auth/api/auth.api";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Паролі не співпадають.");
      return;
    }
    if (!token) {
      setMessage("Недійсне посилання для скидання паролю.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await AuthApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Не вдалося змінити пароль.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        <MetaTags title="Reset Password" />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Пароль змінено</h2>
            <p className="text-sm text-neutral-400">
              Перенаправляємо вас на сторінку входу...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Reset Password" />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Новий пароль</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Введіть новий пароль для вашого акаунту.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {message && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {message}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Новий пароль
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Мінімум 8 символів"
                type="password"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Підтвердження паролю
              </label>
              <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Повторіть пароль"
                type="password"
                required
              />
            </div>

            <Button disabled={submitting} type="submit" className="w-full">
              {submitting ? "Зберігаємо..." : "Змінити пароль"}
            </Button>

            <NavLink
              to="/auth/login"
              className="block text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Повернутись до входу
            </NavLink>
          </form>
        </div>
      </div>
    </>
  );
}
