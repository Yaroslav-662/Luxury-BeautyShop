import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { NavLink, useParams } from "react-router-dom";
import { AuthApi } from "@/features/auth/api/auth.api";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

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
        setMessage(e?.response?.data?.message || "Не вдалося підтвердити email. Можливо посилання вже застаріло.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [token]);

  return (
    <>
      <MetaTags title="Підтвердження email" />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-5">
          {loading ? (
            <>
              <div className="w-14 h-14 rounded-full border border-neutral-700 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-neutral-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-400">Підтверджуємо вашу адресу...</p>
            </>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${ok ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                {ok ? (
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {ok ? "Email підтверджено" : "Помилка підтвердження"}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">{message}</p>
              </div>
              {!ok && (
                <p className="text-xs text-neutral-500">
                  Посилання дійсне 1 годину. Спробуйте зареєструватись знову або зверніться до підтримки.
                </p>
              )}
              <div className="flex gap-3 justify-center pt-1">
                <NavLink
                  to="/auth/login"
                  className="text-sm px-5 py-2 rounded-full bg-white text-black font-medium hover:opacity-90 transition-opacity"
                >
                  {ok ? "Увійти" : "До входу"}
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
