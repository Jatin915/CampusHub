import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Product description is required."],
      trim: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Price cannot be negative."],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required."],
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "Product college is required."],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product seller is required."],
    },

    images: [
      {
        publicId: {
          type: String,
          default: "",
        },

        url: {
          type: String,
          default: "",
        },
      },
    ],

    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1."],
    },

    condition: {
      type: String,
      enum: ["NEW", "LIKE_NEW", "GOOD", "FAIR"],
      default: "GOOD",
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
 * Useful indexes
 */

// Products belonging to a college
productSchema.index({
  college: 1,
});

// Products belonging to a category
productSchema.index({
  category: 1,
});

// Common marketplace query:
// active products of a particular college/category
productSchema.index({
  college: 1,
  category: 1,
  isActive: 1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;