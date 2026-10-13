import { Router } from "express";
import { sendVerificationCodeController, verifyVerificationCodeController, loginController, signupController, getMe, logout } from "./auth.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = Router();

router.post(
  "/send-verification-code",
  sendVerificationCodeController
);

router.post(
  "/verify-verification-code",
  verifyVerificationCodeController
);

router.post(
  "/signup",
  signupController
);

router.post(
  "/login",
  loginController
);

router.get(
  "/me",
  protect,
  getMe
);

router.post(
  "/logout", 
  logout
);

export default router;