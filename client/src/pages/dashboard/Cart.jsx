import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import CartBenefits from "../../components/cart/CartBenefits";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";

import { createCheckout, verifyPayment } from "../../services/paymentService";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProducts = useMemo(
    () => cart.filter((product) => selectedIds.includes(product.id)),
    [cart, selectedIds],
  );

  const subtotal = useMemo(
    () =>
      selectedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0,
      ),
    [selectedProducts],
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
      current.length === cart.length ? [] : cart.map((product) => product.id),
    );
  };

  const updateQuantity = async (id, change) => {
    const product = cart.find((item) => item.id === id);

    if (!product) return;

    const newQuantity = Math.max(
      1,
      Math.min(product.stock, product.quantity + change),
    );

    if (newQuantity === product.quantity) return;

    try {
      await updateCartItem(id, newQuantity);

      setCart((current) =>
        current.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update cart quantity:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const removeProduct = async (id) => {
    try {
      await removeCartItem(id);

      setCart((current) => current.filter((product) => product.id !== id));

      setSelectedIds((current) => current.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const removeSelected = async () => {
    const idsToRemove = [...selectedIds];

    if (idsToRemove.length === 0) return;

    try {
      await Promise.all(idsToRemove.map((id) => removeCartItem(id)));

      setCart((current) =>
        current.filter((product) => !idsToRemove.includes(product.id)),
      );

      setSelectedIds([]);
    } catch (error) {
      console.error(
        "Failed to remove selected items:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    if (checkoutLoading) return;

    if (!window.Razorpay) {
      setError("Payment gateway failed to load. Please refresh the page.");
      return;
    }

    setCheckoutLoading(true);
    setError("");

    // Preserve the exact selection submitted for checkout.
    const productIdsToOrder = [...selectedIds];

    try {
      // Step 1: Create checkout session on the backend.
      const checkoutResponse = await createCheckout(
        productIdsToOrder,
        crypto.randomUUID(),
      );

      const checkout = checkoutResponse.data;

      if (
        !checkout?.paymentId ||
        !checkout?.razorpayOrderId ||
        !checkout?.keyId
      ) {
        throw new Error("Invalid checkout response from server.");
      }

      // Step 2: Open Razorpay Checkout.
      const options = {
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "CampusHub",
        description: "Campus marketplace purchase",
        order_id: checkout.razorpayOrderId,

        handler: async (razorpayResponse) => {
          try {
            setError("");

            // Step 3: Verify payment with the backend.
            const verificationResponse = await verifyPayment({
              paymentId: checkout.paymentId,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            if (verificationResponse.success === false) {
              throw new Error("Payment verification failed.");
            }

            // Step 4: Update UI only after backend verification succeeds.
            setCart((current) =>
              current.filter(
                (product) => !productIdsToOrder.includes(product.id),
              ),
            );

            setSelectedIds((current) =>
              current.filter((id) => !productIdsToOrder.includes(id)),
            );
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error.response?.data?.message || error.message,
            );

            setError(
              "Payment verification is pending. Please check your orders before retrying.",
            );
          } finally {
            setCheckoutLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setCheckoutLoading(false);
          },
        },

        theme: {
          color: "#0f172a",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error(
          "Payment failed:",
          response.error?.description || "Unknown payment error",
        );

        setError(
          "Payment failed. Your cart has been kept unchanged. You can try again.",
        );

        setCheckoutLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout failed:",
        error.response?.data?.message || error.message,
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start checkout. Please try again.",
      );

      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCart();
        const cartItems = response.data.items || [];

        const formattedProducts = cartItems
          .filter((item) => item.product)
          .map((item) => ({
            id: item.product._id,
            name: item.product.name,
            category: item.product.category?.name || "Uncategorized",
            condition: item.product.condition || "GOOD",
            college: item.product.college?.name || "Your College",
            listed: "Recently listed",
            price: item.product.price,
            quantity: item.quantity,
            stock: item.product.quantity,
            image: item.product.images?.[0]?.url || "",
          }));

        setCart(formattedProducts);
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
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading your cart...
            </p>
          ) : (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="font-semibold text-red-800">
                    Payment not completed
                  </p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <p className="mt-2 text-sm text-red-700">
                    Your cart is unchanged. You can try again.
                  </p>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <ShoppingCart className="h-8 w-8 text-slate-700" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    Your cart is empty
                  </h2>

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
                    {cart.map((product) => (
                      <CartItem
                        key={product.id}
                        product={product}
                        selected={selectedIds.includes(product.id)}
                        onToggleSelection={toggleSelection}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeProduct}
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={toggleAll}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          cart.length > 0 && selectedIds.length === cart.length
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {cart.length > 0 &&
                          selectedIds.length === cart.length && (
                            <span className="text-xs">✓</span>
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
                      Remove Selected ({selectedIds.length})
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24">
          {!loading && !error && (
            <CartSummary
              selectedCount={selectedCount}
              subtotal={subtotal}
              formatPrice={formatPrice}
              onCheckout={handleCheckout}
              checkoutLoading={checkoutLoading}
            />
          )}

          <CartBenefits />
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default Cart;
