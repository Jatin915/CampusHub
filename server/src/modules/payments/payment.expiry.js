import Payment from "./payment.model.js";
import razorpay from "../../config/razorpay.js";
import {
  PAYMENT_STATUS,
} from "./payment.constants.js";
import { expireCheckout } from "./payment.service.js";

let running = false;

export const processExpiredPayments = async () => {
  if (running) return;

  running = true;

  try {
    const expiredPayments = await Payment.find({
      status: PAYMENT_STATUS.CREATED,
      expiresAt: { $lte: new Date() },
      razorpayOrderId: { $type: "string" },
    }).limit(50);

    for (const payment of expiredPayments) {
      try {
        // Check Razorpay's current order state before releasing stock.
        const providerOrder = await razorpay.orders.fetch(
          payment.razorpayOrderId,
        );

        if (providerOrder.status === "paid") {
          // Do not release stock for a paid Razorpay order.
          // Reconciliation must mark it PAID.
          continue;
        }

        if (providerOrder.status !== "created") {
          // Unknown provider state: leave it for another check.
          continue;
        }

        const providerPayments = await razorpay.orders.fetchPayments(
          payment.razorpayOrderId,
        );

        const attempts = providerPayments.items || [];

        const hasCapturedPayment = attempts.some(
          (attempt) => attempt.status === "captured",
        );

        const hasPendingPayment = attempts.some(
          (attempt) =>
            attempt.status === "authorized" ||
            attempt.status === "created",
        );

        if (hasCapturedPayment || hasPendingPayment) {
          // Never release stock while payment may still complete.
          continue;
        }

        await expireCheckout(payment._id);
      } catch (error) {
        console.error(
          `Could not process expired payment ${payment._id}:`,
          error.message,
        );
      }
    }
  } finally {
    running = false;
  }
};