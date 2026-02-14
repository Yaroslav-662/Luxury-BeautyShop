// src/pages/Auth/VerifyEmailPage.tsx
import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { NavLink, useParams } from "react-router-dom";
import { AuthApi } from "@/features/auth/api/auth.api";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!token) {
        setOk(false);
        setMessage("Немає токена підтвердження.");
        setLoading(false);
        return;
      }

      try {
        // ✅ AuthApi.verifyEmail() повертає { message?: string }
        const res = await AuthApi.verifyEmail(token);

        if (!mounted) return;
        setOk(true);
        setMessage(res?.message || "Email успішно підтверджено.");
      } catch (e: any) {
        if (!mounted) return;
        setOk(false);
        setMessage(e?.response?.data?.message || "Не вдалося підтвердити email.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <>
      <MetaTags title="Verify Email" />

      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Email Verification</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Підтверджуємо вашу електронну адресу…
        </p>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3">
          {loading ? (
            <div className="text-neutral-300">Перевірка токена…</div>
          ) : (
            <>
              <div className={ok ? "text-emerald-300" : "text-red-300"}>
                {message}
              </div>

              <div className="pt-2 flex gap-3">
                <NavLink
                  to="/auth/login"
                  className="text-sm px-4 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90"
                >
                  Перейти до Login
                </NavLink>

                <NavLink
                  to="/"
                  className="text-sm px-4 py-2 rounded-full border border-neutral-700 text-neutral-200 hover:bg-white/5"
                >
                  На головну
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
