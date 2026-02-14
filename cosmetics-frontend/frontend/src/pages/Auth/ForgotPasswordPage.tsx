import React, { useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { NavLink } from "react-router-dom";
import { AuthApi } from "@/features/auth/api/auth.api";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await AuthApi.forgotPassword(email.trim());
      setMessage(res?.message || "Якщо користувач існує — лист надіслано.");
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Не вдалося надіслати лист.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <MetaTags title="Forgot Password" />

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Forgot Password</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Введи email — ми надішлемо лист для скидання паролю (як у Swagger).
        </p>

        <form
          onSubmit={onSubmit}
          className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3"
        >
          {message && <div className="text-sm text-neutral-200">{message}</div>}

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              type="email"
              required
            />
          </div>

          <Button disabled={submitting} type="submit">
            {submitting ? "Надсилаємо..." : "Надіслати лист"}
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