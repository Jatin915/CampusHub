import College from "./college.model.js";
import ApiError from "../../utils/ApiError.js";

import mongoose from "mongoose";
import User from "../auth/user.model.js";
import { ROLES } from "../../constants/roles.js";

export const createCollege = async ({ name, domains, shortName }) => {
  const existingCollege = await College.findOne({
    name,
  });

  if (existingCollege) {
    throw new ApiError(409, "College already exists.");
  }

  domains = domains.map((domain) => domain.trim().toLowerCase());

  const college = await College.create({
    name,
    domains,
    shortName,
  });

  return college;
};

export const createOwner = async (ownerData) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { collegeId, fullName, email, password } = ownerData;

    const college = await College.findById(collegeId).session(session);

    if (!college) {
      throw new ApiError(404, "College not found.");
    }

    if (college.ownerId) {
      throw new ApiError(409, "Owner already exists for this college.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const domain = normalizedEmail.split("@")[1];

    if (!college.domains.includes(domain)) {
      throw new ApiError(
        400,
        "Owner email must belong to the selected college.",
      );
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).session(session);

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const owner = new User({
      fullName,
      email: normalizedEmail,
      password,
      role: ROLES.OWNER,
      college: college._id,
      authProvider: "LOCAL",
      isVerified: true,
    });

    await owner.save({ session });

    college.ownerId = owner._id;

    await college.save({ session });

    await session.commitTransaction();

    return owner.toSafeObject();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
