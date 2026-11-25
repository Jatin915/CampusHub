
import { useState } from "react";
import { Package, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";

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

  const { isWishlisted, toggleWishlist, updatingIds } = useWishlist();

  const [wishlistError, setWishlistError] = useState("");

  const wishlisted = isWishlisted(product._id);
  const isUpdating = updatingIds.has(String(product._id));

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setWishlistError("");
      await toggleWishlist(product._id);
    } catch (error) {
      setWishlistError(
        error.response?.data?.message || "Unable to update wishlist.",
      );
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {/* Wishlist button */}
      <button
        type="button"
        onClick={handleWishlistClick}
        disabled={isUpdating}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Heart
          size={19}
          className={
            wishlisted
              ? "fill-red-500 text-red-500"
              : "text-slate-600"
          }
        />
      </button>

      <Link
        to={`/dashboard/products/${product._id}`}
        className="block"
      >
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
      </Link>

      {wishlistError && (
        <p className="px-4 pb-3 text-xs text-red-600">
          {wishlistError}
        </p>
      )}
    </div>
  );
};

export default ProductCard;
