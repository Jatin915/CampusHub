import api from "./api";

export const createCheckout = async (productIds, idempotencyKey) => {
  const response = await api.post("/payments/checkout", {
    productIds,
    idempotencyKey,
  });

  return response.data;
};

export const verifyPayment = async (paymentDetails) => {
  const response = await api.post("/payments/verify", paymentDetails);

  return response.data;
};