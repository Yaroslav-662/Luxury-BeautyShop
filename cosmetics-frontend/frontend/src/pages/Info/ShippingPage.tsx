import { MetaTags } from "@/app/seo/MetaTags";

export default function ShippingPage() {
  return (
    <>
      <MetaTags title="Shipping" />
      <h1 className="text-2xl font-bold text-gold-300 mb-2">Shipping</h1>
      <p className="text-sm text-neutral-400 mb-6">Доставка по Україні. Актуальні умови для інтернет-замовлень.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
          <div className="font-semibold text-white mb-2">Терміни</div>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>• Нова Пошта: 1–3 дні (залежить від міста)</li>
            <li>• Самовивіз: якщо доступний у твоєму місті (можна додати пізніше)</li>
            <li>• Після оформлення — статус замовлення оновлюється (у тебе є WS події для order).</li>
          </ul>
        </div>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
          <div className="font-semibold text-white mb-2">Вартість</div>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>• Безкоштовна доставка від 200$ (як у PDF — можна змінити під ₴)</li>
            <li>• Інакше — за тарифами перевізника</li>
          </ul>
        </div>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5 md:col-span-2">
          <div className="font-semibold text-white mb-2">FAQ</div>
          <div className="text-sm text-neutral-300 space-y-2">
            <div>• Як відстежити? — у “Orders” після входу + real-time статус.</div>
            <div>• Що якщо товар пошкоджений? — дивись “Returns & Warranty”.</div>
          </div>
        </div>
      </div>
    </>
  );
}
