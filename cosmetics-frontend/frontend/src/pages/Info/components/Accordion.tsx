import React, { useMemo, useState } from "react";

export type FAQItem = { q: string; a: React.ReactNode };

export default function Accordion({
  items,
  search = "",
}: {
  items: FAQItem[];
  search?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => {
      const q = x.q.toLowerCase();
      const a = typeof x.a === "string" ? x.a.toLowerCase() : "";
      return q.includes(s) || a.includes(s);
    });
  }, [items, search]);

  if (filtered.length === 0) {
    return (
      <div className="text-sm text-neutral-400">
        Нічого не знайдено у FAQ.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div
            key={it.q}
            className="border border-neutral-800 bg-neutral-900/60 rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full px-4 py-3 flex items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-white">{it.q}</span>
              <span className="text-neutral-400 text-lg leading-none">
                {isOpen ? "–" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 text-sm text-neutral-300">
                {it.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
