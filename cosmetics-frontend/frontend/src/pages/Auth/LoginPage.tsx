import React, { useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const from = (location.state as any)?.from || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login({
      email: email.trim(),
      password,
      twoFactorCode: twoFactorCode.trim() || undefined,
    });
    if (ok) navigate(from, { replace: true });
  }

  // Якщо бекенд повертає "Потрібен код 2FA" — показуємо поле
  React.useEffect(() => {
    if (error === "Потрібен код 2FA") setShow2FA(true);
  }, [error]);

  return (
    <>
      <MetaTags title="Вхід" />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Вхід до акаунту</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Немає акаунту?{" "}
              <NavLink to="/auth/register" className="text-gold-300 hover:text-gold-200 transition-colors">
                Зареєструватись
              </NavLink>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && error !== "Потрібен код 2FA" && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error === "Підтвердіть email перед входом" ? (
                  <span>
                    Підтвердіть email перед входом.{" "}
                    <span className="text-neutral-300">Перевірте папку Спам.</span>
                  </span>
                ) : error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" required />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Пароль</label>
                <NavLink to="/auth/forgot" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                  Забули пароль?
                </NavLink>
              </div>
              <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" required />
            </div>

            {show2FA ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">
                  Код двофакторної аутентифікації
                </label>
                <Input
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  placeholder="000000"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                />
                <p className="text-xs text-neutral-500">Введіть 6-значний код з вашого додатку автентифікатора.</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShow2FA(true)}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Є код двофакторної аутентифікації
              </button>
            )}

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Вхід..." : "Увійти"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
