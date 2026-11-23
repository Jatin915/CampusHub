import api from "./api";

export const getMarketplaceProducts = async ({
  page = 1,
  limit = 12,
  sort = "newest",
  categoryId,
} = {}) => {
  const response = await api.get("/products", {
    params: { page, limit, sort, categoryId },
  });

  return response.data;
};

export const getProductDetails = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};
