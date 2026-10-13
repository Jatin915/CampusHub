
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import User from "../auth/user.model.js";
import ApiError from "../../utils/ApiError.js";

const CART_POPULATE = {
  path: "items.product",
  select: "name description price images quantity condition category college seller isActive",
  populate: {
    path: "category",
    select: "name slug",
  },
};

const getPopulatedCart = async (cart) => {
  await cart.populate(CART_POPULATE);
  return cart;
};

const validateProductForUser = async (productId, userId) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  const user = await User.findOne({_id:userId});

  if (!product) {
    throw new ApiError(404, "Product not found or unavailable.");
  }

  if (
    !user.college ||
    product.college.toString() !== user.college.toString()
  ) {
    throw new ApiError(
      403,
      "You can only add products from your own college."
    );
  }

  if (product.quantity < 1) {
    throw new ApiError(400, "This product is out of stock.");
  }

  return {product, user};
};

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return getPopulatedCart(cart);
};

export const addToCart = async ({ userId, productId, quantity = 1 }) => {
  const {product, user} = await validateProductForUser(productId, userId);

  const cart = await Cart.findOne({ user: user._id });
  const existingItem = cart?.items.find(
    (item) => item.product.toString() === productId
  );

  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (newQuantity > product.quantity) {
    throw new ApiError(
      400,
      `Only ${product.quantity} unit(s) are available.`
    );
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
    await cart.save();
    return getPopulatedCart(cart);
  }

  if (cart) {
    cart.items.push({
      product: product._id,
      quantity,
    });

    await cart.save();
    return getPopulatedCart(cart);
  }

  const newCart = await Cart.create({
    user: user._id,
    items: [{ product: product._id, quantity }],
  });

  return getPopulatedCart(newCart);
};

export const updateCartItem = async ({ user, productId, quantity }) => {
  const product = await validateProductForUser(productId, user);

  if (quantity > product.quantity) {
    throw new ApiError(
      400,
      `Only ${product.quantity} unit(s) are available.`
    );
  }

  const cart = await Cart.findOne({ user: user._id });

  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw new ApiError(404, "Product not found in your cart.");
  }

  item.quantity = quantity;
  await cart.save();

  return getPopulatedCart(cart);
};

export const removeCartItem = async ({ userId, productId }) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  const initialLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === initialLength) {
    throw new ApiError(404, "Product not found in your cart.");
  }

  await cart.save();

  return getPopulatedCart(cart);
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  cart.items = [];
  await cart.save();

  return cart;
};
