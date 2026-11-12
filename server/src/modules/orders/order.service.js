import mongoose from "mongoose";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import User from "../auth/user.model.js";
import Order from "./order.model.js";
import { ORDER_STATUS, PAYMENT_STATUS } from "./order.constants.js";
import ApiError from "../../utils/ApiError.js";


export const createOrdersFromCart = async (userId, selectedProductIds) => {
  if (
    !Array.isArray(selectedProductIds) ||
    selectedProductIds.length === 0
  ) {
    throw new ApiError(400, "Please select at least one product.");
  }

  if (selectedProductIds.some((id) => !mongoose.isValidObjectId(id))) {
    throw new ApiError(400, "One or more product IDs are invalid.");
  }

  const selectedIds = selectedProductIds.map((id) => id.toString());

  if (new Set(selectedIds).size !== selectedIds.length) {
    throw new ApiError(400, "Duplicate product IDs are not allowed.");
  }

  const selectedSet = new Set(selectedIds);
  const session = await mongoose.startSession();

  try {
    let createdOrders = [];

    await session.withTransaction(async () => {
      const buyer = await User.findById(userId).session(session);

      if (!buyer) {
        throw new ApiError(404, "User not found.");
      }

      if (!buyer.college) {
        throw new ApiError(400, "Your college is not configured.");
      }

      const cart = await Cart.findOne({ user: buyer._id }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty.");
      }

      // Select only products requested by the frontend.
      const selectedCartItems = cart.items.filter((item) =>
        selectedSet.has(item.product.toString())
      );

      // Every requested product must belong to this user's cart.
      if (selectedCartItems.length !== selectedIds.length) {
        throw new ApiError(
          400,
          "One or more selected products are not in your cart."
        );
      }

      const sellerGroups = new Map();

      for (const cartItem of selectedCartItems) {
        const quantity = cartItem.quantity;

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new ApiError(400, "Invalid cart item quantity.");
        }

        // Atomically verify availability and decrement stock.
        const product = await Product.findOneAndUpdate(
          {
            _id: cartItem.product,
            isActive: true,
            quantity: { $gte: quantity },
          },
          {
            $inc: { quantity: -quantity },
          },
          {
            returnDocument: "after",
            session,
          }
        );

        if (!product) {
          throw new ApiError(
            400,
            "A selected product is unavailable or has insufficient stock."
          );
        }

        if (product.college.toString() !== buyer.college.toString()) {
          throw new ApiError(
            403,
            "You can only order products from your own college."
          );
        }

        if (product.seller.toString() === buyer._id.toString()) {
          throw new ApiError(
            400,
            "You cannot purchase your own product."
          );
        }

        const sellerId = product.seller.toString();

        if (!sellerGroups.has(sellerId)) {
          sellerGroups.set(sellerId, {
            seller: product.seller,
            items: [],
            totalAmount: 0,
          });
        }

        const group = sellerGroups.get(sellerId);

        group.items.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          condition: product.condition,
          image: product.images?.[0]?.url || "",
        });

        group.totalAmount += product.price * quantity;
      }

      const orderDocuments = [...sellerGroups.values()].map((group) => ({
        buyer: buyer._id,
        seller: group.seller,
        college: buyer.college,
        items: group.items,
        totalAmount: group.totalAmount,
        status: ORDER_STATUS.PENDING_PAYMENT,
        payment: {
          status: PAYMENT_STATUS.PENDING,
          provider: "RAZORPAY",
        },
      }));

      createdOrders = await Order.create(orderDocuments, { session });

      // Remove only purchased products from the cart.
      cart.items = cart.items.filter(
        (item) => !selectedSet.has(item.product.toString())
      );

      await cart.save({ session });
    });

    return createdOrders;
  } finally {
    await session.endSession();
  }
};


export const getMyOrders = async (userId, query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    20,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  );

  const skip = (page - 1) * limit;

  const filter = {
    buyer: userId,
  };

  // Optional status filter
  if (query.status) {
    if (!Object.values(ORDER_STATUS).includes(query.status)) {
      throw new ApiError(400, "Invalid order status.");
    }

    filter.status = query.status;
  }

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter)
      .populate("seller", "fullName email")
      .populate("items.product", "name images condition")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      limit,
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPrevPage: page > 1,
    },
  };
};


export const getOrderDetails = async (orderId, userId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid order ID.");
  }

  const order = await Order.findOne({
    _id: orderId,
    buyer: userId,
  })
    .populate("seller", "fullName email")
    .populate("college", "name")
    .lean();

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return order;
};


export const confirmOrderReceived = async (orderId, buyerId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid order ID.");
  }

  const now = new Date();
  const autoDeliveryAt = new Date(
    now.getTime() + 24 * 60 * 60 * 1000
  );

  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      buyer: buyerId,
      status: ORDER_STATUS.READY_FOR_PICKUP,
      "payment.status": PAYMENT_STATUS.PAID,
      "meetup.buyerConfirmedAt": null,
      "meetup.sellerConfirmedAt": null,
    },
    {
      $set: {
        status: ORDER_STATUS.AWAITING_CONFIRMATION,
        "meetup.buyerConfirmedAt": now,
        "meetup.autoDeliveryAt": autoDeliveryAt,
      },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );

  if (!order) {
    const existingOrder = await Order.findOne({
      _id: orderId,
      buyer: buyerId,
    }).select("status payment.status meetup");

    if (!existingOrder) {
      throw new ApiError(404, "Order not found.");
    }

    if (existingOrder.meetup?.buyerConfirmedAt) {
      throw new ApiError(409, "You have already confirmed receipt.");
    }

    if (existingOrder.payment.status !== PAYMENT_STATUS.PAID) {
      throw new ApiError(400, "Order payment is not completed.");
    }

    throw new ApiError(
      400,
      "Order is not ready for pickup."
    );
  }

  return order;
};