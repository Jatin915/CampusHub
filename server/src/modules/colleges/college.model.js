import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      unique: true,
      trim: true,
    },

    domains: [
      {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    ],

    logo: {
      publicId: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

collegeSchema.index({
  name: 1,
});

collegeSchema.index({
  domains: 1,
});

const College = mongoose.model("College", collegeSchema);

export default College;
