
import { Router } from "express";
import { protect } from "../../middlewares/protect.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.controller.js";
import {
  validateAddToCart,
  validateUpdateCartItem,
  validateCartProductId,
} from "./cart.validation.js";

const router = Router();

router.use(protect);

router.get("/", getCart);

router.post("/items", validateAddToCart, addToCart);

router.patch(
  "/items/:productId",
  validateUpdateCartItem,
  updateCartItem
);

router.delete(
  "/items/:productId",
  validateCartProductId,
  removeCartItem
);

router.delete("/items", clearCart);

export default router;
