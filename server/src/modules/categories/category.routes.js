import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
  softDeleteCategoryController,
  hardDeleteCategoryController,
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

router.patch(
  "/:id",
  protect,
  authorize(ROLES.OWNER, ROLES.ADMIN),
  updateCategoryController,
);

router.patch(
  "/:id/status",
  protect,
  authorize(ROLES.OWNER, ROLES.ADMIN),
  softDeleteCategoryController,
);

router.delete(
  "/:id",
  protect,
  authorize(ROLES.OWNER, ROLES.ADMIN),
  hardDeleteCategoryController,
);

export default router;
