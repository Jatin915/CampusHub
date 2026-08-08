import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";

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
      "Category already exists for this college."
    );
  }

  const category = await Category.create({
    name: normalizedName,
    slug,
    college: collegeId,
  });

  return category;
};