import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Store,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Circle,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../../components/home/DashboardLayout";
import {
  getOrderById,
  confirmOrderReceived,
} from "../../services/orderServices";

const STATUS_STYLES = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  READY_FOR_PICKUP: "bg-purple-50 text-purple-700",
  AWAITING_CONFIRMATION: "bg-orange-50 text-orange-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const formatStatus = (status) =>
  status
    ?.split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ") || "Unknown";

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-800">
        {value || "N/A"}
      </span>
    </div>
  );
}

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderById(orderId);
      setOrder(response?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleConfirmReceived = async () => {
    try {
      setConfirming(true);
      setActionError("");
      setSuccessMessage("");

      const response = await confirmOrderReceived(orderId);

      setSuccessMessage(response?.message || "Receipt confirmed successfully.");

      await fetchOrder();
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Unable to confirm receipt.",
      );
    } finally {
      setConfirming(false);
    }
  };

  const isPaid = order?.payment?.status === "PAID";
  const isCancelled = order?.status === "CANCELLED";
  const isPaymentFailed = order?.payment?.status === "FAILED";
  const isTerminal = isCancelled || isPaymentFailed;

  const completedStatuses = {
    "Order Placed": [
      "CONFIRMED",
      "PROCESSING",
      "READY_FOR_PICKUP",
      "AWAITING_CONFIRMATION",
      "DELIVERED",
    ],
    Processing: [
      "PROCESSING",
      "READY_FOR_PICKUP",
      "AWAITING_CONFIRMATION",
      "DELIVERED",
    ],
    "Ready for Pickup": [
      "READY_FOR_PICKUP",
      "AWAITING_CONFIRMATION",
      "DELIVERED",
    ],
  };

  const timelineSteps = [
    {
      label: "Order Created",
      description: "Your order has been created.",
      state: isTerminal ? "neutral" : "completed",
      date: order?.createdAt,
    },
    {
      label: isPaymentFailed ? "Payment Failed" : "Order Placed",
      description: isPaymentFailed
        ? "Your payment could not be completed."
        : "Payment successful and order confirmed.",
      state: isPaymentFailed
        ? "failed"
        : isCancelled
          ? "upcoming"
          : completedStatuses["Order Placed"].includes(order?.status)
            ? "completed"
            : "upcoming",
      date: order?.statusTimestamps?.confirmedAt,
    },
    {
      label: "Processing",
      description: "Seller is preparing your order.",
      state: isTerminal
        ? "upcoming"
        : completedStatuses.Processing.includes(order?.status)
          ? "completed"
          : "upcoming",
      date: order?.statusTimestamps?.processingAt,
    },
    {
      label: "Ready for Pickup",
      description: "Your order is ready for collection.",
      state: isTerminal
        ? "upcoming"
        : completedStatuses["Ready for Pickup"].includes(order?.status)
          ? "completed"
          : "upcoming",
      date: order?.statusTimestamps?.readyForPickupAt,
    },
    {
      label: "Buyer Confirmed Receipt",
      description: "You have confirmed receiving the product.",
      state: isTerminal
        ? "upcoming"
        : order?.meetup?.buyerConfirmedAt
          ? "completed"
          : "upcoming",
      date: order?.meetup?.buyerConfirmedAt,
    },
    {
      label: "Order Delivered",
      description:
        "Seller confirmed the handover or automatic delivery completed.",
      state: isTerminal
        ? "upcoming"
        : order?.status === "DELIVERED"
          ? "completed"
          : "upcoming",
      date: order?.deliveredAt,
    },
    ...(isCancelled
      ? [
          {
            label: "Order Cancelled",
            description: "This order will not proceed to the remaining stages.",
            state: "failed",
            date: null,
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/dashboard/orders"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>

          {loading && (
            <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading order details...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-500" size={30} />
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchOrder}
                className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && order && (
            <div className="space-y-6">
              {/* Order Header */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Order Details</p>
                    <h1 className="mt-1 text-xl font-bold text-slate-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      STATUS_STYLES[order.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>
              </section>

              {/* Products */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-semibold text-slate-900">
                  Items Ordered
                </h2>

                <div className="space-y-5">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${item.product || item.name}-${index}`}
                      className="flex flex-col gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package size={30} className="text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Condition: {formatStatus(item.condition)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-between border-t border-slate-200 pt-4">
                  <span className="font-semibold text-slate-700">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </section>

              {/* Seller and College */}
              <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Store size={19} className="text-slate-600" />
                    <h2 className="font-semibold text-slate-900">
                      Seller Information
                    </h2>
                  </div>

                  <InfoRow label="Seller" value={order.seller?.fullName} />
                  <InfoRow label="Email" value={order.seller?.email} />
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-slate-600" />
                    <h2 className="font-semibold text-slate-900">
                      College Information
                    </h2>
                  </div>

                  <InfoRow label="College" value={order.college?.name} />
                </section>
              </div>

              {/* Payment */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-slate-600" />
                  <h2 className="font-semibold text-slate-900">
                    Payment Information
                  </h2>
                </div>

                <InfoRow
                  label="Payment Status"
                  value={formatStatus(order.payment?.status)}
                />
                <InfoRow
                  label="Payment Provider"
                  value={order.payment?.provider}
                />
                <InfoRow
                  label="Razorpay Order ID"
                  value={order.payment?.razorpayOrderId}
                />
                <InfoRow
                  label="Razorpay Payment ID"
                  value={order.payment?.razorpayPaymentId}
                />
              </section>

              {/* Order Timeline */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Order Timeline
                </h2>

                {isCancelled ? (
                  <div className="mt-6 space-y-6">
                    {/* Order Created */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-50">
                        <Circle className="h-4 w-4 text-slate-400" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-500">
                          Order Created
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          Your order was created.
                        </p>
                        {order?.createdAt && (
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Failed */}
                    {isPaymentFailed && (
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-600">
                            Payment Failed
                          </h3>
                          <p className="mt-1 text-sm text-red-500">
                            Your payment could not be completed.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Cancelled */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-red-600">
                          Order Cancelled
                        </h3>
                        <p className="mt-1 text-sm text-red-500">
                          This order has been cancelled and will not proceed
                          further.
                        </p>
                      </div>
                    </div>

                    {/* Remaining Stages */}
                    {[
                      "Order Placed",
                      "Processing",
                      "Ready for Pickup",
                      "Buyer Confirmed Receipt",
                      "Order Delivered",
                    ].map((stage) => (
                      <div
                        key={stage}
                        className="flex items-start gap-4 opacity-40"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                          <Circle className="h-4 w-4 text-slate-400" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-500">
                            {stage}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            This stage was not reached.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    {timelineSteps.map((step, index) => (
                      <div
                        key={`${step.label}-${index}`}
                        className="flex items-start gap-4"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            step.state === "completed"
                              ? "bg-green-600 text-white"
                              : step.state === "failed"
                                ? "bg-red-100 text-red-600"
                                : "border-2 border-slate-300 bg-white text-slate-400"
                          }`}
                        >
                          {step.state === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : step.state === "failed" ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <h3
                            className={`font-semibold ${
                              step.state === "completed"
                                ? "text-slate-900"
                                : step.state === "failed"
                                  ? "text-red-600"
                                  : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {step.description}
                          </p>

                          {step.date && (
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(step.date).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Buyer Confirmation */}
              {order.status === "READY_FOR_PICKUP" && (
                <section className="rounded-xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
                  <h2 className="font-semibold text-purple-900">
                    Confirm Product Received
                  </h2>

                  <p className="mt-2 text-sm text-purple-800">
                    Confirm only after you have physically received and
                    inspected the product. This confirmation cannot be undone.
                  </p>

                  {actionError && (
                    <p className="mt-3 text-sm text-red-600">{actionError}</p>
                  )}

                  <button
                    onClick={handleConfirmReceived}
                    disabled={confirming || !isPaid}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {confirming && (
                      <RefreshCw size={16} className="animate-spin" />
                    )}
                    {confirming ? "Confirming..." : "Confirm Received"}
                  </button>

                  {!isPaid && (
                    <p className="mt-2 text-xs text-purple-800">
                      Receipt confirmation is available after successful
                      payment.
                    </p>
                  )}
                </section>
              )}

              {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              {order.status === "AWAITING_CONFIRMATION" && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                  <p className="font-semibold text-orange-900">
                    Receipt confirmed
                  </p>
                  <p className="mt-1 text-sm text-orange-800">
                    Your confirmation has been recorded. The order will be
                    marked delivered after the seller confirms handover or the
                    automatic confirmation period expires.
                  </p>
                </div>
              )}

              {order.status === "DELIVERED" && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <p className="font-semibold text-green-800">
                    Order Delivered
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Delivery method: {order.deliveryMethod || "Not available"}
                  </p>
                  {order.deliveredAt && (
                    <p className="mt-1 text-sm text-green-700">
                      Delivered on: {formatDate(order.deliveredAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OrderDetails;
