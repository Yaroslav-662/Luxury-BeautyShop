import React, { useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  function send() {
    const e = email.trim();
    const m = msg.trim();
    if (!e || !m) return alert("Заповни email і повідомлення");
    const subject = encodeURIComponent("BeautyShop support");
    const body = encodeURIComponent(`From: ${e}\n\n${m}`);
    window.location.href = `mailto:support@beautyshop.local?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <MetaTags title="Contact" />
      <h1 className="text-2xl font-bold text-gold-300 mb-2">Contact</h1>
      <p className="text-sm text-neutral-400 mb-6">Зв’яжись з нами щодо замовлення, повернення або товарів.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3">
          <div className="font-semibold text-white">Написати</div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Повідомлення</label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full min-h-[140px] rounded-2xl bg-white/5 border border-neutral-800 px-4 py-3 text-sm outline-none focus:border-neutral-500"
              placeholder="Опиши проблему або питання…"
            />
          </div>

          <Button onClick={send}>Надіслати</Button>
        </div>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3">
          <div className="font-semibold text-white">Контакти</div>
          <div className="text-sm text-neutral-300 space-y-2">
            <div>• Email: support@beautyshop.local</div>
            <div>• Графік: 10:00–19:00 (Пн–Сб)</div>
            <div>• Місто: Україна</div>
          </div>

          <div className="pt-3 text-xs text-neutral-500">
            (Потім легко додамо реальну інтеграцію: Telegram bot/CRM/Backend tickets)
          </div>
        </div>
      </div>
    </>
  );
}
