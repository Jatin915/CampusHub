
import api from "./api";

export const createOrder = async (productIds) => {
  const response = await api.post("/orders", { productIds });
  return response.data;
};

export const getMyOrders = async (params = {}) => {
  const response = await api.get("/orders/my-orders", { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const confirmOrderReceived = async (orderId) => {
  const response = await api.patch(
    `/orders/${orderId}/confirm-received`,
  );
  return response.data;
};
