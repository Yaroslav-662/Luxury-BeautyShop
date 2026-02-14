import { MetaTags } from "@/app/seo/MetaTags";

export default function ReturnsPage() {
  return (
    <>
      <MetaTags title="Returns & Warranty" />
      <h1 className="text-2xl font-bold text-gold-300 mb-2">Returns & Warranty</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Повернення та гарантія. Косметика має особливі умови (гігієнічний товар).
      </p>

      <div className="space-y-4">
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
          <div className="font-semibold text-white mb-2">Коли можливе повернення</div>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>• Товар не відкритий, збережено упаковку</li>
            <li>• Є чек/підтвердження замовлення</li>
            <li>• Звернення в межах визначених законом термінів</li>
          </ul>
        </div>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
          <div className="font-semibold text-white mb-2">Як оформити</div>
          <ol className="text-sm text-neutral-300 space-y-2 list-decimal pl-5">
            <li>Зайди в Orders → відкрий замовлення</li>
            <li>Зв’яжись через Contact (форма/телеграм/емейл)</li>
            <li>Отримай інструкції по відправці</li>
          </ol>
        </div>
      </div>
    </>
  );
}
