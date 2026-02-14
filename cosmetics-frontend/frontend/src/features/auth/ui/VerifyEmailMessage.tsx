// src/features/auth/ui/VerifyEmailMessage.tsx

import React from "react";

interface VerifyEmailMessageProps {
  email?: string;
}

export const VerifyEmailMessage: React.FC<VerifyEmailMessageProps> = ({
  email,
}) => {
  return (
    <div className="w-full max-w-md bg-neutral-900/80 border border-amber-500/50 rounded-2xl px-6 py-7 shadow-xl">
      <h1 className="text-2xl font-semibold text-white mb-2">
        Підтвердьте email
      </h1>
      <p className="text-sm text-neutral-300">
        Ми надіслали лист з посиланням для підтвердження на адресу:
      </p>
      {email && (
        <p className="text-sm font-medium text-amber-300 mt-1">{email}</p>
      )}
      <p className="text-xs text-neutral-500 mt-3">
        Якщо лист не надходить протягом кількох хвилин, перевірте папку &quot;Спам&quot; або
        &quot;Промоакції&quot;.
      </p>
    </div>
  );
};
