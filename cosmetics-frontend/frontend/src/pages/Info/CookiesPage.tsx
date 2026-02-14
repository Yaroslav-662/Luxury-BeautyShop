import InfoShell from "./components/InfoShell";

export default function CookiesPage() {
  return (
    <InfoShell
      title="Cookies"
      badge="Info"
      subtitle="Cookie та localStorage: що ми використовуємо і для чого."
      sections={[
        {
          id: "cookies",
          title: "Cookies",
          body: (
            <div className="space-y-2">
              <p>Cookies можуть використовуватись для сесій/авторизації (залежить від реалізації бекенду).</p>
              <p>Якщо токени зберігаються у cookie — це підвищує безпеку проти XSS.</p>
            </div>
          ),
        },
        {
          id: "localstorage",
          title: "localStorage",
          body: (
            <ul className="space-y-2">
              <li>• Кошик зберігається локально (cart.store)</li>
              <li>• Wishlist може зберігатися локально (favorites.store)</li>
            </ul>
          ),
        },
        {
          id: "manage",
          title: "Як керувати",
          body: (
            <ul className="space-y-2">
              <li>• Очистити дані сайту у браузері</li>
              <li>• Використати режим інкогніто (дані не збережуться)</li>
            </ul>
          ),
        },
      ]}
      faq={[
        { q: "Чому кошик не очищається після перезавантаження?", a: "Бо він спеціально зберігається в localStorage." },
        { q: "Чи можу я вимкнути localStorage?", a: "Можна, але тоді кошик/лист бажань не працюватиме коректно." },
      ]}
    />
  );
}
