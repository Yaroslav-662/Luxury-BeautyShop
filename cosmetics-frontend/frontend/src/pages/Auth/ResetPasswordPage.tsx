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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setMessage("Немає токена для скидання.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await AuthApi.resetPassword(token, password);
      setMessage(res?.message || "Пароль успішно змінено.");
      setTimeout(() => navigate("/auth/login"), 600);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Не вдалося змінити пароль.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <MetaTags title="Reset Password" />

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Reset Password</h1>
        <p className="text-sm text-neutral-400 mb-6">Введи новий пароль.</p>

        <form
          onSubmit={onSubmit}
          className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3"
        >
          {message && <div className="text-sm text-neutral-200">{message}</div>}

          <div>
            <label className="text-xs text-neutral-400 block mb-1">New password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="NewStrongPass123!"
              type="password"
              required
            />
          </div>

          <Button disabled={submitting} type="submit">
            {submitting ? "Зберігаємо..." : "Змінити пароль"}
          </Button>

          <div className="text-sm pt-2">
            <NavLink to="/auth/login" className="text-neutral-300 hover:text-white">
              Назад до Login
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}