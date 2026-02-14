// src/admin/Orders/OrderDetails.tsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="text-red-400">
        Невірний ідентифікатор замовлення
      </div>
    );
  }

  return (
    <>
      <MetaTags title={`Адмін — Замовлення ${id}`} />

      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gold-300 mb-4">
            Деталі замовлення
          </h1>

          <p className="text-neutral-300">
            ID замовлення:{" "}
            <span className="text-white font-mono">{id}</span>
          </p>

          {/* Тут пізніше підключиш useOrders / API */}
          <p className="text-neutral-400 mt-2">
            (Дані замовлення будуть тут)
          </p>

          <div className="mt-6">
            <Link to="/admin/orders">
              <Button variant="outline">
                ← Назад до замовлень
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
