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
        className="w-full h-80 object-cover rounded-2xl"
      />
    );
  }

  return (
    <div className="grid gap-3">
      <img
        src={resolveImage(safe[active])}
        className="w-full h-80 object-cover rounded-2xl"
      />

      {safe.length > 1 && (
        <div className="flex gap-2">
          {safe.map((url, idx) => (
            <button key={idx} onClick={() => setActive(idx)}>
              <img
                src={resolveImage(url)}
                className="w-20 h-20 object-cover rounded-xl"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
