import React, { useMemo, useState } from "react";
import { resolveImage } from "@/shared/lib/resolveImage";

export function ProductGallery({ images }: { images: string[] }) {
  const safe = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const [active, setActive] = useState(0);

  if (!safe.length) {
    return (
      <img
        src="https://placehold.co/600x600?text=No+Image"
        alt="Немає фото товару"
        className="w-full h-80 object-cover rounded-2xl"
      />
    );
  }

  return (
    <div className="grid gap-3">
      <img
        src={resolveImage(safe[active])}
        alt={`Фото товару ${active + 1}`}
        className="w-full h-80 object-cover rounded-2xl"
      />

      {safe.length > 1 && (
        <div className="flex gap-2">
          {safe.map((url, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Показати фото ${idx + 1}`}
              onClick={() => setActive(idx)}
              className="rounded-xl overflow-hidden"
            >
              <img
                src={resolveImage(url)}
                alt={`Мініатюра ${idx + 1}`}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
