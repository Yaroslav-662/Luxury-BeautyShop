import InfoShell from "./components/InfoShell";

export default function AffiliatesPage() {
  return (
    <InfoShell
      title="Affiliates"
      badge="Partners"
      subtitle="Партнерська програма для блогерів, візажистів і магазинів."
      cta={{ primaryText: "Contact", primaryTo: "/contact", secondaryText: "Shop", secondaryTo: "/shop" }}
      sections={[
        {
          id: "who",
          title: "Для кого",
          body: (
            <ul className="space-y-2">
              <li>• Блогери та контент-креатори</li>
              <li>• Візажисти / студії</li>
              <li>• Партнерські магазини</li>
            </ul>
          ),
        },
        {
          id: "benefits",
          title: "Переваги",
          body: (
            <ul className="space-y-2">
              <li>• Знижки/комісія (умови узгоджуються індивідуально)</li>
              <li>• Реферальні підбірки (можна реалізувати як /shop?q=...)</li>
              <li>• Пріоритетна підтримка</li>
            </ul>
          ),
        },
        {
          id: "join",
          title: "Як долучитись",
          body: (
            <ol className="list-decimal pl-5 space-y-2">
              <li>Напиши через Contact</li>
              <li>Опиши аудиторію/канали</li>
              <li>Отримай умови та реф-код</li>
            </ol>
          ),
        },
      ]}
      faq={[
        { q: "Чи є мінімальні вимоги?", a: "Ні жорстких. Важлива якість аудиторії та контенту." },
        { q: "Як трекати продажі?", a: "Після підключення можна зробити реф-посилання/UTM та статистику." },
      ]}
    />
  );
}
