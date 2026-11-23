import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { createProduct, getMarketplaceProducts } from "./product.service.js";

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


export const getMarketplaceProductsController = asyncHandler(
  async (req, res) => {
    const result = await getMarketplaceProducts({
      collegeId: req.user.college,
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Products fetched successfully.",
        result,
      ),
    );
  },
);