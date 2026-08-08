import { Router } from "express";
import { createCollegeController } from "./college.controller.js";
import { protect } from "../../middlewares/protect.js";
import authorize from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";
import { createOwnerController } from "./college.controller.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize(ROLES.SUPER_ADMIN),
  createCollegeController
);

router.post(
  "/owner",
  protect,
  authorize(ROLES.SUPER_ADMIN),
  createOwnerController
);

export default router;