import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusHub API is running",
  });
});

router.use("/auth", authRoutes);

export default router;