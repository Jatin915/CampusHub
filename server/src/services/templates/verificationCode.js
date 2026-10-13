const verificationCodeTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>CampusHub Email Verification</h2>

      <p>Your verification code is:</p>

      <h1>${otp}</h1>

      <p>This code expires in 10 minutes.</p>

      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `;
};

export default verificationCodeTemplate;