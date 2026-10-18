import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { processExpiredPayments } from "./modules/payments/payment.expiry.js";

const app = express();

const paymentExpiryTimer = setInterval(() => {
  processExpiredPayments().catch((error) => {
    console.error("Payment expiry worker failed:", error.message);
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