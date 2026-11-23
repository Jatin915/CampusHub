import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const sendVerificationCode = async (email) => {
  const response = await api.post(
    "/auth/send-verification-code",
    { email }
  );

  return response.data;
};

export const verifyVerificationCode = async (email, otp) => {
  const response = await api.post(
    "/auth/verify-verification-code",
    { email, otp }
  );

  return response.data;
};

export const signupUser = async (signupData) => {
  const response = await api.post("/auth/signup", signupData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};