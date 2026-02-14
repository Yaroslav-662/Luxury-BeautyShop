// src/app/providers/SocketProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { tokenStore } from "@/core/auth/tokenStore";

import type { ServerToClientEvents, ClientToServerEvents } from "./socket.types";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type Ctx = {
  socket: AppSocket | null;
  connected: boolean;
};

const SocketContext = createContext<Ctx | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const access = tokenStore.getAccessToken();


    // якщо немає токена — не підключаємо socket
    if (!access) {
      if (socket) socket.disconnect();
      setSocket(null);
      setConnected(false);
      return;
    }

    const s: AppSocket = io(apiUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      auth: { token: access },
    });

    setSocket(s);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within <SocketProvider />");
  return ctx;
}

