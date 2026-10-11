import { Router } from "express";

import {
  createProductController,
} from "./product.controller.js";

import { protect } from "../../middlewares/protect.js";

const router = Router();

router.post(
  "/",
  protect,
  createProductController,
);

export default router;