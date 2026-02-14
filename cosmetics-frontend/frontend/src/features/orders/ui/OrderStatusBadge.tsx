// src/features/orders/ui/OrderStatusBadge.tsx

import React from "react";
import type { OrderStatus } from "../model/order.types";
import  Badge  from "@/shared/ui/Badge";

interface Props {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<Props> = ({ status }) => {
  let color =
    "bg-neutral-800 text-neutral-100 border border-neutral-600";

  if (status === "pending") {
    color = "bg-amber-500/10 text-amber-300 border border-amber-500/40";
  } else if (status === "paid") {
    color = "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
  } else if (status === "shipped") {
    color = "bg-sky-500/10 text-sky-300 border border-sky-500/40";
  } else if (status === "delivered") {
    color = "bg-lime-500/10 text-lime-300 border border-lime-500/40";
  } else if (status === "cancelled") {
    color = "bg-red-500/10 text-red-300 border border-red-500/40";
  }

  return (
    <Badge className={color}>
      {status === "pending" && "В обробці"}
      {status === "paid" && "Оплачено"}
      {status === "shipped" && "Відправлено"}
      {status === "delivered" && "Доставлено"}
      {status === "cancelled" && "Скасовано"}
    </Badge>
  );
};
