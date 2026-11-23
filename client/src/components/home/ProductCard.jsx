
import { Package } from "lucide-react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const conditionLabels = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
};

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-48 items-center justify-center bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package size={48} className="text-slate-300" />
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          {conditionLabels[product.condition] || product.condition}
        </span>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium text-slate-500">
          {product.category?.name || "Uncategorized"}
        </p>

        <h3 className="truncate text-base font-semibold text-slate-900">
          {product.name}
        </h3>

        <p className="mt-2 text-xl font-bold text-slate-900">
          {formatPrice(product.price)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="max-w-[65%] truncate text-sm text-slate-500">
            {product.seller?.fullName || "Student"}
          </span>

          <span className="text-xs text-slate-500">
            Qty: {product.quantity}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
