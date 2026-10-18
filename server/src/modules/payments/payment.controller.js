import crypto from "crypto";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { env } from "../../config/env.js";
import Payment from "./payment.model.js";
import {
  createCheckoutSession,
  verifyCheckoutPayment,
} from "./payment.service.js";

export const createCheckout = asyncHandler(async (req, res) => {
  const checkout = await createCheckoutSession(
    req.user._id,
    req.body.productIds,
    req.body.idempotencyKey,
  );

  return res.status(201).json(
    new ApiResponse(201, "Checkout initiated successfully.", checkout),
  );
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await verifyCheckoutPayment(req.user._id, req.body);

  return res.status(200).json(
    new ApiResponse(200, "Payment verification completed.", result),
  );
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).json({ message: "Raw webhook body is required." });
  }

  if (!signature || !env.razorpayWebhookSecret) {
    return res.status(400).json({ message: "Webhook signature configuration missing." });
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(req.body)
    .digest("hex");

  const received = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (
    received.length !== expected.length ||
    !crypto.timingSafeEqual(received, expected)
  ) {
    return res.status(400).json({ message: "Invalid webhook signature." });
  }

  let event;

  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).json({ message: "Invalid webhook JSON." });
  }

  // Only process events that confirm payment success.
  if (!["payment.captured", "order.paid"].includes(event.event)) {
    // A failed payment attempt does not necessarily mean the whole
    // checkout failed; the buyer may retry payment.
    return res.status(200).json({ received: true, ignored: true });
  }

  const paymentEntity =
    event.payload?.payment?.entity ?? null;

  const razorpayOrderId =
    paymentEntity?.order_id ??
    event.payload?.order?.entity?.id;

  const razorpayPaymentId = paymentEntity?.id;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return res.status(400).json({
      message: "Payment details missing from webhook payload.",
    });
  }

  const payment = await Payment.findOne({ razorpayOrderId });

  // Acknowledge unrelated/old events to avoid endless retries.
  if (!payment) {
    return res.status(200).json({ received: true, ignored: true });
  }

  // Webhooks can be delivered more than once.
  if (payment.status === "PAID") {
    return res.status(200).json({ received: true, alreadyProcessed: true });
  }

  // Reuse the existing verification service so it checks the payment
  // with Razorpay and updates orders/cart through the existing flow.
  const razorpaySignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  await verifyCheckoutPayment(payment.buyer, {
    paymentId: payment._id.toString(),
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  });

  return res.status(200).json({ received: true, processed: true });
});