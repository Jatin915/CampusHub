import {
  createOrdersFromCart,
  getMyOrders,
  getOrderDetails,
  confirmOrderReceived,
} from "./order.service.js";
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

export const getMyOrdersController = asyncHandler(async (req, res) => {
  const result = await getMyOrders(req.user._id, req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Orders fetched successfully.",
      result
    )
  );
});

export const getOrderDetailsController = asyncHandler(
  async (req, res) => {
    const order = await getOrderDetails(
      req.params.orderId,
      req.user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Order details fetched successfully.",
        order
      )
    );
  }
);

export const confirmOrderReceivedController = asyncHandler(
  async (req, res) => {
    const order = await confirmOrderReceived(
      req.params.orderId,
      req.user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product receipt confirmed successfully.",
        order
      )
    );
  }
);