// src/features/auth/pages/LoginPage.tsx

import React, { useEffect } from "react";
import { LoginForm } from "../ui/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const { isAuthenticated, loadProfile, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) {
      void loadProfile();
    }
  }, [initialized, loadProfile]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // після логіну — на головну або /account
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center px-4">
      <LoginForm
        onSuccess={() => {
          navigate("/");
        }}
      />
    </div>
  );
};
