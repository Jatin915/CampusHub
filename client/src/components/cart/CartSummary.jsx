import { ArrowRight, Info } from "lucide-react";

const CartSummary = ({
  selectedCount,
  subtotal,
  formatPrice,
  onCheckout,
  checkoutLoading = false,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold">Order Summary</h2>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-600">
        <span>Items ({selectedCount})</span>

        <span className="font-medium text-slate-800">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          Meet-up / Delivery
          <Info className="h-3.5 w-3.5" />
        </span>

        <span>{formatPrice(0)}</span>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        Arrange pickup with the seller on campus. No delivery fee is included.
      </p>

      <div className="my-5 border-t border-slate-200" />

      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">Total Amount</span>

        <span className="text-xl font-bold">
          {formatPrice(subtotal)}
        </span>
      </div>

      <button
        type="button"
        disabled={selectedCount === 0 || checkoutLoading}
        onClick={onCheckout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {checkoutLoading ? "Processing..." : "Proceed to Checkout"}

        {!checkoutLoading && <ArrowRight className="h-4 w-4" />}
      </button>
    </section>
  );
};

export default CartSummary;