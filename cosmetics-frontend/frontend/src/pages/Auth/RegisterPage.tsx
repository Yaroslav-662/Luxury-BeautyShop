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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    if (ok) navigate("/auth/login");
  }

  return (
    <>
      <MetaTags title="Register" />

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Register</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Реєстрація з відправкою листа підтвердження (як у Swagger).
        </p>

        <form
          onSubmit={onSubmit}
          className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3"
        >
          {error && <div className="text-red-300 text-sm">{error}</div>}

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ірина" required />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="iryna@example.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Pass1234!"
              type="password"
              required
            />
          </div>

          <Button disabled={loading} type="submit">
            {loading ? "Створення..." : "Створити акаунт"}
          </Button>

          <div className="text-sm pt-2">
            <NavLink to="/auth/login" className="text-neutral-300 hover:text-white">
              Вже є акаунт? Login
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}