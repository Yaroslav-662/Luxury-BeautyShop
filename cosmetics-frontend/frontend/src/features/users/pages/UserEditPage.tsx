// src/features/users/pages/UserEditPage.tsx

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUsersAdmin } from "../hooks/useUsersAdmin";
import { UserRoleSelect } from "../ui/UserRoleSelect";

export const UserEditPage: React.FC = () => {
  const { id } = useParams();
  const { selected, fetchUser, changeRole, loading, error } = useUsersAdmin();

  useEffect(() => {
    if (id) fetchUser(id);
  }, [id]);

  if (loading || !selected) {
    return <p className="text-neutral-400 p-6">Завантаження...</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-white space-y-4">
      <h1 className="text-2xl font-bold">Редагування користувача</h1>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-3">
        <p className="text-sm text-neutral-300">
          ID: <span className="text-neutral-400">{selected._id}</span>
        </p>
        <p className="text-sm text-neutral-300">
          Імʼя: <span className="text-white">{selected.name}</span>
        </p>
        <p className="text-sm text-neutral-300">
          Email: <span className="text-white">{selected.email}</span>
        </p>

        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Роль</label>
          <UserRoleSelect
            value={selected.role}
            onChange={(role) => changeRole(selected._id, role)}
          />
        </div>

        <p className="text-xs text-neutral-500">
          Статус:{" "}
          {selected.isActive === false ? "Деактивовано" : "Активний"}
        </p>
      </div>
    </div>
  );
};
