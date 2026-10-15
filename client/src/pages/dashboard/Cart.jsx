import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Info,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Box,
  MessageCircle,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getCart, updateCartItem, removeCartItem } from "../../services/cartService";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedProducts = products.filter((product) =>
    selectedIds.includes(product.id),
  );

  const subtotal = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          selectedIds.includes(product.id)
            ? total + product.price * product.quantity
            : total,
        0,
      ),
    [products, selectedIds],
  );

  const selectedCount = selectedProducts.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const toggleSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.length === products.length
        ? []
        : products.map((product) => product.id),
    );
  };

  const updateQuantity = async (id, change) => {
  const product = products.find((item) => item.id === id);

  if (!product) return;

  const newQuantity = Math.max(
    1,
    Math.min(product.stock, product.quantity + change),
  );

  if (newQuantity === product.quantity) return;

  try {
    await updateCartItem(id, newQuantity);

    setProducts((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  } catch (error) {
    console.error("Failed to update cart quantity:", error);
  }
};

  const removeProduct = async (id) => {
    try {
      await removeCartItem(id);

      setProducts((current) => current.filter((product) => product.id !== id));

      setSelectedIds((current) => current.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const removeSelected = async () => {
  try {
    await Promise.all(
      selectedIds.map((id) => removeCartItem(id))
    );

    setProducts((current) =>
      current.filter((product) => !selectedIds.includes(product.id))
    );

    setSelectedIds([]);
  } catch (error) {
    console.error("Failed to remove selected items:", error);
  }
};

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCart();

        console.log("Cart API response:", response);

        // Is mapping ko actual API response shape ke according adjust karna hoga.
        const cartItems = response.data.items;

        const formattedProducts = cartItems
          .filter((item) => item.product)
          .map((item) => ({
            id: item.product._id,
            name: item.product.name,
            category: item.product.category?.name || "Uncategorized",
            condition: item.product.condition || "Good",
            college: item.product.college?.name || "Your College",
            listed: "Recently listed",
            price: item.product.price,
            quantity: item.quantity,
            stock: item.product.quantity,
            image: item.product.images?.[0]?.url || "",
          }));

        setProducts(formattedProducts);
        setSelectedIds(formattedProducts.map((product) => product.id));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setError("Unable to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_335px]">
        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Your Cart
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Review your selected items before checkout
              </p>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {products.length} {products.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading your cart...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-red-600">{error}</p>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <ShoppingCart className="h-8 w-8 text-slate-700" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-sm text-slate-500">
                Explore your campus marketplace to find something useful.
              </p>
              <Link
                to="/dashboard/home"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Continue shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {products.map((product) => {
                  const selected = selectedIds.includes(product.id);

                  return (
                    <article
                      key={product.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:p-5"
                    >
                      <div className="grid grid-cols-[24px_88px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_134px_minmax(0,1fr)] sm:gap-5">
                        <button
                          type="button"
                          onClick={() => toggleSelection(product.id)}
                          aria-label={`${
                            selected ? "Deselect" : "Select"
                          } ${product.name}`}
                          aria-pressed={selected}
                          className={`mt-8 flex h-5 w-5 items-center justify-center rounded-md border transition ${
                            selected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </button>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-[88px] rounded-xl bg-slate-100 object-cover sm:h-[118px] sm:w-[134px]"
                        />

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

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4">
                            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200">
                              <button
                                type="button"
                                disabled={product.quantity <= 1}
                                onClick={() => updateQuantity(product.id, -1)}
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
                                onClick={() => updateQuantity(product.id, 1)}
                                aria-label={`Increase ${product.name} quantity`}
                                className="flex h-full w-8 items-center justify-center hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
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
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      selectedIds.length === products.length
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedIds.length === products.length && (
                      <Check className="h-3 w-3" />
                    )}
                  </span>
                  Select all
                </button>

                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={removeSelected}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Selected ({selectedIds.length})
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24">
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
              Arrange pickup with the seller on campus. No delivery fee is
              included.
            </p>

            <div className="my-5 border-t border-slate-200" />

            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Total Amount</span>
              <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
            </div>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() =>
                window.alert("Checkout integration will be added next.")
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Secure Transactions</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Verify the product before completing an exchange.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Meet on Campus</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Coordinate a convenient pickup with the seller.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Need Help?</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Contact the CampusHub support team.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default Cart;
