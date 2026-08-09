import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { sendVerificationCode, verifyVerificationCode } from "./auth.service.js";

import cookieOptions from "./utils/cookieOptions.js";
import { login } from "./auth.service.js";


export const sendVerificationCodeController = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const response = await sendVerificationCode(email);

    return res
      .status(200)
      .json(new ApiResponse(200, response.message));
  }
);


export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, user } = await login(email, password);

  res.cookie("accessToken", accessToken, cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, "Login successful.", user));
});


export const verifyVerificationCodeController = asyncHandler(
  async (req, res) => {
    const { email, otp } = req.body;

    const { signupToken } =
      await verifyVerificationCode(email, otp);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Email verified successfully.",
        {
          signupToken,
        }
      )
    );
  }
);