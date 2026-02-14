// src/features/users/pages/UsersListPage.tsx

import React, { useEffect, useState } from "react";
import { useUsersAdmin } from "../hooks/useUsersAdmin";
import { UserRoleSelect } from "../ui/UserRoleSelect";
import  Button  from "@/shared/ui/Button";
import type { UserRole } from "../model/user.types";
import { useNavigate } from "react-router-dom";

export const UsersListPage: React.FC = () => {
  const { users, fetchUsers, changeRole, deleteUser, loading, error } =
    useUsersAdmin();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "" >("");
  const nav = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const applyFilters = () => {
    fetchUsers({
      search: search || undefined,
      role: roleFilter || undefined,
    });
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Користувачі</h1>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">
            Пошук
          </label>
          <input
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Імʼя або email"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">
            Роль
          </label>
          <select
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
          >
            <option value="">Всі</option>
            <option value="user">Користувач</option>
            <option value="admin">Адмін</option>
          </select>
        </div>
        <Button onClick={applyFilters}>Фільтрувати</Button>
      </div>

      {loading && (
        <p className="text-xs text-neutral-400">Завантаження...</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="min-w-full text-sm bg-neutral-900/70">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="px-4 py-3 text-left text-neutral-400">ID</th>
              <th className="px-4 py-3 text-left text-neutral-400">Імʼя</th>
              <th className="px-4 py-3 text-left text-neutral-400">Email</th>
              <th className="px-4 py-3 text-left text-neutral-400">Роль</th>
              <th className="px-4 py-3 text-left text-neutral-400">Статус</th>
              <th className="px-4 py-3 text-left text-neutral-400">Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-neutral-800 hover:bg-neutral-800/50"
              >
                <td className="px-4 py-3 text-neutral-300">
                  {u._id.slice(-6)}
                </td>
                <td className="px-4 py-3 text-neutral-100">{u.name}</td>
                <td className="px-4 py-3 text-neutral-300">{u.email}</td>
                <td className="px-4 py-3">
                  <UserRoleSelect
                    value={u.role}
                    onChange={(role) => changeRole(u._id, role)}
                  />
                </td>
                <td className="px-4 py-3 text-neutral-300">
                  {u.isActive === false ? "Деактивовано" : "Активний"}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => nav(`/admin/users/${u._id}`)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Видалити
                  </Button>
                </td>
              </tr>
            ))}

            {!users.length && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-neutral-400"
                >
                  Користувачів не знайдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
