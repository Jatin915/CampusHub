import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";
import Product from "../product/product.model.js";
export const createCategory = async ({ name, collegeId }) => {
  const normalizedName = name.trim();

  const slug = normalizedName
    .toLowerCase()
    .replace(/\s+/g, "-");

  const existingCategory = await Category.findOne({
    college: collegeId,
    slug,
  });

  if (existingCategory) {
    throw new ApiError(
      409,
      "Category already exists for this college.",
    );
  }

  const category = await Category.create({
    name: normalizedName,
    slug,
    college: collegeId,
  });

  return category;
};

export const getCategories = async (collegeId) => {
  return Category.find({
    college: collegeId,
    isActive: true,
  }).sort({ name: 1 });
};

export const updateCategory = async ({
  categoryId,
  collegeId,
  name,
}) => {
  const normalizedName = name.trim();

  const slug = normalizedName
    .toLowerCase()
    .replace(/\s+/g, "-");

  const category = await Category.findOne({
    _id: categoryId,
    college: collegeId,
  });

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  const existingCategory = await Category.findOne({
    college: collegeId,
    slug,
    _id: { $ne: categoryId },
  });

  if (existingCategory) {
    throw new ApiError(
      409,
      "Another category with this name already exists.",
    );
  }

  category.name = normalizedName;
  category.slug = slug;

  await category.save();

  return category;
};

export const softDeleteCategory = async ({
  categoryId, isActive
}) => {
  const category = await Category.findOne({
    _id: categoryId,
  });

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  // if (!category.isActive) {
  //   throw new ApiError(
  //     400,
  //     "Category is already inactive.",
  //   );
  // }

  // return (isActive === category.isActive) ?  : {
  //   (isActive === false) ? category.isActive = false : category.isActive = true
  //   await category.save();
  // }

  if(isActive === category.isActive) {
    return category;
  } else {
    category.isActive = isActive;
    await category.save();
    return category;
  }

  // category.isActive = false;
};

export const hardDeleteCategory = async ({
  categoryId,
  collegeId,
}) => {
  // 1. Validate category ID
  if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
    throw new ApiError(400, "Invalid category ID.");
  }

  // 2. Find category belonging to this college
  const category = await Category.findOne({
    _id: categoryId,
    college: collegeId,
  });

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  // 3. Check references from ALL products,
  // including inactive products
  const productExists = await Product.exists({
    category: category._id,
  });

  if (productExists) {
    throw new ApiError(
      409,
      "Category cannot be deleted because products reference it.",
    );
  }

  // 4. Permanently delete the category
  await Category.deleteOne({
    _id: category._id,
    college: collegeId,
  });

  return category;
};