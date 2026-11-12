import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { processExpiredPayments } from "./modules/payments/payment.expiry.js";
import { processAutoDelivery } from "./modules/orders/order.expiry.js";

const app = express();

// Run auto-delivery worker immediately on server start.
processAutoDelivery();

// Run once immediately when server starts.
processExpiredPayments().catch((error) => {
  console.error("Payment expiry worker failed:", error);
});

// Run every 60 seconds.
const autoDeliveryTimer = setInterval(() => {
  processAutoDelivery();
}, 60_000);
autoDeliveryTimer.unref();

// Then run every 60 seconds.
const paymentExpiryTimer = setInterval(() => {
  processExpiredPayments().catch((error) => {
    console.error("Payment expiry worker failed:", error);
  });
}, 60_000);
paymentExpiryTimer.unref();

app.use(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;