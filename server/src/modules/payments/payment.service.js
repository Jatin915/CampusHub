import mongoose from "mongoose";
import crypto from "node:crypto";

import razorpay from "../../config/razorpay.js";
import { env } from "../../config/env.js";

import Payment from "./payment.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import User from "../auth/user.model.js";
import Order from "../orders/order.model.js";

import { ORDER_STATUS, PAYMENT_STATUS } from "../orders/order.constants.js";

import {
  PAYMENT_STATUS as CHECKOUT_PAYMENT_STATUS,
  PAYMENT_EXPIRY_MINUTES,
} from "./payment.constants.js";

import ApiError from "../../utils/ApiError.js";

const validateSelectedIds = (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new ApiError(400, "Please select at least one product.");
  }

  if (productIds.some((id) => !mongoose.isValidObjectId(id))) {
    throw new ApiError(400, "One or more product IDs are invalid.");
  }

  const ids = productIds.map(String);

  if (new Set(ids).size !== ids.length) {
    throw new ApiError(400, "Duplicate product IDs are not allowed.");
  }

  return new Set(ids);
};

const validateIdempotencyKey = (key) => {
  if (typeof key !== "string" || key.length < 8 || key.length > 128) {
    throw new ApiError(400, "A valid idempotency key is required.");
  }
};

const buildCheckoutResponse = (payment) => ({
  paymentId: payment._id,
  razorpayOrderId: payment.razorpayOrderId,
  amount: payment.amount,
  currency: payment.currency,
  keyId: env.razorpayKeyId,
});


const releaseReservedStock = async (
  paymentId,
  terminalStatus = CHECKOUT_PAYMENT_STATUS.FAILED,
) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Claim this release exactly once.
      const payment = await Payment.findOneAndUpdate(
        {
          _id: paymentId,
          status: CHECKOUT_PAYMENT_STATUS.CREATED,
        },
        {
          $set: { status: terminalStatus },
        },
        {
          returnDocument: "after",
          session,
        },
      );

      // Already paid, expired, failed, or processed elsewhere.
      if (!payment) return;

      const orders = await Order.find({
        _id: { $in: payment.orders },
        status: ORDER_STATUS.PENDING_PAYMENT,
      }).session(session);

      // Restore reserved stock and return products to the buyer's cart.
      let cart = await Cart.findOne({
        user: payment.buyer,
      }).session(session);

      if (!cart) {
        cart = new Cart({
          user: payment.buyer,
          items: [],
        });
      }

      for (const order of orders) {
        for (const item of order.items) {
          // Restore inventory.
          await Product.updateOne(
            { _id: item.product },
            { $inc: { quantity: item.quantity } },
            { session },
          );

          // Restore the cart quantity without creating duplicate entries.
          const existingItem = cart.items.find(
            (cartItem) =>
              cartItem.product.toString() === item.product.toString(),
          );

          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            cart.items.push({
              product: item.product,
              quantity: item.quantity,
            });
          }
        }
      }

      await cart.save({ session });

      await Order.updateMany(
        {
          _id: { $in: payment.orders },
          status: ORDER_STATUS.PENDING_PAYMENT,
        },
        {
          $set: {
            status: ORDER_STATUS.CANCELLED,
            "payment.status": PAYMENT_STATUS.FAILED,
          },
        },
        { session },
      );
    });
  } finally {
    await session.endSession();
  }
};

export const createCheckoutSession = async (
  userId,
  productIds,
  idempotencyKey,
) => {
  const selectedSet = validateSelectedIds(productIds);
  validateIdempotencyKey(idempotencyKey);

  // A retry with the same key must not reserve stock again.
  const existingPayment = await Payment.findOne({
    buyer: userId,
    idempotencyKey,
  });

  if (existingPayment) {
    if (
      existingPayment.status === "CREATED" &&
      existingPayment.razorpayOrderId
    ) {
      return buildCheckoutResponse(existingPayment);
    }

    if (existingPayment.status === "PAID") {
      throw new ApiError(409, "This checkout has already been paid.");
    }

    throw new ApiError(
      409,
      "This checkout request already exists. Please start a new checkout if it failed or expired.",
    );
  }

  const session = await mongoose.startSession();

  let payment;
  let createdOrders = [];
  let totalAmount = 0;

  try {
    await session.withTransaction(async () => {
      const buyer = await User.findById(userId).session(session);

      if (!buyer) throw new ApiError(404, "User not found.");

      if (!buyer.college) {
        throw new ApiError(400, "Your college is not configured.");
      }

      const cart = await Cart.findOne({ user: buyer._id }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty.");
      }

      const selectedItems = cart.items.filter((item) =>
        selectedSet.has(item.product.toString()),
      );

      if (selectedItems.length !== selectedSet.size) {
        throw new ApiError(
          400,
          "One or more selected products are not in your cart.",
        );
      }

      const sellerGroups = new Map();

      for (const cartItem of selectedItems) {
        if (!Number.isInteger(cartItem.quantity) || cartItem.quantity < 1) {
          throw new ApiError(400, "Invalid cart item quantity.");
        }

        const product = await Product.findOneAndUpdate(
          {
            _id: cartItem.product,
            isActive: true,
            quantity: { $gte: cartItem.quantity },
          },
          { $inc: { quantity: -cartItem.quantity } },
          { returnDocument: "after", session },
        );

        if (!product) {
          throw new ApiError(
            400,
            "A selected product is unavailable or has insufficient stock.",
          );
        }

        if (product.college.toString() !== buyer.college.toString()) {
          throw new ApiError(
            403,
            "You can only order products from your own college.",
          );
        }

        if (product.seller.toString() === buyer._id.toString()) {
          throw new ApiError(400, "You cannot purchase your own product.");
        }

        const sellerId = product.seller.toString();

        if (!sellerGroups.has(sellerId)) {
          sellerGroups.set(sellerId, {
            seller: product.seller,
            items: [],
            totalAmount: 0,
          });
        }

        const group = sellerGroups.get(sellerId);

        group.items.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          condition: product.condition,
          image: product.images?.[0]?.url || "",
        });

        group.totalAmount += product.price * cartItem.quantity;
      }

      totalAmount = [...sellerGroups.values()].reduce(
        (sum, group) => sum + group.totalAmount,
        0,
      );

      if (
        !Number.isSafeInteger(totalAmount) ||
        totalAmount <= 0 ||
        !Number.isSafeInteger(totalAmount * 100)
      ) {
        throw new ApiError(400, "Invalid checkout amount.");
      }

      // Store the payment amount in paise, as expected by Razorpay.
      [payment] = await Payment.create(
        [
          {
            buyer: buyer._id,
            orders: [],
            amount: totalAmount * 100,
            currency: "INR",
            status: "CREATED",
            expiresAt: new Date(
              Date.now() + PAYMENT_EXPIRY_MINUTES * 60 * 1000,
            ),
            idempotencyKey,
          },
        ],
        { session },
      );

      console.log("[CHECKOUT CREATED]", {
        paymentId: payment._id.toString(),
        expiresAt: payment.expiresAt,
        currentTime: new Date(),
        expiryMinutes: PAYMENT_EXPIRY_MINUTES,
      });

      const orderDocuments = [...sellerGroups.values()].map((group) => ({
        buyer: buyer._id,
        seller: group.seller,
        college: buyer.college,
        items: group.items,
        totalAmount: group.totalAmount,
        status: ORDER_STATUS.PENDING_PAYMENT,
        payment: {
          status: PAYMENT_STATUS.PENDING,
          provider: "RAZORPAY",
        },
      }));

      createdOrders = await Order.create(orderDocuments, {
        session,
        ordered: true,
      });

      payment.orders = createdOrders.map((order) => order._id);
      await payment.save({ session });
      // Remove reserved products from the active cart.
      // The order now owns these reserved quantities.
      cart.items = cart.items.filter(
        (item) => !selectedSet.has(item.product.toString()),
      );

      await cart.save({ session });
    });
  } finally {
    await session.endSession();
  }

  let razorpayOrder;

  try {
    razorpayOrder = await razorpay.orders.create({
      amount: payment.amount,
      currency: payment.currency,
      receipt: payment._id.toString(),
      notes: {
        paymentId: payment._id.toString(),
        buyerId: userId.toString(),
      },
    });
  } catch (error) {
    await releaseReservedStock(payment._id);
    throw new ApiError(502, "Unable to initiate payment. Please try again.");
  }

  payment.razorpayOrderId = razorpayOrder.id;
  await payment.save();

  return buildCheckoutResponse(payment);
};

const verifyRazorpayOrderForResume = async (payment) => {
  let razorpayOrder;
  let paymentAttempts;

  try {
    razorpayOrder = await razorpay.orders.fetch(payment.razorpayOrderId);

    paymentAttempts = await razorpay.orders.fetchPayments(
      payment.razorpayOrderId,
    );
  } catch (error) {
    console.error("Razorpay state verification failed:", error);

    throw new ApiError(
      502,
      "Unable to verify payment status. Please try again later.",
    );
  }

  // Verify the fetched order belongs to this checkout.
  if (
    razorpayOrder.id !== payment.razorpayOrderId ||
    razorpayOrder.amount !== payment.amount ||
    razorpayOrder.currency !== payment.currency
  ) {
    throw new ApiError(
      409,
      "Razorpay order details do not match this checkout.",
    );
  }

  // A paid order must never be resumed.
  if (razorpayOrder.status === "paid") {
    throw new ApiError(
      409,
      "Payment has already been completed. Please check your orders.",
    );
  }

  // Only created or attempted orders can potentially be resumed.
  if (!["created", "attempted"].includes(razorpayOrder.status)) {
    throw new ApiError(409, "This Razorpay order cannot be resumed.");
  }

  const attempts = paymentAttempts.items || [];

  for (const attempt of attempts) {
    // Every payment attempt must belong to this order and match its amount.
    if (
      attempt.order_id !== payment.razorpayOrderId ||
      attempt.amount !== payment.amount ||
      attempt.currency !== payment.currency
    ) {
      throw new ApiError(409, "Payment attempt details could not be verified.");
    }

    if (["captured", "refunded"].includes(attempt.status)) {
      throw new ApiError(
        409,
        "A successful payment already exists. Please check your orders.",
      );
    }

    if (attempt.status === "authorized") {
      throw new ApiError(
        409,
        "Payment is authorized and requires verification. Please do not retry.",
      );
    }

    // Fail closed for any unexpected provider status.
    if (!["created", "failed"].includes(attempt.status)) {
      throw new ApiError(
        409,
        "Payment status is not eligible for checkout retry.",
      );
    }
  }

  return true;
};

// RESUME CHECKOUT SESSION
export const resumeCheckoutSession = async (userId, orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid order ID.");
  }

  // 1. Find the order belonging to the logged-in buyer.
  const order = await Order.findOne({
    _id: orderId,
    buyer: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // 2. Only pending-payment orders can resume checkout.
  if (order.status !== ORDER_STATUS.PENDING_PAYMENT) {
    throw new ApiError(409, "This order cannot resume checkout.");
  }

  // 3. Find the checkout payment linked to this order.
  const payment = await Payment.findOne({
    buyer: userId,
    orders: order._id,
  });

  if (!payment) {
    throw new ApiError(404, "Checkout session not found.");
  }

  // 4. Check local payment status.
  if (payment.status === "PAID") {
    throw new ApiError(409, "This checkout has already been paid.");
  }

  if (payment.status !== "CREATED") {
    throw new ApiError(409, "This checkout is no longer payable.");
  }

  // 5. Check local expiry.
  if (payment.expiresAt <= new Date()) {
    throw new ApiError(
      409,
      "Checkout session expired. Please create a new order.",
    );
  }

  // 6. Ensure Razorpay order exists.
  if (!payment.razorpayOrderId) {
    throw new ApiError(409, "Razorpay checkout is unavailable.");
  }

  // 7. Verify actual Razorpay order and payment-attempt states.
  await verifyRazorpayOrderForResume(payment);

  // 8. Ensure every seller-wise order is still pending payment.
  const pendingOrders = await Order.countDocuments({
    _id: { $in: payment.orders },
    buyer: userId,
    status: ORDER_STATUS.PENDING_PAYMENT,
  });

  if (pendingOrders !== payment.orders.length) {
    throw new ApiError(
      409,
      "One or more orders are no longer eligible for payment.",
    );
  }

  // 9. Return existing checkout details.
  return buildCheckoutResponse(payment);
};

export const verifyCheckoutPayment = async (userId, payload) => {
  const {
    paymentId,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = payload;

  if (
    !mongoose.isValidObjectId(paymentId) ||
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    throw new ApiError(400, "Payment verification details are incomplete.");
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    buyer: userId,
  });

  if (!payment) throw new ApiError(404, "Checkout payment not found.");

  if (payment.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, "Razorpay order does not match this checkout.");
  }

  if (payment.status === "PAID") {
    return { paymentId: payment._id, status: "PAID" };
  }

  if (payment.status !== "CREATED") {
    throw new ApiError(409, "This checkout is no longer payable.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const received = Buffer.from(razorpaySignature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (
    received.length !== expected.length ||
    !crypto.timingSafeEqual(received, expected)
  ) {
    throw new ApiError(400, "Invalid payment signature.");
  }

  // Signature verification alone is not enough: confirm payment status
  // with Razorpay before marking the order paid.
  const providerPayment = await razorpay.payments.fetch(razorpayPaymentId);

  if (
    providerPayment.order_id !== razorpayOrderId ||
    providerPayment.status !== "captured" ||
    providerPayment.amount !== payment.amount ||
    providerPayment.currency !== payment.currency
  ) {
    throw new ApiError(409, "Payment has not been captured successfully yet.");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const currentPayment = await Payment.findOne({
        _id: payment._id,
        buyer: userId,
      }).session(session);

      if (!currentPayment) {
        throw new ApiError(404, "Checkout payment not found.");
      }

      // Handle concurrent or repeated verification requests.
      if (currentPayment.status === "PAID") return;

      if (currentPayment.status !== "CREATED") {
        throw new ApiError(409, "This checkout is no longer payable.");
      }

      const orders = await Order.find({
        _id: { $in: currentPayment.orders },
        buyer: userId,
      }).session(session);

      if (orders.length !== currentPayment.orders.length) {
        throw new ApiError(500, "Checkout orders could not be verified.");
      }

      currentPayment.status = "PAID";
      currentPayment.razorpayPaymentId = razorpayPaymentId;
      currentPayment.paidAt = new Date();
      await currentPayment.save({ session });

      await Order.updateMany(
        { _id: { $in: currentPayment.orders }, buyer: userId },
        {
          $set: {
            status: ORDER_STATUS.CONFIRMED,
            "payment.status": PAYMENT_STATUS.PAID,
            "payment.razorpayOrderId": razorpayOrderId,
            "payment.razorpayPaymentId": razorpayPaymentId,
          },
        },
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  return { paymentId: payment._id, status: "PAID" };
};

export const expireCheckout = async (paymentId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment || payment.status !== CHECKOUT_PAYMENT_STATUS.CREATED) {
    return;
  }

  if (payment.expiresAt > new Date()) {
    return;
  }

  await releaseReservedStock(payment._id, CHECKOUT_PAYMENT_STATUS.EXPIRED);
};

export const cancelCheckoutSession = async (userId, paymentId) => {
  // 1. Validate payment ID
  if (!mongoose.isValidObjectId(paymentId)) {
    throw new ApiError(400, "Invalid payment ID.");
  }

  // 2. Find checkout belonging to the logged-in buyer
  const payment = await Payment.findOne({
    _id: paymentId,
    buyer: userId,
  });

  if (!payment) {
    throw new ApiError(404, "Checkout payment not found.");
  }

  // 3. Handle already processed payments
  if (payment.status === CHECKOUT_PAYMENT_STATUS.PAID) {
    return {
      paymentId: payment._id,
      status: CHECKOUT_PAYMENT_STATUS.PAID,
      message: "Payment is already completed.",
    };
  }

  if (payment.status !== CHECKOUT_PAYMENT_STATUS.CREATED) {
    return {
      paymentId: payment._id,
      status: payment.status,
      message: "This checkout is already closed.",
    };
  }

  // 4. If Razorpay order was never created, release reservation
  if (!payment.razorpayOrderId) {
    await releaseReservedStock(payment._id, CHECKOUT_PAYMENT_STATUS.FAILED);

    const updatedPayment = await Payment.findById(payment._id);

    return {
      paymentId: payment._id,
      status: updatedPayment?.status,
      message: "Checkout cancellation processed.",
    };
  }

  let razorpayOrder;
  let providerPayments;

  // 5. Fetch latest payment status from Razorpay
  try {
    razorpayOrder = await razorpay.orders.fetch(payment.razorpayOrderId);

    providerPayments = await razorpay.orders.fetchPayments(
      payment.razorpayOrderId,
    );
  } catch (error) {
    console.error("Razorpay cancellation verification failed:", error);

    throw new ApiError(
      502,
      "Unable to verify payment status. Stock reservation has been retained.",
    );
  }

  // 6. Verify Razorpay order details
  if (
    razorpayOrder.id !== payment.razorpayOrderId ||
    razorpayOrder.amount !== payment.amount ||
    razorpayOrder.currency !== payment.currency
  ) {
    throw new ApiError(
      409,
      "Razorpay order details do not match this checkout.",
    );
  }

  const attempts = providerPayments?.items || [];

  console.log("CANCELLATION DEBUG:", {
    localPaymentStatus: payment.status,
    razorpayOrderStatus: razorpayOrder.status,
    attempts: attempts.map((attempt) => ({
      id: attempt.id,
      status: attempt.status,
      amount: attempt.amount,
      currency: attempt.currency,
    })),
  });

  // 7. Captured payment must be verified, never cancelled
  const capturedAttempt = attempts.find(
    (attempt) => attempt.status === "captured",
  );

  if (capturedAttempt) {
    const signature = crypto
      .createHmac("sha256", env.razorpayKeySecret)
      .update(`${payment.razorpayOrderId}|${capturedAttempt.id}`)
      .digest("hex");

    const result = await verifyCheckoutPayment(userId, {
      paymentId: payment._id.toString(),
      razorpay_order_id: payment.razorpayOrderId,
      razorpay_payment_id: capturedAttempt.id,
      razorpay_signature: signature,
    });

    return {
      ...result,
      message: "Payment was captured and verified successfully.",
    };
  }

  // Razorpay says paid but captured details are unavailable.
  // Retain stock until payment can be verified.
  if (razorpayOrder.status === "paid") {
    throw new ApiError(
      409,
      "Razorpay reports a paid order, but captured payment details are unavailable. Reservation retained.",
    );
  }

  // 8. Only created/attempted orders can be considered for cancellation
  if (!["created", "attempted"].includes(razorpayOrder.status)) {
    throw new ApiError(
      409,
      "Razorpay order is not in a cancellable state. Reservation retained.",
    );
  }

  // 9. Do not release stock for pending or authorized attempts
  const hasPendingAttempt = attempts.some((attempt) =>
    ["created", "authorized"].includes(attempt.status),
  );

  if (hasPendingAttempt) {
    return {
      paymentId: payment._id,
      status: CHECKOUT_PAYMENT_STATUS.CREATED,
      message:
        "Payment is still processing. Stock reservation has been retained.",
    };
  }

  // 10. Decide whether the reservation can safely be released
  const noAttemptsAndOrderCreated =
    attempts.length === 0 && razorpayOrder.status === "created";

  const allAttemptsFailed =
    attempts.length > 0 &&
    attempts.every((attempt) => attempt.status === "failed");

  if (!noAttemptsAndOrderCreated && !allAttemptsFailed) {
    throw new ApiError(
      409,
      "Payment status is uncertain. Reservation retained.",
    );
  }

  // 11. Atomically mark payment FAILED and restore stock.
  // releaseReservedStock only processes payments still in CREATED state.
  await releaseReservedStock(payment._id, CHECKOUT_PAYMENT_STATUS.FAILED);

  // 12. Fetch final state
  const updatedPayment = await Payment.findById(payment._id);

  if (updatedPayment?.status === CHECKOUT_PAYMENT_STATUS.PAID) {
    return {
      paymentId: payment._id,
      status: CHECKOUT_PAYMENT_STATUS.PAID,
      message: "Payment was completed before cancellation.",
    };
  }

  return {
    paymentId: payment._id,
    status: updatedPayment?.status,
    message:
      updatedPayment?.status === CHECKOUT_PAYMENT_STATUS.FAILED
        ? "Checkout cancelled and stock released successfully."
        : "Checkout cancellation is already being processed.",
  };
};
