import Razorpay from "razorpay";
import { env } from "./env.js";
// import {
//   claimWebhookEvent,
//   markWebhookEventProcessed,
//   releaseWebhookEventClaim,
// } from "./webhookEvent.service.js";

const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

export default razorpay;