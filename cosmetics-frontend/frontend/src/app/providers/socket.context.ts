import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

export type SocketCtxValue = {
  socket: Socket | null;
  connected: boolean;
};

export const SocketContext = createContext<SocketCtxValue>({
  socket: null,
  connected: false,
});

export function useSocket() {
  return useContext(SocketContext);
}
