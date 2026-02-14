// src/features/orders/hooks/useOrderRealtime.ts
import { useEffect } from "react";
import { useSocket } from "@/app/providers/SocketProvider";
import { useOrders } from "@/features/orders/store/useOrders";

export function useOrderRealtime() {
  const { socket } = useSocket();

  const setOrders = useOrders((s) => s.setOrders);
  const updateStatusRealtime = useOrders((s) => s.updateStatusRealtime);

  useEffect(() => {
    if (!socket) return;

    const onOrdersUpdated = (payload: any) => {
      // бек може прислати {orders} або order
      const orders = payload?.orders;
      if (Array.isArray(orders)) setOrders(orders);
    };

    const onStatusUpdated = (payload: any) => {
      const orderId = payload?.orderId || payload?._id;
      const status = payload?.status;
      if (orderId && status) updateStatusRealtime(orderId, status);
    };

    socket.on("orders:updated", onOrdersUpdated);
    socket.on("orderStatusUpdated", onStatusUpdated);

    return () => {
      socket.off("orders:updated", onOrdersUpdated);
      socket.off("orderStatusUpdated", onStatusUpdated);
    };
  }, [socket, setOrders, updateStatusRealtime]);
}
