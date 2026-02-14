import { useEffect } from "react";
import { useUIStore } from "@/store/ui.store";

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return { theme, setTheme };
};
