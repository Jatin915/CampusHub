import { Router } from "express";
import { protect } from "../../middlewares/protect.js";
import {
  createCheckout,
  resumeCheckout,
  verifyPayment,
  razorpayWebhook,
  cancelCheckout
} from "./payment.controller.js";

const router = Router();

router.post("/checkout", protect, createCheckout);
router.post("/resume-checkout/:orderId", protect, resumeCheckout);
router.post("/verify", protect, verifyPayment);
router.post("/cancel/:paymentId", protect, cancelCheckout);

// Razorpay server-to-server webhook; no login cookie required.
router.post("/webhook", razorpayWebhook);

export default router;