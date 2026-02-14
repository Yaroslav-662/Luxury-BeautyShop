import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useNavigate, useParams } from "react-router-dom";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { AdminShell, AdminRow } from "@/admin/_ui/AdminShell";
import { adminGetCategory, adminUpdateCategory } from "@/admin/api/admin.api";

export default function CategoryEdit() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const c = await adminGetCategory(id);
        setForm({ name: c.name || "", description: c.description || "" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSave() {
    const name = form.name.trim();
    if (!name) return alert("Name is required");

    setSaving(true);
    try {
      await adminUpdateCategory(id, { name, description: form.description?.trim() || undefined });
      nav("/admin/categories");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <MetaTags title="Admin — Edit Category" />
      <AdminShell
        title="Edit category"
        subtitle="GET /api/categories/:id + PUT /api/categories/:id"
        right={<Button variant="outline" onClick={() => nav(-1)}>Back</Button>}
      >
        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="space-y-4">
            <AdminRow label="Name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </AdminRow>

            <AdminRow label="Description">
              <textarea
                className="w-full rounded-lg bg-black/40 border border-neutral-800 p-3 text-sm text-white outline-none focus:border-neutral-600 min-h-[120px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </AdminRow>

            <div className="pt-2 flex gap-2">
              <Button onClick={onSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => nav("/admin/categories")}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  );
}