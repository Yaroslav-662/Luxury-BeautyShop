import InfoShell from "./components/InfoShell";

export default function PrivacyPage() {
  return (
    <InfoShell
      title="Privacy Policy"
      badge="Legal"
      subtitle="Як ми обробляємо дані користувача (email, замовлення, відгуки)."
      cta={{ primaryText: "Contact", primaryTo: "/contact" }}
      sections={[
        {
          id: "data",
          title: "Які дані ми зберігаємо",
          body: (
            <ul className="space-y-2">
              <li>• Email та дані профілю (для входу і замовлень)</li>
              <li>• Історія замовлень та статуси</li>
              <li>• Відгуки (авторство для прав видалення)</li>
            </ul>
          ),
        },
        {
          id: "purpose",
          title: "Навіщо ці дані",
          body: (
            <ul className="space-y-2">
              <li>• Оформлення та обробка замовлень</li>
              <li>• Безпека (auth, ролі)</li>
              <li>• Підтримка користувачів</li>
            </ul>
          ),
        },
        {
          id: "local",
          title: "Локальні дані в браузері",
          body: (
            <div className="space-y-2">
              <p>Кошик може зберігатися в localStorage. Це потрібно для зручності користувача.</p>
              <p>За бажанням користувач може очистити localStorage через налаштування браузера.</p>
            </div>
          ),
        },
      ]}
      faq={[
        { q: "Чи продаєте ви дані третім сторонам?", a: "Ні." },
        { q: "Як видалити акаунт?", a: "Напиши в підтримку — підкажемо процедуру." },
      ]}
    />
  );
}
