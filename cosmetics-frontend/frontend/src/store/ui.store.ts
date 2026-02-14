import { create } from "zustand";

type Theme = "light" | "dark";

interface UIState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));
