import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    }
  );
};

export const generateVerificationToken = (email) => {
  return jwt.sign(
    {
      email,
      purpose: "SIGNUP",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_VERIFICATION_EXPIRES_IN,
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};