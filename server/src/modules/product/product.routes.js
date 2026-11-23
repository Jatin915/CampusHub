import { Router } from "express";

import {
  createProductController,
  getMarketplaceProductsController,
  getProductDetailsController
} from "./product.controller.js";

import { protect } from "../../middlewares/protect.js";
import authorize from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.OWNER),
  createProductController,
);

router.get(
  "/",
  protect,
  authorize(ROLES.STUDENT, ROLES.ADMIN, ROLES.OWNER),
  getMarketplaceProductsController,
);

router.get(
  "/:productId",
  protect,
  authorize(ROLES.STUDENT, ROLES.ADMIN, ROLES.OWNER),
  getProductDetailsController,
);

export default router;