// src/features/users/ui/UserProfileForm.tsx

import React, { useState } from "react";
import type { User } from "../model/user.types";
import  Button  from "@/shared/ui/Button";
import  Input  from "@/shared/ui/Input";

interface Props {
  user: User;
  onSubmit: (data: { name?: string; email?: string; file?: File | null }) => void;
}

export const UserProfileForm: React.FC<Props> = ({ user, onSubmit }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, file });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-neutral-900/70 border border-neutral-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-4">
        <img
          src={user.avatarUrl || "/avatar-placeholder.png"}
          className="w-16 h-16 rounded-full object-cover border border-neutral-700"
        />
        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-xs text-neutral-400">{user.email}</p>
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-400 mb-1 block">Імʼя</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-neutral-400 mb-1 block">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-neutral-400 mb-1 block">
          Аватар (зображення)
        </label>
        <input
          type="file"
          accept="image/*"
          className="text-xs text-neutral-300"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button type="submit" className="w-full">
        Зберегти
      </Button>
    </form>
  );
};
