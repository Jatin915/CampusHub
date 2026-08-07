import { Router } from "express";

import { sendVerificationCode } from "./auth.controller.js";

const router = Router();

router.post(
  "/send-verification-code",
  sendVerificationCode
);

export default router;