
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError.js";

export const validateAddToCart = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !mongoose.isValidObjectId(productId)) {
    return next(new ApiError(400, "Valid product ID is required."));
  }

  if (
    quantity !== undefined &&
    (!Number.isInteger(quantity) || quantity < 1)
  ) {
    return next(
      new ApiError(400, "Quantity must be a positive integer.")
    );
  }

  next();
};

export const validateUpdateCartItem = (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return next(new ApiError(400, "Invalid product ID."));
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(
      new ApiError(400, "Quantity must be a positive integer.")
    );
  }

  next();
};

export const validateCartProductId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    return next(new ApiError(400, "Invalid product ID."));
  }

  next();
};