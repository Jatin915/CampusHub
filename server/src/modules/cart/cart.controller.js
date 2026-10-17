
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeCartItem as removeCartItemService,
  clearCart as clearCartService,
} from "./cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, "Cart fetched successfully.", cart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await addToCartService({
    userId: req.user._id,
    productId: req.body.productId,
    quantity: req.body.quantity ?? 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Product added to cart successfully.", cart));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItemService({
    user: req.user,
    productId: req.params.productId,
    quantity: req.body.quantity,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Cart quantity updated successfully.", cart));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItemService({
    userId: req.user._id,
    productId: req.params.productId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Product removed from cart successfully.", cart));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, "Cart cleared successfully.", cart));
});
