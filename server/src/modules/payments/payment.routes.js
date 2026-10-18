import { Router } from "express";
import { protect } from "../../middlewares/protect.js";
import {
  createCheckout,
  verifyPayment,
  razorpayWebhook,
} from "./payment.controller.js";

const router = Router();

router.post("/checkout", protect, createCheckout);
router.post("/verify", protect, verifyPayment);

// Razorpay server-to-server webhook; no login cookie required.
router.post("/webhook", razorpayWebhook);

export default router;