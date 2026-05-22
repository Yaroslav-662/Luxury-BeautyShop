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
        setMessage("Недійсне посилання підтвердження.");
        setLoading(false);
        return;
      }
      try {
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
    return () => { mounted = false; };
  }, [token]);

  return (
    <>
      <MetaTags title="Verify Email" />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          {loading ? (
            <>
              <div className="w-16 h-16 rounded-full border border-neutral-700 flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-neutral-400">Підтверджуємо вашу адресу...</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${ok ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                {ok ? (
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {ok ? "Email підтверджено" : "Помилка підтвердження"}
              </h2>
              <p className="text-sm text-neutral-400">{message}</p>
              <div className="flex gap-3 justify-center pt-2">
                <NavLink
                  to="/auth/login"
                  className="text-sm px-5 py-2 rounded-full bg-white text-black font-medium hover:opacity-90 transition-opacity"
                >
                  Увійти
                </NavLink>
                <NavLink
                  to="/"
                  className="text-sm px-5 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-white/5 transition-colors"
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
