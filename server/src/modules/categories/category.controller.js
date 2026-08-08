import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createCategory,
//   getCategories,
} from "./category.service.js";

export const createCategoryController = asyncHandler(
  async (req, res) => {
    const category = await createCategory({
      name: req.body.name,
      collegeId: req.user.college,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        "Category created successfully.",
        category
      )
    );
  }
);

export const getCategoriesController = asyncHandler(
  async (req, res) => {
    const categories = await getCategories(
      req.user.college
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Categories fetched successfully.",
        categories
      )
    );
  }
);