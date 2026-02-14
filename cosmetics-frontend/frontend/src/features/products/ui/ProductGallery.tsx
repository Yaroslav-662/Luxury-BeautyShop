import React, { useMemo, useState } from "react";

export function ProductGallery({ images }: { images: string[] }) {
  const safe = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [active, setActive] = useState(0);

  if (!safe.length) {
    return (
      <img
        src="/placeholder-product.png"
        className="w-full h-80 object-cover rounded-2xl border border-neutral-800"
        alt="no image"
      />
    );
  }

  return (
    <div className="grid gap-3">
      <img
        src={safe[active]}
        className="w-full h-80 object-cover rounded-2xl border border-neutral-800"
        alt="product"
      />

      {safe.length > 1 && (
        <div className="flex gap-2 overflow-auto pb-1">
          {safe.map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(idx)}
              className={`shrink-0 rounded-xl overflow-hidden border ${
                idx === active ? "border-amber-400" : "border-neutral-800"
              }`}
              title="preview"
            >
              <img src={url} alt="thumb" className="w-20 h-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
