// src/store/favorites.store.ts
import { create } from "zustand";
import { toast } from "@/shared/ui/Toast";

type FavItem = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
};

const KEY = "beauty_favorites";

function load(): FavItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
function save(items: FavItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

interface FavState {
  items: FavItem[];
  count: number;
  toggle: (p: FavItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useFavoritesStore = create<FavState>((set, get) => ({
  items: load(),
  count: load().length,

  has: (id) => !!get().items.find((x) => x._id === id),

  toggle: (p) => {
    const items = get().items;
    const exists = items.some((x) => x._id === p._id);

    if (exists) {
      const updated = items.filter((x) => x._id !== p._id);
      save(updated);
      set({ items: updated, count: updated.length });
      toast.info(`${p.name.slice(0, 30)} видалено з обраних`, "💔");
    } else {
      const updated = [p, ...items];
      save(updated);
      set({ items: updated, count: updated.length });
      toast.success(`${p.name.slice(0, 30)} додано до обраних`, "♥");
    }
  },

  remove: (id) => {
    const { items } = get();
    const item = items.find((x) => x._id === id);
    const updated = items.filter((x) => x._id !== id);
    save(updated);
    set({ items: updated, count: updated.length });
    if (item) toast.info(`${item.name.slice(0, 30)} видалено з обраних`, "💔");
  },

  clear: () => {
    save([]);
    set({ items: [], count: 0 });
    toast.info("Список обраних очищено", "🗑️");
  },
}));

