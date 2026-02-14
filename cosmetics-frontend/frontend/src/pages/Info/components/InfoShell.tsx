import React, { useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Accordion, { FAQItem } from "./Accordion";
import { NavLink } from "react-router-dom";

export type InfoSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export default function InfoShell({
  title,
  subtitle,
  badge,
  cta,
  sections,
  faq,
  showSearch = true,
  showContactCard = true,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  cta?: { primaryText: string; primaryTo: string; secondaryText?: string; secondaryTo?: string };
  sections: InfoSection[];
  faq?: FAQItem[];
  showSearch?: boolean;
  showContactCard?: boolean;
}) {
  const [search, setSearch] = useState("");

  const filteredSections = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return sections;

    return sections.filter((sec) => {
      const t = sec.title.toLowerCase();
      if (t.includes(s)) return true;
      // якщо body — строка
      const bodyStr = typeof sec.body === "string" ? sec.body.toLowerCase() : "";
      return bodyStr.includes(s);
    });
  }, [sections, search]);

  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
  }

  return (
    <>
      <MetaTags title={title} />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gold-300">{title}</h1>
              {badge && (
                <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-200">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-neutral-400 mt-2 max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* CTA */}
          {cta && (
            <div className="flex flex-col sm:flex-row gap-2">
              <NavLink to={cta.primaryTo}>
                <Button>{cta.primaryText}</Button>
              </NavLink>
              {cta.secondaryText && cta.secondaryTo && (
                <NavLink to={cta.secondaryTo}>
                  <Button variant="outline">{cta.secondaryText}</Button>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* TOOLBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {showSearch && (
            <div className="lg:col-span-7">
              <label className="text-xs text-neutral-400 block mb-1">
                Пошук по сторінці
              </label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Введи слово: доставка, повернення, гарантія..."
              />
            </div>
          )}

          <div className={`${showSearch ? "lg:col-span-5" : "lg:col-span-12"} border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4`}>
            <div className="text-xs text-neutral-400 mb-2">Перейти до секції</div>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jumpTo(s.id)}
                  className="text-xs px-3 py-2 rounded-full bg-white/5 border border-neutral-800 hover:bg-white/10"
                >
                  {s.title}
                </button>
              ))}
              {faq && faq.length > 0 && (
                <button
                  onClick={() => jumpTo("faq")}
                  className="text-xs px-3 py-2 rounded-full bg-white/5 border border-neutral-800 hover:bg-white/10"
                >
                  FAQ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${showContactCard ? "lg:col-span-8" : "lg:col-span-12"} space-y-4`}>
            {filteredSections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5"
              >
                <div className="text-lg font-semibold text-white mb-3">
                  {s.title}
                </div>
                <div className="text-sm text-neutral-300 leading-relaxed">
                  {s.body}
                </div>
              </section>
            ))}

            {faq && faq.length > 0 && (
              <section
                id="faq"
                className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5"
              >
                <div className="text-lg font-semibold text-white mb-3">FAQ</div>
                <Accordion items={faq} search={search} />
              </section>
            )}
          </div>

          {/* CONTACT CARD */}
          {showContactCard && (
            <aside className="lg:col-span-4 space-y-4">
              <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
                <div className="font-semibold text-white mb-2">Потрібна допомога?</div>
                <p className="text-sm text-neutral-300 mb-4">
                  Пиши нам — допоможемо з замовленням, доставкою, поверненням або товаром.
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-neutral-400">Email</span>
                    <button
                      className="text-neutral-200 hover:text-white"
                      onClick={() => copy("support@beautyshop.local")}
                      title="Copy"
                    >
                      support@beautyshop.local
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-neutral-400">Графік</span>
                    <span className="text-neutral-200">10:00–19:00</span>
                  </div>

                  <div className="pt-3">
                    <NavLink to="/contact">
                      <Button className="w-full">Contact Us</Button>
                    </NavLink>
                  </div>

                  <div>
                    <NavLink to="/shipping" className="text-xs text-neutral-400 hover:text-white">
                      Shipping
                    </NavLink>
                    {" · "}
                    <NavLink to="/returns" className="text-xs text-neutral-400 hover:text-white">
                      Returns
                    </NavLink>
                    {" · "}
                    <NavLink to="/payments" className="text-xs text-neutral-400 hover:text-white">
                      Payments
                    </NavLink>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
                <div className="font-semibold text-white mb-2">Підказка</div>
                <p className="text-sm text-neutral-300">
                  Якщо сторінки мають бути “як в PDF”, тримаємо: чорний фон, золото в заголовках,
                  великі відступи, cards, мінімум шуму.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
