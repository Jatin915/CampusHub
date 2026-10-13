import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { createCollege, createOwner } from "./college.service.js";

export const createCollegeController =
  asyncHandler(async (req, res) => {
    const college = await createCollege(req.body);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "College created successfully.",
          college
        )
      );
});



export const createOwnerController = asyncHandler(async (req, res) => {
  const owner = await createOwner(
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "College owner created successfully.",
      owner
    )
  );
});