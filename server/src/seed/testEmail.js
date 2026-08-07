import dotenv from "dotenv";
dotenv.config();

import sendEmail from "../services/email/sendEmail.js";

const testEmail = async () => {
  try {
    await sendEmail({
      to: "jammu4644@gmail.com",
      subject: "CampusHub Email Test",
      html: `
        <h2>🎉 CampusHub Email Test</h2>
        <p>If you're reading this, Resend is configured correctly.</p>
      `,
    });

    console.log("✅ Test email sent successfully.");
  } catch (error) {
    console.error("❌ Failed to send email.");
    console.error(error);
  }
};

testEmail();