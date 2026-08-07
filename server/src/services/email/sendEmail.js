import getResendClient from "../../config/mail.js";

const sendEmail = async ({ to, subject, html }) => {
  const resend = getResendClient();

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export default sendEmail;