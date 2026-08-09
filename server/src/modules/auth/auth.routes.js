import { Router } from "express";

import { sendVerificationCodeController, verifyVerificationCodeController } from "./auth.controller.js";
import { loginController } from "./auth.controller.js";

const router = Router();

router.post(
  "/send-verification-code",
  sendVerificationCodeController
);

router.post("/login", loginController);

router.post(
  "/verify-verification-code",
  verifyVerificationCodeController
);

export default router;