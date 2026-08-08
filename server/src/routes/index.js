import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";

import collegeRoutes from "../modules/colleges/college.routes.js";

import adminRoutes from "../modules/admins/admin.routes.js";

import categoryRoutes from "../modules/categories/category.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusHub API is running",
  });
});


router.use("/auth", authRoutes);

router.use("/colleges", collegeRoutes);

router.use("/admins", adminRoutes);

router.use("/categories", categoryRoutes);

export default router;