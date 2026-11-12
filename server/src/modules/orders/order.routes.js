
import { Router } from "express";
import {
  createOrder,
  getMyOrdersController,
  getOrderDetailsController,
  confirmOrderReceivedController,
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
  "/:orderId/confirm-received",
  protect,
  confirmOrderReceivedController
);

export default router;
