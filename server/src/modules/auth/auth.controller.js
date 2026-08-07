import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import authService from "./auth.service.js";

const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const response = await authService.sendVerificationCode(email);

  return res
    .status(200)
    .json(new ApiResponse(200, response.message));
});

export { sendVerificationCode };