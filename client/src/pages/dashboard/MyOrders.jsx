import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../../components/home/DashboardLayout";
import { getMyOrders } from "../../services/orderServices";
import { resumeCheckout } from "../../services/paymentServices";
import { openRazorpayCheckout } from "../../utils/openRazorpayCheckout";

const ORDER_STATUSES = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Ready for Pickup", value: "READY_FOR_PICKUP" },
  { label: "Awaiting Confirmation", value: "AWAITING_CONFIRMATION" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const STATUS_STYLES = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  READY_FOR_PICKUP: "bg-purple-50 text-purple-700",
  AWAITING_CONFIRMATION: "bg-orange-50 text-orange-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const formatStatus = (status) => {
  return status
    ?.split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resumingOrderId, setResumingOrderId] = useState(null);

  const handleResumeCheckout = async (orderId) => {
    if (resumingOrderId) return;

    if (!window.Razorpay) {
      setError("Payment gateway failed to load. Please refresh the page.");
      return;
    }

    try {
      setResumingOrderId(orderId);
      setError("");

      const response = await resumeCheckout(orderId);
      const checkout = response.data;

      openRazorpayCheckout({
        checkout,

        onSuccess: async (verificationResponse) => {
          const status =
            verificationResponse?.data?.status ?? verificationResponse?.status;

          if (status !== "PAID") {
            setError(
              "Payment verification is pending. Please check your orders.",
            );
            setResumingOrderId(null);
            return;
          }

          // Refresh the existing orders list here.
          await fetchOrders();

          setResumingOrderId(null);
        },

        onError: (message) => {
          setError(message);
          setResumingOrderId(null);
        },

        onClose: () => {
          setResumingOrderId(null);
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to resume checkout. Please try again.",
      );

      setResumingOrderId(null);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
        ...(statusFilter !== "ALL" && { status: statusFilter }),
      };

      const response = await getMyOrders(params);

      setOrders(response?.data?.orders || []);
      setPagination(
        response?.data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
              <p className="mt-1 text-sm text-slate-500">
                Track and manage your purchases.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
              <ShoppingBag size={18} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {pagination.totalOrders || 0} Orders
              </span>
            </div>
          </div>

          {/* Status Filters */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleFilterChange(status.value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    statusFilter === status.value
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-slate-500">
                <RefreshCw size={20} className="animate-spin" />
                <span className="text-sm">Loading your orders...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
              <p className="mb-4 text-sm text-red-600">{error}</p>
              <button
                onClick={fetchOrders}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Package size={30} className="text-slate-400" />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {statusFilter === "ALL"
                  ? "You haven't placed any orders yet."
                  : "You don't have any orders with this status."}
              </p>

              <Link
                to="/dashboard/home"
                className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Explore Products
              </Link>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const firstItem = order.items?.[0];
                const remainingItems = (order.items?.length || 0) - 1;

                return (
                  <div
                    key={order._id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs text-slate-400">Order ID</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">Order Date</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {firstItem?.image ? (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package size={26} className="text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-800">
                            {firstItem?.name || "Product"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Qty: {firstItem?.quantity || 0}
                            {remainingItems > 0 &&
                              ` · +${remainingItems} more item(s)`}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Seller: {order.seller?.fullName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs text-slate-400">Total Amount</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Payment: {formatStatus(order.payment?.status)}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          STATUS_STYLES[order.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {formatStatus(order.status)}
                      </span>

                      <Link
                        to={`/dashboard/orders/${order._id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                      {order.status === "PENDING_PAYMENT" &&
                      order.payment?.status === "PENDING" && (
                        <button
                          type="button"
                          disabled={resumingOrderId !== null}
                          onClick={() => handleResumeCheckout(order._id)}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          {resumingOrderId === order._id
                            ? "Opening Payment..."
                            : "Resume Payment"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && orders.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Page {pagination.currentPage || page} of{" "}
                {pagination.totalPages || 1}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyOrders;
