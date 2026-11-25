
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  getWishlist as getWishlistService,
  getWishlistProductIds,
} from "./wishlist.service.js";

export const addToWishlistController = asyncHandler(async (req, res) => {
  const wishlistItem = await addToWishlistService({
    userId: req.user._id,
    productId: req.params.productId,
    collegeId: req.user.college,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Product added to wishlist successfully.", wishlistItem),
    );
});

export const removeFromWishlistController = asyncHandler(async (req, res) => {
  await removeFromWishlistService({
    userId: req.user._id,
    productId: req.params.productId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Product removed from wishlist successfully.", null));
});

export const getWishlistController = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistService({
    userId: req.user._id,
    collegeId: req.user.college,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Wishlist fetched successfully.", wishlist));
});

export const getWishlistIdsController = asyncHandler(async (req, res) => {
  const productIds = await getWishlistProductIds({
    userId: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Wishlist product IDs fetched successfully.", productIds));
});
