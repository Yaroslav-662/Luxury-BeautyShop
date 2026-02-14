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

  return (
    <>
      <MetaTags title="Login" />

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Login</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Вхід користувача (підтримка 2FA). Якщо 2FA ввімкнено — введи код.
        </p>

        <form
          onSubmit={onSubmit}
          className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3"
        >
          {error && <div className="text-red-300 text-sm">{error}</div>}

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@beautystore.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">
              2FA Code (якщо потрібно)
            </label>
            <Input
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="123456"
              inputMode="numeric"
            />
          </div>

          <Button disabled={loading} type="submit">
            {loading ? "Вхід..." : "Увійти"}
          </Button>

          <div className="flex items-center justify-between text-sm pt-2">
            <NavLink to="/auth/register" className="text-neutral-300 hover:text-white">
              Немає акаунта? Register
            </NavLink>

            <NavLink to="/auth/forgot" className="text-neutral-300 hover:text-white">
              Forgot password?
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}