
import { createOrdersFromCart } from "./order.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const orders = await createOrdersFromCart(
    req.user._id,
    req.body.productIds
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Orders created successfully for selected products.",
      orders
    )
  );
});
