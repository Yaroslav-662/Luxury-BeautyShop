// src/features/auth/pages/VerifyEmailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthApi } from "../api/auth.api";

export const VerifyEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Токен підтвердження відсутній.");
        return;
      }

      try {
        const res = await AuthApi.verifyEmail(token);
        setMessage(res?.message || "Email успішно підтверджено.");
        setStatus("success");
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Токен недійсний або прострочений.";
        setMessage(msg);
        setStatus("error");
      }
    };

    void run();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-7 shadow-xl text-center space-y-4">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold text-white">
              Підтвердження email...
            </h1>
            <p className="text-sm text-neutral-400">
              Будь ласка, зачекайте, ми перевіряємо ваш токен.
            </p>
          </>
        )}

        {status !== "loading" && (
          <>
            <h1 className="text-xl font-semibold text-white">
              {status === "success" ? "Email підтверджено" : "Помилка підтвердження"}
            </h1>
            {message && (
              <p
                className={`text-sm ${
                  status === "success" ? "text-emerald-300" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-4">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition"
              >
                Перейти до входу
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
