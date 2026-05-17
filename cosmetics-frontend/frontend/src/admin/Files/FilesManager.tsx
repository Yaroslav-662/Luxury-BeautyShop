// src/admin/Files/FilesManager.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { AdminShell } from "@/admin/_ui/AdminShell";
import {
  adminUploadFile,
  adminGetFiles,
  adminDeleteFile,
  adminRenameFile,
  type UploadedFileDTO,
} from "@/admin/api/admin.api";

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "jfif", "avif"];

function isImage(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTS.includes(ext);
}

export default function FilesManager() {
  const [files, setFiles] = useState<UploadedFileDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [renameMap, setRenameMap] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetFiles();
      setFiles(res || []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
  }, [files, q]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(true);
    try {
      await adminUploadFile(file);
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function handleRename(oldName: string) {
    const newName = renameMap[oldName]?.trim();
    if (!newName || newName === oldName) return;
    try {
      await adminRenameFile(oldName, newName);
      setRenameMap((prev) => { const c = { ...prev }; delete c[oldName]; return c; });
      await load();
    } catch {
      alert("Не вдалося перейменувати файл");
    }
  }

  async function handleDelete(name: string) {
    if (!window.confirm(`Видалити файл "${name}"?`)) return;
    setDeleting(name);
    try {
      await adminDeleteFile(name);
      setFiles((prev) => prev.filter((f) => f.name !== name));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <MetaTags title="Admin — Файли" />

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-neutral-300"
            onClick={() => setPreview(null)}
          >
            ✕
          </button>
        </div>
      )}

      <AdminShell
        title="Менеджер файлів"
        subtitle={`${files.length} файлів на сервері`}
        right={
          <button
            onClick={load}
            className="text-sm text-neutral-400 hover:text-white border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            🔄 Оновити
          </button>
        }
      >
        {/* Upload + Search */}
        <div className="flex flex-wrap gap-3 mb-5 items-end">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Завантажити файл</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 disabled:opacity-50 transition-colors"
            >
              {uploading ? "⏳ Завантаження..." : "📎 Вибрати файл"}
            </button>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-neutral-400 block mb-1">Пошук</label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              placeholder="Назва файлу..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <span className="text-xs text-neutral-500 self-end pb-2">
            {filtered.length} з {files.length}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-neutral-900 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            {files.length === 0 ? "Файлів ще немає" : "Нічого не знайдено"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-3 text-left font-medium w-14">Прев'ю</th>
                  <th className="py-3 text-left font-medium">Назва</th>
                  <th className="py-3 text-left font-medium">Розмір</th>
                  <th className="py-3 text-left font-medium">Перейменувати</th>
                  <th className="py-3 text-right font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.name} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    {/* Preview */}
                    <td className="py-2 pr-2">
                      {isImage(f.name) ? (
                        <img
                          src={f.url}
                          alt={f.name}
                          className="w-12 h-12 object-cover rounded-lg border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setPreview(f.url)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/48x48?text=?";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500 text-lg">
                          📄
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="py-3">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-yellow-400 transition-colors text-xs font-mono break-all"
                        title={f.url}
                      >
                        {f.name}
                      </a>
                    </td>

                    {/* Size */}
                    <td className="py-3 text-neutral-500 text-xs whitespace-nowrap">
                      {formatSize(f.size)}
                    </td>

                    {/* Rename */}
                    <td className="py-3">
                      <div className="flex gap-2">
                        <input
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white w-32 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                          placeholder="Нова назва"
                          value={renameMap[f.name] || ""}
                          onChange={(e) =>
                            setRenameMap((p) => ({ ...p, [f.name]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleRename(f.name)}
                        />
                        <button
                          onClick={() => handleRename(f.name)}
                          disabled={!renameMap[f.name]}
                          className="text-xs border border-neutral-700 px-2 py-1 rounded hover:border-neutral-500 disabled:opacity-30 transition-colors"
                        >
                          ОК
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <button
                        disabled={deleting === f.name}
                        onClick={() => handleDelete(f.name)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deleting === f.name ? "..." : "Видалити"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </>
  );
}
