
import { Router } from "express";

import {
  addToWishlistController,
  removeFromWishlistController,
  getWishlistController,
  getWishlistIdsController,
} from "./wishlist.controller.js";

import { protect } from "../../middlewares/protect.js";
import authorize from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.use(protect, authorize(ROLES.STUDENT));

router.get("/", getWishlistController);
router.get("/ids", getWishlistIdsController);
router.post("/:productId", addToWishlistController);
router.delete("/:productId", removeFromWishlistController);

export default router;
