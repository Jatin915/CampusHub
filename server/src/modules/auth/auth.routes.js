import { Router } from "express";

import { sendVerificationCodeController } from "./auth.controller.js";
import { loginController } from "./auth.controller.js";

const router = Router();

router.post(
  "/send-verification-code",
  sendVerificationCodeController
);

router.post("/login", loginController);

export default router;