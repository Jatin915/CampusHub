import api from "./api";

export const createOrder = async (productIds) => {
  const response = await api.post("/orders", { productIds });
  return response.data;
};