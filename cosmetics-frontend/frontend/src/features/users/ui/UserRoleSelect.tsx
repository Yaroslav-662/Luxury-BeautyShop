// src/features/users/ui/UserRoleSelect.tsx

import React from "react";
import type { UserRole } from "../model/user.types";

interface Props {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

export const UserRoleSelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select
      className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
      value={value}
      onChange={(e) => onChange(e.target.value as UserRole)}
    >
      <option value="user">Користувач</option>
      <option value="admin">Адміністратор</option>
    </select>
  );
};
