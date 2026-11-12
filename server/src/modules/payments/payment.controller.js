import crypto from "crypto";
import Payment from "./payment.model.js";
import { env } from "../../config/env.js";
// import razorpay from "../../config/razorpay.js";
import {
  claimWebhookEvent,
  markWebhookEventProcessed,
  releaseWebhookEventClaim,
} from "./webhookEvent.service.js";
import { createCheckoutSession, verifyCheckoutPayment } from "./payment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// CREATE CHECKOUT
export const createCheckout = asyncHandler(async (req, res) => {
  const { productIds, idempotencyKey } = req.body;

  const checkout = await createCheckoutSession(
    req.user._id,
    productIds,
    idempotencyKey,
  );

  return res.status(201).json(checkout);
});


// VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await verifyCheckoutPayment(req.user._id, req.body);

  return res.status(200).json(
    new ApiResponse(200, "Payment verification completed.", result),
  );
});


// RAZORPAY WEBHOOK
export const razorpayWebhook = asyncHandler(async (req, res) => {
  // 1. Get webhook signature from Razorpay
  const signature = req.headers["x-razorpay-signature"];

  // 2. Ensure raw request body is available
  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).json({
      message: "Raw webhook body is required.",
    });
  }

  // 3. Check webhook configuration
  if (!signature || !env.razorpayWebhookSecret) {
    return res.status(400).json({
      message: "Webhook signature configuration missing.",
    });
  }

  // 4. Generate expected webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(req.body)
    .digest("hex");

  // 5. Compare signatures safely
  const received = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (
    received.length !== expected.length ||
    !crypto.timingSafeEqual(received, expected)
  ) {
    return res.status(400).json({
      message: "Invalid webhook signature.",
    });
  }

  // 6. Parse webhook JSON
  let event;

  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).json({
      message: "Invalid webhook JSON.",
    });
  }

  // 7. Validate event ID
  const eventId = req.headers["x-razorpay-event-id"];

  if (typeof eventId !== "string" || !eventId.trim()) {
    return res.status(400).json({
      message: "Webhook event ID is missing.",
    });
  }

  // 8. Process only supported events
  if (!["payment.captured", "order.paid"].includes(event.event)) {
    return res.status(200).json({
      received: true,
      ignored: true,
    });
  }

  // 9. Extract payment details
  const paymentEntity = event.payload?.payment?.entity ?? null;

  const razorpayOrderId =
    paymentEntity?.order_id ??
    event.payload?.order?.entity?.id;

  const razorpayPaymentId = paymentEntity?.id;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return res.status(400).json({
      message: "Payment details missing from webhook payload.",
    });
  }

  // 10. Find CampusHub payment
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    return res.status(200).json({
      received: true,
      ignored: true,
    });
  }

  // 11. Already paid? No need to process again
  if (payment.status === "PAID") {
    return res.status(200).json({
      received: true,
      alreadyProcessed: true,
    });
  }

  // 12. Claim webhook event using unique event ID
  const claim = await claimWebhookEvent(eventId, event.event);

  if (!claim.claimed) {
    if (claim.reason === "PROCESSED") {
      return res.status(200).json({
        received: true,
        alreadyProcessed: true,
      });
    }

    if (claim.reason === "PROCESSING") {
      return res.status(503).json({
        received: false,
        message: "Webhook event is already being processed. Please retry.",
      });
    }
  }

  const { processingToken } = claim;

  try {
    // 13. Generate internal Razorpay payment signature
    // Actual webhook authenticity was verified in Step 5.
    const razorpaySignature = crypto
      .createHmac("sha256", env.razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // 14. Verify and finalize payment
    await verifyCheckoutPayment(payment.buyer, {
      paymentId: payment._id.toString(),
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    });

    // 15. Mark webhook event as processed
    const markedProcessed = await markWebhookEventProcessed(
      eventId,
      processingToken,
    );

    if (!markedProcessed) {
      throw new ApiError(
        409,
        "Webhook processing ownership was lost.",
      );
    }

    // 16. Send success response
    return res.status(200).json({
      received: true,
      processed: true,
    });
  } catch (error) {
    // 17. Release claim so the event can be retried
    try {
      await releaseWebhookEventClaim(eventId, processingToken);
    } catch (cleanupError) {
      console.error(
        "Webhook claim cleanup failed:",
        cleanupError.message,
      );
    }

    throw error;
  }
});