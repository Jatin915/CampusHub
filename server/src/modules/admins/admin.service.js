import User from "../auth/user.model.js";
import College from "../colleges/college.model.js";

import ApiError from "../../utils/ApiError.js";

import { ROLES } from "../../constants/roles.js";

export const createAdmin = async (owner, adminData) => {
  const { fullName, email, password } = adminData;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists.");
  }

  const college = await College.findById(owner.college);

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  const domain = normalizedEmail.split("@")[1];

  if (!college.domains.includes(domain)) {
    throw new ApiError(
      400,
      "Admin email must belong to the owner's college."
    );
  }

  const admin = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    role: ROLES.ADMIN,
    college: owner.college,
    authProvider: "LOCAL",
    isVerified: true,
  });

  return admin.toSafeObject();
};

export const getAdmins = async (owner) => {
  return await User.find({
    college: owner.college,
    role: ROLES.ADMIN,
  }).select("-password -__v");
};