import getResendClient from "../../config/mail.js";
import ApiError from "../../utils/ApiError.js";

const sendEmail = async ({ to, subject, html }) => {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new ApiError(502, "Unable to send verification email.");
  }

  return data;
};

export default sendEmail;