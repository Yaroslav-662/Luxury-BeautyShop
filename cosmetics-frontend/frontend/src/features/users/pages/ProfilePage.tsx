// src/features/users/pages/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { UserProfileForm } from "../ui/UserProfileForm";
import  Button  from "@/shared/ui/Button";

export const ProfilePage: React.FC = () => {
  const {
    me,
    fetchMe,
    updateProfile,
    changePassword,
    deactivate,
    sendVerifyEmail,
    loading,
    error,
    success,
  } = useUserProfile();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (!me) {
    return <p className="text-neutral-400 p-6">Завантаження профілю...</p>;
  }

  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await changePassword({ oldPassword, newPassword });
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Мій профіль</h1>

      {loading && (
        <p className="text-xs text-neutral-400">Збереження...</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-xs text-emerald-400">{success}</p>
      )}

      <UserProfileForm user={me} onSubmit={updateProfile} />

      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Безпека</h2>

        <form className="space-y-3" onSubmit={onPasswordSubmit}>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">
              Старий пароль
            </label>
            <input
              type="password"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">
              Новий пароль
            </label>
            <input
              type="password"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit">Змінити пароль</Button>
        </form>

        <div className="flex gap-3 pt-3 border-t border-neutral-800">
          <Button variant="secondary" onClick={sendVerifyEmail}>
            Надіслати лист підтвердження email
          </Button>
          <Button variant="danger" onClick={deactivate}>
            Деактивувати акаунт
          </Button>
        </div>
      </div>
    </div>
  );
};
