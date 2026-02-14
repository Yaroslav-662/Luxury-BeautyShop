import InfoShell from "./components/InfoShell";

export default function AboutPage() {
  return (
    <InfoShell
      title="About Us"
      badge="Company"
      subtitle="Luxury BeautyShop — преміальна косметика у стилі Black & Gold. Ми будуємо повний e-commerce з ролями, real-time оновленнями та адмін-панеллю."
      cta={{
        primaryText: "Go to Shop",
        primaryTo: "/shop",
        secondaryText: "Contact",
        secondaryTo: "/contact",
      }}
      sections={[
        {
          id: "mission",
          title: "Місія",
          body: (
            <div className="space-y-2">
              <p>
                Зробити підбір косметики простим, швидким і естетичним: як у люксовому бутіку —
                але онлайн.
              </p>
              <p>
                Ми фокусуємось на UX: зрозумілий каталог, пошук, відгуки, кошик і замовлення.
              </p>
            </div>
          ),
        },
        {
          id: "service",
          title: "Сервіс",
          body: (
            <ul className="space-y-2">
              <li>• Каталог з пошуком та фільтрами</li>
              <li>• Відгуки: публічний перегляд + додавання лише для зареєстрованих</li>
              <li>• Кошик у localStorage + checkout</li>
              <li>• Адмін-панель: керування товарами/категоріями/замовленнями/відгуками</li>
            </ul>
          ),
        },
        {
          id: "tech",
          title: "Технології",
          body: (
            <ul className="space-y-2">
              <li>• REST API + JWT</li>
              <li>• WebSocket для реального часу</li>
              <li>• React + Zustand + власні UI компоненти</li>
            </ul>
          ),
        },
      ]}
      faq={[
        { q: "Чи можна купити без реєстрації?", a: "Перегляд каталогу — так. Оформлення замовлення/відгуки — після входу." },
        { q: "Чи є адмін доступ?", a: "Так, роль admin бачить адмін-панель і має розширені права." },
      ]}
    />
  );
}
