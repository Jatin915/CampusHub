import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
} from "./category.controller.js";

import { protect } from "../../middlewares/protect.js";
import authorize from "../../middlewares/authorize.js";

import { ROLES } from "../../constants/roles.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize(ROLES.OWNER, ROLES.ADMIN),
  createCategoryController
);

router.get(
  "/",
  protect,
  getCategoriesController
);

export default router;