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

