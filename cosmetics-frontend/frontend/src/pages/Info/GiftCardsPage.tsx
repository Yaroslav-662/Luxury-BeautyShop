import InfoShell from "./components/InfoShell";

export default function GiftCardsPage() {
  return (
    <InfoShell
      title="Gift Cards"
      badge="Promo"
      subtitle="Подарункові сертифікати — швидкий подарунок. Можна активувати код на сторінці Redeem."
      cta={{ primaryText: "Redeem Card", primaryTo: "/redeem", secondaryText: "Contact", secondaryTo: "/contact" }}
      sections={[
        {
          id: "how",
          title: "Як працює",
          body: (
            <ol className="list-decimal pl-5 space-y-2">
              <li>Купуєш сертифікат</li>
              <li>Отримуєш код</li>
              <li>Активуєш у Redeem</li>
              <li>Використовуєш при оформленні замовлення (коли підключиш API для цього)</li>
            </ol>
          ),
        },
        {
          id: "values",
          title: "Номінали",
          body: (
            <div className="grid grid-cols-2 gap-3">
              {["500 ₴", "1000 ₴", "2000 ₴", "5000 ₴"].map((v) => (
                <div key={v} className="border border-white/10 bg-white/5 rounded-2xl p-4 text-center">
                  <div className="text-lg font-semibold text-white">{v}</div>
                  <div className="text-xs text-neutral-400">Gift Card</div>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "rules",
          title: "Правила",
          body: (
            <ul className="space-y-2">
              <li>• Код має термін дії (можна додати пізніше)</li>
              <li>• Сертифікат не підлягає поверненню після активації</li>
            </ul>
          ),
        },
      ]}
      faq={[
        { q: "Чи можна подарувати сертифікат іншій людині?", a: "Так, передай їй код." },
        { q: "Що якщо код не працює?", a: "Напиши в Contact — перевіримо." },
      ]}
    />
  );
}
