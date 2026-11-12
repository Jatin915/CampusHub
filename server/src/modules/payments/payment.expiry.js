import Payment from "./payment.model.js";
import razorpay from "../../config/razorpay.js";
import { PAYMENT_STATUS } from "./payment.constants.js";
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

        const providerOrder = await razorpay.orders.fetch(
          payment.razorpayOrderId,
        );

        if (!providerOrder?.status) continue;

        if (providerOrder.status === "paid") continue;
        if (
          providerOrder.status !== "created" &&
          providerOrder.status !== "attempted"
        )
          continue;

        const providerPayments = await razorpay.orders.fetchPayments(
          payment.razorpayOrderId,
        );

        const attempts = providerPayments?.items || [];

        const hasCapturedPayment = attempts.some(
          (attempt) => attempt.status === "captured",
        );

        const hasPendingPayment = attempts.some(
          (attempt) =>
            attempt.status === "authorized" || attempt.status === "created",
        );

        if (hasCapturedPayment || hasPendingPayment) continue;

        await expireCheckout(payment._id);
        
      } catch (error) {
        console.error(`[PaymentExpiry] Failed for ${payment._id}:`, error);
      }
    }
  } catch (error) {
    console.error("[PaymentExpiry] Worker failed:", error);
  } finally {
    running = false;
  }
};
