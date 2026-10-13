import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      unique: true,
      trim: true,
    },

    shortName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
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

    ownerId: {
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
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      versionKey: false,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

collegeSchema.index({
  domains: 1,
});

const College = mongoose.model("College", collegeSchema);

export default College;
