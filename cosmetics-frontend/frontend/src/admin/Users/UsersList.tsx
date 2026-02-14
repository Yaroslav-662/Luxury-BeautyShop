import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { Link, useSearchParams } from "react-router-dom";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import Pagination from "@/shared/ui/Pagination";
import { AdminShell } from "@/admin/_ui/AdminShell";
import { adminDeleteUser, adminGetUsers, UserDTO } from "@/admin/api/admin.api";

export default function UsersList() {
  const [sp, setSp] = useSearchParams();

  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "10");
  const search = sp.get("search") || "";
  const role = sp.get("role") || "";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ total: number; totalPages: number; users: UserDTO[] }>({
    total: 0,
    totalPages: 1,
    users: [],
  });

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetUsers({ page, limit, search: search || undefined, role: role || undefined });
      setData({ total: res.total, totalPages: res.totalPages, users: res.users });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, role]);

  async function onDelete(id: string) {
    if (!confirm("Видалити користувача?")) return;
    await adminDeleteUser(id);
    await load();
  }

  function userId(u: UserDTO) {
    return (u.id || u._id || "") as string;
  }

  return (
    <>
      <MetaTags title="Admin — Users" />
      <AdminShell title="Users" subtitle="GET /api/users (search/role/page/limit) + PUT role + DELETE">
        <div className="flex flex-col md:flex-row gap-3 md:items-end mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search (name/email)…"
              value={search}
              onChange={(e) => setSp({ page: "1", limit: String(limit), role, search: e.target.value })}
            />
          </div>
          <div className="w-full md:w-52">
            <Select
              value={role}
              onChange={(e) => setSp({ page: "1", limit: String(limit), search, role: e.target.value })}
              aria-label="Role"
            >
              <option value="">All roles</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select
              value={String(limit)}
              onChange={(e) => setSp({ page: "1", limit: e.target.value, role, search })}
              aria-label="Limit"
            >
              {[10, 20, 50].map((x) => (
                <option key={x} value={x}>
                  {x} / page
                </option>
              ))}
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Role</th>
                  <th className="text-left py-3">Verified</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => {
                  const id = userId(u);
                  return (
                    <tr key={id} className="border-b border-neutral-900">
                      <td className="py-3 text-white font-medium">
                        <div className="flex flex-col">
                          <span>{u.name}</span>
                          <span className="text-xs text-neutral-500">ID: {id}</span>
                        </div>
                      </td>
                      <td className="py-3 text-neutral-200">{u.email}</td>
                      <td className="py-3 text-neutral-200">{u.role}</td>
                      <td className="py-3 text-neutral-200">{u.isVerified ? "Yes" : "No"}</td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/users/${id}/edit`}>
                            <Button variant="outline">Edit</Button>
                          </Link>
                          <Button variant="danger" onClick={() => onDelete(id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-neutral-400">
                      Немає користувачів.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onChange={(p) => setSp({ page: String(p), limit: String(limit), role, search })}
            />
          </div>
        )}
      </AdminShell>
    </>
  );
}