import { Router } from "express";

import {
  createProductController,
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

export default router;