
import mongoose from "mongoose";

import Wishlist from "./wishlist.model.js";
import Product from "../product/product.model.js";

import ApiError from "../../utils/ApiError.js";

export const addToWishlist = async ({ userId, productId, collegeId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }

  const product = await Product.findOne({
    _id: productId,
    college: collegeId,
    isActive: true,
    quantity: { $gt: 0 },
  });

  if (!product) {
    throw new ApiError(404, "Product not found or unavailable.");
  }

  const existingItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  if (existingItem) {
    return existingItem;
  }

  try {
    return await Wishlist.create({
      user: userId,
      product: productId,
    });
  } catch (error) {
    // Handles simultaneous duplicate requests
    if (error.code === 11000) {
      return Wishlist.findOne({
        user: userId,
        product: productId,
      });
    }

    throw error;
  }
};

export const removeFromWishlist = async ({ userId, productId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }

  const deletedItem = await Wishlist.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!deletedItem) {
    throw new ApiError(404, "Product not found in wishlist.");
  }

  return deletedItem;
};

export const getWishlist = async ({ userId, collegeId }) => {
  const wishlist = await Wishlist.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "product",
      match: { college: collegeId },
      populate: [
        {
          path: "category",
          select: "name",
        },
        {
          path: "seller",
          select: "fullName avatar",
        },
      ],
    });

  // Ignore products that no longer belong to this user's college
  return wishlist.filter((item) => item.product !== null);
};

export const getWishlistProductIds = async ({ userId }) => {
  const wishlist = await Wishlist.find({
    user: userId,
  }).select("product");

  return wishlist.map((item) => item.product);
};
