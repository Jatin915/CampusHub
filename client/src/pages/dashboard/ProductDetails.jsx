import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  User,
  Tag,
  ShieldCheck,
  Heart
} from "lucide-react";

import DashboardLayout from "../../components/home/DashboardLayout";
import { getProductDetails } from "../../services/productServices";
import { addToCart } from "../../services/cartServices";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
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

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const { isWishlisted, toggleWishlist, updatingIds } = useWishlist();

  const [wishlistError, setWishlistError] = useState("");

  const wishlisted = product ? isWishlisted(product._id) : false;
  const updatingWishlist = product
    ? updatingIds.has(String(product._id))
    : false;

  const handleWishlistToggle = async () => {
    try {
      setWishlistError("");
      await toggleWishlist(product._id);
    } catch (error) {
      setWishlistError(
        error.response?.data?.message || "Unable to update wishlist.",
      );
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage("");
      setCartError("");

      await addToCart(product._id, quantity);

      setCartMessage("Product added to your cart successfully!");
    } catch (error) {
      setCartError(
        error.response?.data?.message || "Unable to add product to cart.",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getProductDetails(productId);
        setProduct(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to fetch product details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-96 rounded-2xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-slate-200" />
              <div className="h-10 w-1/2 rounded bg-slate-200" />
              <div className="h-32 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <Package size={42} className="mx-auto text-slate-300" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Product unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "This product could not be found."}
          </p>

          <Link
            to="/dashboard/home"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const images = product.images?.filter((image) => image.url) || [];
  const currentImage = images[selectedImage]?.url;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <Link
          to="/dashboard/home"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Marketplace
        </Link>

        {/* Product Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <section className="space-y-4">
            <div className="flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[450px]">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package size={72} className="text-slate-300" />
              )}
            </div>

            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.publicId || image.url}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                      selectedImage === index
                        ? "border-slate-900"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product Information */}
          <section className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {product.category?.name || "Uncategorized"}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {conditionLabels[product.condition] || product.condition}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Product Description
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {product.description}
              </p>
            </div>

            {/* Product Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Product Information
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <Tag size={17} />
                    Condition
                  </span>

                  <span className="text-sm font-medium text-slate-800">
                    {conditionLabels[product.condition] || product.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <Package size={17} />
                    Available Quantity
                  </span>

                  <span className="text-sm font-medium text-slate-800">
                    {product.quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Seller Information
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  {product.seller?.avatar?.url ? (
                    <img
                      src={product.seller.avatar.url}
                      alt={product.seller.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={22} className="text-slate-500" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {product.seller?.fullName || "Student"}
                  </p>
                  <p className="text-xs text-slate-500">Campus Seller</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-4">
              <ShieldCheck size={20} className="text-slate-700" />
              <p className="text-sm text-slate-700">
                Listed within your campus marketplace.
              </p>
            </div>

            <div className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity
                </label>

                <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
                  <button
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    disabled={quantity <= 1 || addingToCart}
                    className="p-3 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-12 text-center text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(product.quantity, current + 1),
                      )
                    }
                    disabled={quantity >= product.quantity || addingToCart}
                    className="p-3 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {product.quantity} units available
                </p>
              </div>

              <button
                type="button"
                onClick={handleWishlistToggle}
                disabled={updatingWishlist}
                aria-pressed={wishlisted}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Heart
                  size={19}
                  className={
                    wishlisted ? "fill-red-500 text-red-500" : "text-slate-600"
                  }
                />
                {updatingWishlist
                  ? "Updating..."
                  : wishlisted
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
              </button>

              {wishlistError && (
                <p className="text-sm text-red-600">{wishlistError}</p>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity < 1}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingBag size={19} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              {cartMessage && (
                <p className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 size={17} />
                  {cartMessage}
                </p>
              )}

              {cartError && <p className="text-sm text-red-600">{cartError}</p>}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetails;
