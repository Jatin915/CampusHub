import bcrypt from "bcrypt";
import User from "./user.model.js";
import OTP from "./otp.model.js";
import College from "../colleges/college.model.js";
import ApiError from "../../utils/ApiError.js";
import generateOTP from "./utils/generateOTP.js";
import sendEmail from "../../services/email/sendEmail.js";
import verificationCodeTemplate from "../../services/templates/verificationCode.js";
import {
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_ATTEMPTS
} from "./auth.constants.js";
import { generateAccessToken } from "./utils/jwt.js";
import { generateVerificationToken } from "./utils/jwt.js";

export const sendVerificationCode = async (email) => {
  email = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Extract domain
  const domain = email.split("@")[1];

  // Verify college
  const college = await College.findOne({
    domains: domain,
    isActive: true,
  });

  if (!college) {
    throw new ApiError(
      400,
      "Only students from registered colleges can sign up."
    );
  }

  // Check resend cooldown
  const existingOTP = await OTP.findOne({ email });

  if (existingOTP) {
    const secondsPassed =
      (Date.now() - existingOTP.updatedAt.getTime()) / 1000;

    if (secondsPassed < OTP_RESEND_COOLDOWN_SECONDS) {
      throw new ApiError(
        429,
        `Please wait ${Math.ceil(
          OTP_RESEND_COOLDOWN_SECONDS - secondsPassed
        )} seconds before requesting another code.`
      );
    }
  }

  // Generate OTP
  const otp = generateOTP();

  // Hash OTP
  const hashedOTP = await bcrypt.hash(otp, 10);

  // Expiry time
  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  // Save OTP
  await OTP.findOneAndUpdate(
    { email },
    {
      email,
      otp: hashedOTP,
      attempts: 0,
      expiresAt,
    },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
    }
  );

  // Send email
  await sendEmail({
    to: email,
    subject: "CampusHub Email Verification",
    html: verificationCodeTemplate(otp),
  });

  return {
    message: "Verification code sent successfully.",
  };
};


export const login = async (email, password) => {
  email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated."
    );
  }

  if (user.authProvider !== "LOCAL") {
    throw new ApiError(
      400,
      "Please continue with Google."
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  await user.updateLastLogin();

  const accessToken = generateAccessToken(user._id);

  return {
    accessToken,
    user: user.toSafeObject(),
  };
};

//
export const verifyVerificationCode = async (email, otp) => {
  email = email.trim().toLowerCase();

  const verificationCode = await OTP.findOne({ email });

  if (!verificationCode) {
    throw new ApiError(
      400,
      "Verification code is invalid or has expired."
    );
  }

  if (verificationCode.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: verificationCode._id });

    throw new ApiError(
      400,
      "Verification code has expired. Please request a new code."
    );
  }

  if (verificationCode.attempts >= MAX_OTP_ATTEMPTS) {
    await OTP.deleteOne({ _id: verificationCode._id });

    throw new ApiError(
      429,
      "Too many verification attempts. Please request a new code."
    );
  }

  const isValid = await bcrypt.compare(
    otp,
    verificationCode.otp
  );

  if (!isValid) {
    verificationCode.attempts += 1;

    await verificationCode.save();

    throw new ApiError(
      400,
      "Invalid verification code."
    );
  }

  await OTP.deleteOne({
    _id: verificationCode._id,
  });

  const signupToken = generateVerificationToken(email);

  return {
    signupToken,
  };
};