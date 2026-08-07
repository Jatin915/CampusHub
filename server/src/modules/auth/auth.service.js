import bcrypt from "bcrypt";

import User from "./user.model.js";
import OTP from "./otp.model.js";
import College from "../colleges/college.model.js";

import ApiError from "../../utils/ApiError.js";

import generateOTP from "./utils/generateOTP.js";
import sendEmail from "../../services/email/sendEmail.js";
import verificationCodeTemplate from "../../services/email/templates/verificationCode.js";

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

const sendVerificationCode = async (email) => {
  email = email.trim().toLowerCase();

  // Check if account already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Extract email domain
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

  // Expiry
  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  // Save / Replace OTP
  await OTP.findOneAndUpdate(
    { email },
    {
      otp: hashedOTP,
      attempts: 0,
      expiresAt,
    },
    {
      upsert: true,
      new: true,
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

export default {
  sendVerificationCode,
};