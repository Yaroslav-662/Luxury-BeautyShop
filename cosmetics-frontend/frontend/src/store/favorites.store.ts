import { create } from "zustand";

type FavItem = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
};

const KEY = "beauty_favorites";

function load(): FavItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
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
    const updated = exists ? items.filter((x) => x._id !== p._id) : [p, ...items];
    save(updated);
    set({ items: updated, count: updated.length });
  },

  remove: (id) => {
    const updated = get().items.filter((x) => x._id !== id);
    save(updated);
    set({ items: updated, count: updated.length });
  },

  clear: () => {
    save([]);
    set({ items: [], count: 0 });
  },
}));
