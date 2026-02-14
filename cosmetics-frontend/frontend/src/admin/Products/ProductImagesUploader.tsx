import React, { useId, useState } from "react";
import { adminUploadProductImages } from "@/admin/api/uploads.api";

interface Props {
  value: string[];
  onChange: (images: string[]) => void;
}

export const ProductImagesUploader: React.FC<Props> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const inputId = useId();

  async function onUpload(file: File) {
    setLoading(true);
    try {
      const res = await adminUploadProductImages([file]);

      // бекенд повертає URL → зберігаємо саме їх
      if (Array.isArray(res.urls)) {
        onChange([...value, ...res.urls]);
      }
    } finally {
      setLoading(false);
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((i) => i !== url));
  }

  return (
    <div className="space-y-3">
      {/* label потрібен для axe + доступності */}
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-300"
      >
        Додати фото товару
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        aria-label="Upload product image"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onUpload(file);
            // дозволяє завантажити той самий файл повторно
            e.currentTarget.value = "";
          }
        }}
      />

      <div className="grid grid-cols-3 gap-3">
        {value.map((img) => (
          <div key={img} className="relative">
            <img
              src={img}
              alt="Фото товару"
              className="h-32 w-full object-cover rounded-lg"
            />

            <button
              type="button"
              aria-label="Remove image"
              onClick={() => removeImage(img)}
              className="absolute top-1 right-1 bg-black/70 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-sm text-neutral-400">Uploading…</div>
      )}
    </div>
  );
};
