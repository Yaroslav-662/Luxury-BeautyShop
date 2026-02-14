// src/features/auth/pages/RegisterPage.tsx

import React from "react";
import { RegisterForm } from "../ui/RegisterForm";
import { useNavigate } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center px-4">
      <RegisterForm
        onSuccess={() => {
          // Після успішної реєстрації можна показати повідомлення або перекинути на /auth/login
          navigate("/auth/login");
        }}
      />
    </div>
  );
};
