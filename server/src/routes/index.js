import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";

import collegeRoutes from "../modules/colleges/college.routes.js";

import adminRoutes from "../modules/admins/admin.routes.js";

import categoryRoutes from "../modules/categories/category.routes.js";

import productRoutes from "../modules/product/product.routes.js";

import cartRoutes from "../modules/cart/cart.routes.js";

import orderRoutes from "../modules/orders/order.routes.js";

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

router.use("/products", productRoutes);

router.use("/cart", cartRoutes);

router.use("/orders", orderRoutes);

export default router;