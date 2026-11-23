import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import ApiError from "../../utils/ApiError.js";
import { PRODUCT_CONDITION_VALUES } from "./product.constants.js";
import mongoose from "mongoose";

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


export const getMarketplaceProducts = async ({
  collegeId,
  page = 1,
  limit = 12,
  sort = "newest",
}) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageLimit = Math.min(50, Math.max(1, Number(limit) || 12));

  const sortOptions = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const sortBy = sortOptions[sort] || sortOptions.newest;

  const filter = {
    college: collegeId,
    isActive: true,
    quantity: { $gt: 0 },
  };

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .populate("seller", "fullName avatar")
      .sort(sortBy)
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage,
      totalPages: Math.ceil(totalProducts / pageLimit),
      totalProducts,
      limit: pageLimit,
    },
  };
};

export const getProductDetails = async ({
  productId,
  collegeId,
}) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }

  const product = await Product.findOne({
    _id: productId,
    college: collegeId,
    isActive: true,
    quantity: { $gt: 0 },
  })
    .populate("category", "name")
    .populate("seller", "fullName avatar");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product;
};