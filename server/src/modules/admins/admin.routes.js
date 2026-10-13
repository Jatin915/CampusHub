import { Router } from "express";

import {
  createAdminController,
  getAdminsController,
} from "./admin.controller.js";

import { protect } from "../../middlewares/protect.js";
import authorize from "../../middlewares/authorize.js";

import { ROLES } from "../../constants/roles.js";

const router = Router();

router.use(
  protect,
  authorize(ROLES.OWNER)
);

router
  .route("/")
  .post(createAdminController)
  .get(getAdminsController);

export default router;