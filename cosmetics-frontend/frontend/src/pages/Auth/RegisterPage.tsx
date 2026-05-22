import React, { useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await register({ name: name.trim(), email: email.trim(), password });
    if (ok) setSuccess(true);
  }

  if (success) {
    return (
      <>
        <MetaTags title="Register" />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Акаунт створено</h2>
            <p className="text-sm text-neutral-400">
              Ми надіслали лист підтвердження на <span className="text-white">{email}</span>.
              Перевірте пошту та підтвердіть адресу щоб увійти.
            </p>
            <NavLink
              to="/auth/login"
              className="inline-block mt-2 text-sm text-gold-300 hover:text-gold-200 underline underline-offset-4"
            >
              Перейти до входу
            </NavLink>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Register" />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Створити акаунт</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Вже є акаунт?{" "}
              <NavLink to="/auth/login" className="text-gold-300 hover:text-gold-200">
                Увійти
              </NavLink>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Ім'я
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ірина Коваленко"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="iryna@example.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Пароль
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Мінімум 8 символів"
                type="password"
                required
              />
            </div>

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Створення акаунту..." : "Зареєструватись"}
            </Button>

            <p className="text-xs text-neutral-500 text-center">
              Реєструючись, ви погоджуєтесь з умовами використання та політикою конфіденційності.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
