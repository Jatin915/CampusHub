import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import ApiError from "../../utils/ApiError.js";
import { PRODUCT_CONDITION_VALUES } from "./product.constants.js";

export const createProduct = async ({
  name,
  description,
  price,
  categoryId,
  quantity,
  condition,
  sellerId,
  collegeId,
}) => {
  // -----------------------------
  // Basic validation
  // -----------------------------

  if (!name?.trim()) {
    throw new ApiError(400, "Product name is required.");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Product description is required.");
  }

  if (price === undefined || price === null) {
    throw new ApiError(400, "Product price is required.");
  }

  if (price < 0) {
    throw new ApiError(400, "Product price cannot be negative.");
  }

  if (!categoryId) {
    throw new ApiError(400, "Product category is required.");
  }

  // -----------------------------
  // Validate condition
  // -----------------------------

  if (
    condition &&
    !PRODUCT_CONDITION_VALUES.includes(condition)
  ) {
    throw new ApiError(400, "Invalid product condition.");
  }

  // -----------------------------
  // Validate category
  // -----------------------------
  // Category must:
  // 1. Exist
  // 2. Belong to seller's college
  // 3. Be active
  // -----------------------------

  const category = await Category.findOne({
    _id: categoryId,
    college: collegeId,
    isActive: true,
  });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found or inactive.",
    );
  }

  // -----------------------------
  // Create product
  // -----------------------------

  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    price,
    category: category._id,
    college: collegeId,
    seller: sellerId,
    quantity: quantity ?? 1,
    condition: condition ?? "GOOD",
  });

  return product;
};