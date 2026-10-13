import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: 50,
    },

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      trim: true,
      lowercase: true,
      maxlength: 50,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College is required"],
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * A college cannot have duplicate category slugs.
 *
 * GLAU + electronics  → allowed
 * GLAU + electronics  → rejected
 * IIITD + electronics → allowed
 */
categorySchema.index(
  { college: 1, slug: 1 },
  { unique: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;