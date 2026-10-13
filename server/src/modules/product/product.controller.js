import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { createProduct } from "./product.service.js";

export const createProductController = asyncHandler(
  async (req, res) => {
    const product = await createProduct({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      categoryId: req.body.categoryId,
      quantity: req.body.quantity,
      condition: req.body.condition,

      // Never trust these from frontend
      sellerId: req.user._id,
      collegeId: req.user.college,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        "Product created successfully.",
        product,
      ),
    );
  },
);