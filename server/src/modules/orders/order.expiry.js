import Order from "./order.model.js";
import { ORDER_STATUS, PAYMENT_STATUS } from "./order.constants.js";

let running = false;

export const processAutoDelivery = async () => {
  if (running) return;

  running = true;

  try {
    const now = new Date();

    const result = await Order.updateMany(
      {
        status: ORDER_STATUS.AWAITING_CONFIRMATION,
        "payment.status": PAYMENT_STATUS.PAID,
        "meetup.buyerConfirmedAt": { $ne: null },
        "meetup.sellerConfirmedAt": null,
        "meetup.autoDeliveryAt": { $lte: now },
      },

      {
        $set: {
          status: ORDER_STATUS.DELIVERED,
          deliveryMethod: "AUTO",
          deliveredAt: now,
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `Auto-delivery completed for ${result.modifiedCount} order(s).`,
      );
    }
  } catch (error) {
    console.error("Auto-delivery worker failed:", error);
  } finally {
    running = false;
  }
};
