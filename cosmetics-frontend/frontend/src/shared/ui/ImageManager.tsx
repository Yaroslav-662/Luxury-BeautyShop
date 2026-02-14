import React, { useRef, useState } from "react";
import Button from "@/shared/ui/Button";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  onUpload: (files: File[]) => Promise<string[]>;
  onDeleteRemote?: (url: string) => Promise<any>;
  max?: number;
};

export default function ImageManager({ value, onChange, onUpload, onDeleteRemote, max = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const images = Array.isArray(value) ? value : [];

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string>("");

  const canAdd = images.length < max;

  const openPicker = () => {
    if (!canAdd) return alert(`Максимум ${max} фото`);
    inputRef.current?.click();
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    e.target.value = "";
    if (!list || list.length === 0) return;

    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return alert("Вибери зображення (jpg/png/webp/gif).");

    const free = max - images.length;
    const sliced = files.slice(0, free);

    setUploading(true);
    try {
      const urls = await onUpload(sliced);
      if (!Array.isArray(urls) || urls.length === 0) {
        alert("Upload не повернув urls (перевір відповідь / токен / права).");
        return;
      }
      onChange([...images, ...urls].slice(0, max));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  const removeOne = async (url: string) => {
    // optimistic UI
    onChange(images.filter((x) => x !== url));

    if (!onDeleteRemote) return;

    setDeleting(url);
    try {
      await onDeleteRemote(url);
    } catch (err) {
      // не повертаємо в UI назад — просто лишиться файл на сервері
      console.warn("Remote delete failed:", err);
    } finally {
      setDeleting("");
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onPick}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <Button type="button" variant="outline" onClick={openPicker} disabled={!canAdd || uploading}>
          {uploading ? "Uploading…" : "Add photos"}
        </Button>

        <div className="text-xs text-neutral-400">
          {images.length}/{max}
        </div>

        {images.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange([])}
            disabled={uploading}
          >
            Clear (local)
          </Button>
        )}
      </div>

      {images.length === 0 ? (
        <div className="text-sm text-neutral-500">Немає фото.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((url) => (
            <div key={url} className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
              <div className="aspect-square bg-black/30">
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
                />
              </div>
              <div className="p-2 flex items-center justify-between gap-2">
                <div className="text-[10px] text-neutral-500 truncate" title={url}>
                  {url}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeOne(url)}
                  disabled={uploading || deleting === url}
                >
                  {deleting === url ? "…" : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
