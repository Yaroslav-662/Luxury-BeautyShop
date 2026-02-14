// src/features/auth/pages/ResetPasswordPage.tsx

import React from "react";
import { useParams } from "react-router-dom";
import  ResetPasswordForm  from "../ui/ResetPasswordForm";

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-sm">
          Токен відновлення паролю не знайдено.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center px-4">
      <ResetPasswordForm token={token} />
    </div>
  );
};
