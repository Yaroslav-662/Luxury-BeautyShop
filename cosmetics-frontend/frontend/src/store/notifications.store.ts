// frontend/src/store/notifications.store.ts
import { create } from "zustand";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  add: (n: Omit<Notification, "id">) => void;
  remove: (id: string) => void;

  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

export const useNotificationsStore = create<NotificationStore>((set) => ({
  notifications: [],

  add: (n) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...n, id: crypto.randomUUID() },
      ],
    })),

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  success: (message, title = "Успішно") =>
    useNotificationsStore.getState().add({
      type: "success",
      title,
      message,
    }),

  error: (message, title = "Помилка") =>
    useNotificationsStore.getState().add({
      type: "error",
      title,
      message,
    }),

  info: (message, title = "Інформація") =>
    useNotificationsStore.getState().add({
      type: "info",
      title,
      message,
    }),

  warning: (message, title = "Увага") =>
    useNotificationsStore.getState().add({
      type: "warning",
      title,
      message,
    }),
}));
