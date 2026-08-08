import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createAdmin,
  getAdmins,
} from "./admin.service.js";

export const createAdminController = asyncHandler(async (req, res) => {
  const admin = await createAdmin(req.user, req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "Admin created successfully.",
      admin
    )
  );
});

export const getAdminsController = asyncHandler(async (req, res) => {
  const admins = await getAdmins(req.user);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Admins fetched successfully.",
      admins
    )
  );
});