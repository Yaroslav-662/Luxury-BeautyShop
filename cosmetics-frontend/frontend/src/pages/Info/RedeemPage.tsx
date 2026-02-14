import React, { useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

function normalizeCode(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");

  const valid = useMemo(() => {
    const c = normalizeCode(code).trim();
    return c.length >= 8;
  }, [code]);

  function redeem() {
    const c = normalizeCode(code).trim();
    if (!c) return;
    // тут потім підключиш реальний API
    setStatus("ok");
  }

  function reset() {
    setCode("");
    setStatus("idle");
  }

  return (
    <>
      <MetaTags title="Redeem Gift Card" />

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Redeem Card</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Введи код сертифікату. Зараз це UI-готовність під майбутній API.
        </p>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Gift Code</label>
            <Input
              value={code}
              onChange={(e) => {
                setStatus("idle");
                setCode(normalizeCode(e.target.value));
              }}
              placeholder="XXXX-XXXX-XXXX"
            />
            <div className="text-xs mt-2">
              {status === "idle" && (
                <span className={valid ? "text-neutral-400" : "text-red-400"}>
                  {valid ? "Код виглядає коректно." : "Введи мінімум 8 символів."}
                </span>
              )}
              {status === "ok" && <span className="text-green-400">Код прийнято (demo). Можна застосувати до замовлення.</span>}
              {status === "bad" && <span className="text-red-400">Код не знайдено.</span>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={redeem} disabled={!valid}>
              Активувати
            </Button>
            <Button variant="outline" onClick={reset}>
              Очистити
            </Button>
          </div>

          <div className="text-xs text-neutral-500">
            Після підключення API сюди додамо: перевірку коду, баланс, застосування в Checkout.
          </div>
        </div>
      </div>
    </>
  );
}
