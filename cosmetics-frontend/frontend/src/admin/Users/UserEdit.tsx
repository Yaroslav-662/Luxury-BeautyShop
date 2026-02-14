import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useNavigate, useParams } from "react-router-dom";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import { AdminShell, AdminRow } from "@/admin/_ui/AdminShell";
import { adminGetUser, adminSetUserRole, UserDTO } from "@/admin/api/admin.api";

export default function UserEdit() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [role, setRole] = useState<"user" | "admin">("user");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const u = await adminGetUser(id);
        setUser(u);
        setRole(u.role);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSave() {
    if (!user) return;
    setSaving(true);
    try {
      await adminSetUserRole(id, role);
      nav("/admin/users");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <MetaTags title="Admin — Edit User" />
      <AdminShell
        title="Edit user"
        subtitle="GET /api/users/:id + PUT /api/users/:id/role"
        right={<Button variant="outline" onClick={() => nav(-1)}>Back</Button>}
      >
        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : !user ? (
          <div className="text-neutral-400">User not found</div>
        ) : (
          <div className="space-y-4">
            <AdminRow label="Name">
              <div className="text-white">{user.name}</div>
            </AdminRow>
            <AdminRow label="Email">
              <div className="text-white">{user.email}</div>
            </AdminRow>
            <AdminRow label="Verified">
              <div className="text-white">{user.isVerified ? "Yes" : "No"}</div>
            </AdminRow>
            <AdminRow label="Role">
              <Select value={role} onChange={(e) => setRole(e.target.value as any)} aria-label="Role">
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Select>
            </AdminRow>

            <div className="pt-2 flex gap-2">
              <Button onClick={onSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => nav("/admin/users")}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  );
}