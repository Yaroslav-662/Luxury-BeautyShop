import { MetaTags } from "@/app/seo/MetaTags";

export default function PaymentsPage() {
  return (
    <>
      <MetaTags title="Payments" />
      <h1 className="text-2xl font-bold text-gold-300 mb-2">Payments</h1>
      <p className="text-sm text-neutral-400 mb-6">Способи оплати (можна розширювати під твою реалізацію checkout).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
          <div className="font-semibold text-white mb-2">Карткою онлайн</div>
          <p className="text-sm text-neutral-300">
            Оплата карткою (LiqPay/WayForPay/Stripe — підключиш пізніше).
          </p>
        </div>

        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-5">
          <div className="font-semibold text-white mb-2">Післяплата</div>
          <p className="text-sm text-neutral-300">
            Післяплата на відділенні (за умовами перевізника).
          </p>
        </div>
      </div>
    </>
  );
}
