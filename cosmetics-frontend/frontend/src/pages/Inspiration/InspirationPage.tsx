import React from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button";

const cards = [
  { title: "Glow makeup", q: "glow", text: "Світлий та сяючий макіяж на щодень." },
  { title: "Red lipstick", q: "помада", text: "Класика: підбір найкращих помад." },
  { title: "Smoky eyes", q: "тіні", text: "Вечірній образ, що працює завжди." },
  { title: "Skincare routine", q: "догляд", text: "Базовий догляд для здорової шкіри." },
];

export default function InspirationPage() {
  const navigate = useNavigate();

  return (
    <>
      <MetaTags title="Inspiration" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold-300">Inspiration</h1>
        <p className="text-sm text-neutral-400">
          Підбірки ідеї та образів. Натискай — і ми відкриємо каталог із потрібним пошуком.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 space-y-3">
            <div className="text-lg font-semibold text-white">{c.title}</div>
            <div className="text-sm text-neutral-400">{c.text}</div>
            <Button onClick={() => navigate(`/shop?q=${encodeURIComponent(c.q)}`)}>
              Переглянути підбірку
            </Button>
          </div>
        ))}
      </section>

      <section className="mt-8 border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6">
        <div className="text-lg font-semibold text-white mb-2">Порада дня</div>
        <p className="text-neutral-300 text-sm">
          Для “Black & Gold” стилю з PDF круто працює правило: один акцент (золото) + чистий чорний фон + великі відступи.
          Ти вже це витримуєш у Layout — тепер просто тримаємо консистентність у сторінках.
        </p>
      </section>
    </>
  );
}
