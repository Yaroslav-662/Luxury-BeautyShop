// src/features/auth/ui/TwoFactorForm.tsx

import React, { useState } from "react";
import { AuthApi } from "../api/auth.api";
import  Button  from "@/shared/ui/Button";
import  Input  from "@/shared/ui/Input";

interface TwoFactorFormProps {
  onActivated?: () => void;
}

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  onActivated,
}) => {
  const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [token, setToken] = useState("");
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoadingSetup(true);
    setError(null);
    setMessage(null);

    try {
      const res = await AuthApi.setup2FA();
      setSetupData(res);
      setMessage("Скануйте QR-код у програмі Google Authenticator або подібній.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Не вдалося налаштувати 2FA.";
      setError(msg);
    } finally {
      setLoadingSetup(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoadingVerify(true);
    setError(null);
    setMessage(null);

    try {
      const res = await AuthApi.verify2FA(token);
      setMessage(res?.message || "2FA успішно активовано");
      if (onActivated) onActivated();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Код невірний. Спробуйте ще раз.";
      setError(msg);
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-7 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-1">
        Двофакторна автентифікація (2FA)
      </h2>
      <p className="text-sm text-neutral-400">
        Увімкніть 2FA, щоб підвищити безпеку вашого акаунта. Після активації при вході
        потрібно буде вводити одноразовий код з додатку.
      </p>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {message && (
        <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      {!setupData && (
        <Button
          type="button"
          onClick={handleSetup}
          disabled={loadingSetup}
        >
          {loadingSetup ? "Створення секрету..." : "Налаштувати 2FA"}
        </Button>
      )}

      {setupData && (
        <div className="space-y-3">
          <div className="bg-black/40 border border-neutral-700 rounded-xl p-3 text-xs text-neutral-300">
            <p className="mb-2">
              Скануйте цей QR-код у додатку (Google Authenticator / Authy / тощо), або введіть секрет вручну.
            </p>
            {setupData.qrCode && (
              <img
                src={setupData.qrCode}
                alt="2FA QR"
                className="mx-auto rounded-lg border border-neutral-700 bg-white"
              />
            )}
            <p className="mt-2 break-all">
              <span className="font-mono text-amber-300">Secret: </span>
              {setupData.secret}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">
              Введіть 6-значний код з додатку
            </label>
            <Input
              type="text"
              placeholder="123456"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />

            <Button type="submit" disabled={loadingVerify}>
              {loadingVerify ? "Перевірка..." : "Підтвердити 2FA"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
