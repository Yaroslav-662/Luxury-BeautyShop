import InfoShell from "./components/InfoShell";

export default function InvestorsPage() {
  return (
    <InfoShell
      title="Investors"
      badge="Corporate"
      subtitle="Інформація для партнерів та інвесторів. Стисло: продукт, технології, напрямки росту."
      cta={{ primaryText: "Contact", primaryTo: "/contact" }}
      sections={[
        {
          id: "product",
          title: "Продукт",
          body: (
            <div className="space-y-2">
              <p>Luxury BeautyShop — e-commerce платформа з каталогом, ролями, замовленнями та відгуками.</p>
              <p>Фокус: швидкість, дизайн (PDF-style), прозорі процеси замовлення.</p>
            </div>
          ),
        },
        {
          id: "stack",
          title: "Технології",
          body: (
            <ul className="space-y-2">
              <li>• React + Zustand</li>
              <li>• REST API + JWT</li>
              <li>• WebSocket для real-time</li>
              <li>• Адмін-панель з контролем доступів</li>
            </ul>
          ),
        },
        {
          id: "growth",
          title: "Напрямки росту",
          body: (
            <ul className="space-y-2">
              <li>• Розширення каталогу і брендів</li>
              <li>• Оплати (Stripe/LiqPay)</li>
              <li>• Gift Cards повністю через API</li>
              <li>• Аналітика та рекомендації</li>
            </ul>
          ),
        },
      ]}
      faq={[
        { q: "Чи є метрики/моніторинг?", a: "Може бути /metrics на бекенді (якщо підключено). На фронті — аналітика за потреби." },
        { q: "Яка модель монетизації?", a: "Класичний e-commerce: маржа + партнерські програми." },
      ]}
    />
  );
}
