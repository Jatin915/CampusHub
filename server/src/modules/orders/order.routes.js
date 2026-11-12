
import { Router } from "express";
import {
  createOrder,
  getMyOrdersController,
  getOrderDetailsController,
  markOrderProcessingController,
  markOrderReadyForPickupController,
  confirmOrderReceivedController,
  confirmOrderHandoverController
} from "./order.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = Router();

router.post(
    "/",
    protect, 
    createOrder
);

router.get(
    "/my-orders", 
    protect, 
    getMyOrdersController
);

router.get(
    "/:orderId", 
    protect, 
    getOrderDetailsController
);

router.patch(
  "/:orderId/processing",
  protect,
  markOrderProcessingController,
);

router.patch(
  "/:orderId/ready-for-pickup",
  protect,
  markOrderReadyForPickupController,
);

router.patch(
  "/:orderId/confirm-received",
  protect,
  confirmOrderReceivedController
);

router.patch(
  "/:orderId/confirm-handover",
  protect,
  confirmOrderHandoverController,
);

export default router;
