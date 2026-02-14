// frontend/src/app/providers/NotificationProvider.tsx
import { useNotificationsStore } from "@/store/notifications.store";
import { useEffect } from "react";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const { notifications, remove } = useNotificationsStore();

  // авто-видалення через 4 секунди
  useEffect(() => {
    if (!notifications.length) return;

    const timers = notifications.map((n) =>
      setTimeout(() => remove(n.id), 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, remove]);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`min-w-[240px] max-w-xs px-4 py-3 rounded-md shadow-lg border
              ${
                n.type === "error"
                  ? "bg-red-900 border-red-500 text-white"
                  : n.type === "success"
                  ? "bg-emerald-900 border-emerald-500 text-white"
                  : "bg-gray-900 border-gray-600 text-gray-100"
              }`}
          >
            {n.title && (
              <div className="font-semibold mb-1">
                {n.title}
              </div>
            )}
            <div className="text-sm">{n.message}</div>
          </div>
        ))}
      </div>
    </>
  );
}
