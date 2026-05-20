// src/shared/ui/Toast.tsx
import React, { useEffect } from "react";
import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon?: string;
}

interface ToastState {
  toasts: Toast[];
  add: (message: string, type?: ToastType, icon?: string) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message, type = "success", icon) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type, icon }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Хелпери для зручного виклику
export const toast = {
  success: (msg: string, icon?: string) => useToastStore.getState().add(msg, "success", icon),
  error: (msg: string, icon?: string) => useToastStore.getState().add(msg, "error", icon),
  info: (msg: string, icon?: string) => useToastStore.getState().add(msg, "info", icon),
  warning: (msg: string, icon?: string) => useToastStore.getState().add(msg, "warning", icon),
};

const COLORS: Record<ToastType, string> = {
  success: "bg-neutral-900 border-green-500/50 text-white",
  error:   "bg-neutral-900 border-red-500/50 text-white",
  info:    "bg-neutral-900 border-blue-500/50 text-white",
  warning: "bg-neutral-900 border-yellow-500/50 text-white",
};

const ICONS: Record<ToastType, string> = {
  success: "✅",
  error:   "❌",
  info:    "ℹ️",
  warning: "⚠️",
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={onRemove}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl cursor-pointer
        backdrop-blur-sm min-w-[260px] max-w-[340px] animate-slide-in
        ${COLORS[toast.type]}`}
    >
      <span className="text-lg shrink-0">{toast.icon || ICONS[toast.type]}</span>
      <span className="text-sm font-medium leading-snug">{toast.message}</span>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, remove } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
};
