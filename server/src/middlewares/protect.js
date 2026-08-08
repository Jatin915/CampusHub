import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import User from "../modules/auth/user.model.js";
import { verifyToken } from "../modules/auth/utils/jwt.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new ApiError(401, "Authentication required.");
  }


  const decoded = verifyToken(token);

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated.");
  }

  req.user = user.toSafeObject();

  next();
});
