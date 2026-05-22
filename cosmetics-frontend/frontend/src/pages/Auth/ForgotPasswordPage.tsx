import React, { useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { NavLink } from "react-router-dom";
import { AuthApi } from "@/features/auth/api/auth.api";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await AuthApi.forgotPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Не вдалося надіслати лист.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <MetaTags title="Скидання паролю" />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Перевірте пошту</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Якщо акаунт з адресою <span className="text-white font-medium">{email}</span> існує —
                ви отримаєте інструкції для скидання паролю.
              </p>
            </div>
            <p className="text-xs text-neutral-500">Не отримали? Перевірте папку Спам.</p>
            <NavLink to="/auth/login" className="inline-block text-sm text-gold-300 hover:text-gold-200 transition-colors">
              ← Повернутись до входу
            </NavLink>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Скидання паролю" />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <NavLink to="/auth/login" className="text-xs text-neutral-500 hover:text-neutral-300 flex items-center gap-1 mb-4 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад до входу
            </NavLink>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Скидання паролю</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Введіть email — ми надішлемо посилання для скидання паролю.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" required />
            </div>
            <Button disabled={submitting} type="submit" className="w-full">
              {submitting ? "Надсилаємо..." : "Надіслати інструкції"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
