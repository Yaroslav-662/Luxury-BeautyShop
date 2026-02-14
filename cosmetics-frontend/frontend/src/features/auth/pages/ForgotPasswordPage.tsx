// src/features/auth/pages/ForgotPasswordPage.tsx

import React from "react";
import { ForgotPasswordForm } from "../ui/ForgotPasswordForm";

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center px-4">
      <ForgotPasswordForm />
    </div>
  );
};
