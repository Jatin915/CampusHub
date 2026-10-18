import {
  Check,
  MapPin,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

const CartItem = ({
  product,
  selected,
  onToggleSelection,
  onUpdateQuantity,
  onRemove,
  formatPrice,
}) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:p-5">
      <div className="grid grid-cols-[24px_88px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_134px_minmax(0,1fr)] sm:gap-5">
        {/* Selection checkbox */}
        <button
          type="button"
          onClick={() => onToggleSelection(product.id)}
          aria-label={`${selected ? "Deselect" : "Select"} ${product.name}`}
          aria-pressed={selected}
          className={`mt-8 flex h-5 w-5 items-center justify-center rounded-md border transition ${
            selected
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white"
          }`}
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </button>

        {/* Product image */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-[88px] rounded-xl bg-slate-100 object-cover sm:h-[118px] sm:w-[134px]"
          />
        ) : (
          <div className="flex h-24 w-[88px] items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-[118px] sm:w-[134px]">
            No image
          </div>
        )}

        {/* Product details */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-5 sm:text-base">
                {product.name}
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {product.category}
              </p>
            </div>

            <p className="text-base font-bold sm:text-xl">
              {formatPrice(product.price * product.quantity)}
            </p>
          </div>

          <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {product.condition}
          </span>

          <div className="mt-2 space-y-1 text-xs text-slate-500 sm:text-sm">
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {product.college}
            </p>

            <p>{product.listed}</p>
          </div>

          {/* Quantity and remove controls */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4">
            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200">
              <button
                type="button"
                disabled={product.quantity <= 1}
                onClick={() => onUpdateQuantity(product.id, -1)}
                aria-label={`Decrease ${product.name} quantity`}
                className="flex h-full w-8 items-center justify-center hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="flex h-full min-w-10 items-center justify-center border-x border-slate-200 px-2 text-sm font-medium">
                {product.quantity}
              </span>

              <button
                type="button"
                disabled={product.quantity >= product.stock}
                onClick={() => onUpdateQuantity(product.id, 1)}
                aria-label={`Increase ${product.name} quantity`}
                className="flex h-full w-8 items-center justify-center hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(product.id)}
              aria-label={`Remove ${product.name}`}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;