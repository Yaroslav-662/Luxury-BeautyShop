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
        <MetaTags title="Реєстрація" />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Акаунт створено</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Ми надіслали листа на <span className="text-white font-medium">{email}</span>.
                Підтвердіть адресу щоб увійти.
              </p>
            </div>
            <p className="text-xs text-neutral-500">
              Не отримали листа? Перевірте папку Спам.
            </p>
            <NavLink
              to="/auth/login"
              className="inline-block text-sm text-gold-300 hover:text-gold-200 transition-colors"
            >
              Перейти до входу →
            </NavLink>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Реєстрація" />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Створити акаунт</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Вже є акаунт?{" "}
              <NavLink to="/auth/login" className="text-gold-300 hover:text-gold-200 transition-colors">
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Ім'я</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ірина Коваленко" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="iryna@example.com" type="email" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Пароль</label>
              <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Мінімум 8 символів" type="password" required />
            </div>

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Створення акаунту..." : "Зареєструватись"}
            </Button>

            <p className="text-xs text-neutral-600 text-center leading-relaxed">
              Реєструючись, ви погоджуєтесь з{" "}
              <NavLink to="/terms" className="text-neutral-400 hover:text-white">умовами використання</NavLink>
              {" "}та{" "}
              <NavLink to="/privacy" className="text-neutral-400 hover:text-white">політикою конфіденційності</NavLink>.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
