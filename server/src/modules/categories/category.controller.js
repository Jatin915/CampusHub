import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  softDeleteCategory,
  hardDeleteCategory,
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

export const updateCategoryController = asyncHandler(
  async (req, res) => {
    const category = await updateCategory({
      categoryId: req.params.id,
      collegeId: req.user.college,
      name: req.body.name,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Category updated successfully.",
        category,
      ),
    );
  },
);

export const softDeleteCategoryController = asyncHandler(
  async (req, res) => {
    const category = await softDeleteCategory({
      categoryId: req.params.id,
      isActive: req.body.isActive,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Category deactivated successfully.",
        category,
      ),
    );
  },
);

export const hardDeleteCategoryController = asyncHandler(
  async (req, res) => {
    const category = await hardDeleteCategory({
      categoryId: req.params.id,
      collegeId: req.user.college,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Category permanently deleted successfully.",
        category,
      ),
    );
  },
);