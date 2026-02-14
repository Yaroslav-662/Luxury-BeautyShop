// src/admin/Files/FilesManager.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { AdminShell } from "@/admin/_ui/AdminShell";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

import { 
  adminUploadGenericFile, 
  adminUploadProductImages, 
  adminGetAllUploads, 
  adminDeleteUpload, 
  adminRenameUpload 
} from "@/admin/api/uploads.api";

type FileItem = {
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
};

export default function FilesManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [rename, setRename] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetAllUploads();
      setFiles(res || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return files;
    return files.filter((f) =>
      f.name.toLowerCase().includes(q.toLowerCase())
    );
  }, [files, q]);

  async function upload() {
    if (!file) return;
    await adminUploadGenericFile(file);
    setFile(null);
    load();
  }

  async function renameFile(oldName: string) {
    const newName = rename[oldName];
    if (!newName) return;

    await adminRenameUpload(oldName, newName);

    setRename((p) => {
      const c = { ...p };
      delete c[oldName];
      return c;
    });

    load();
  }

  async function remove(name: string) {
    if (!confirm("Видалити файл?")) return;
    await adminDeleteUpload(name);
    load();
  }

  return (
    <>
      <MetaTags title="Admin — Files" />
      <AdminShell title="Files manager">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 items-end">
          {/* Пошук файлу */}
          <Input
            placeholder="Search file…"
            aria-label="Пошук файлу"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {/* Завантаження файлу */}
          <label htmlFor="fileUpload" className="sr-only">
            Завантажити файл
          </label>
          <input
            id="fileUpload"
            type="file"
            aria-label="Завантажити файл"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <Button onClick={upload} disabled={!file}>
            Upload
          </Button>
        </div>

        {loading ? (
          <div className="text-neutral-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-2 text-left">Preview</th>
                <th className="text-left">Name</th>
                <th className="text-left">Rename</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.name} className="border-b border-neutral-900">
                  <td className="py-2">
                    <img
                      src={f.url}
                      alt={`Preview of ${f.name}`}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="text-white">{f.name}</td>
                  <td>
                    <div className="flex gap-2">
                      <Input
                        placeholder="New name"
                        aria-label={`Rename ${f.name}`}
                        value={rename[f.name] || ""}
                        onChange={(e) =>
                          setRename((p) => ({
                            ...p,
                            [f.name]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => renameFile(f.name)}
                      >
                        OK
                      </Button>
                    </div>
                  </td>
                  <td className="text-right">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => remove(f.name)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-neutral-400">
                    No files
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </AdminShell>
    </>
  );
}
