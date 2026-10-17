
import { Router } from "express";
import { createOrder } from "./order.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = Router();

router.post("/", protect, createOrder);

export default router;
