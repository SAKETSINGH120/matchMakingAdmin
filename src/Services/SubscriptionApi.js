import axios from "../utils/axiosInstance";

export const getAllSubscriptions = async ({
  search = "",
  status = "",
  page = 1,
}) => {
  const res = await axios.get("/api/admin/subscriptions", {
    params: { search, status, page },
  });
  return res.data;
};

export const getSubscriptions = async ({ search = "" } = {}) => {
  const res = await axios.get("/api/v1/admin/subscriptions", {
    params: { search },
  });
  return res.data;
};

export const getSubscriptionById = async (id) => {
  const res = await axios.get(`/api/v1/admin/subscriptions/${id}`);
  return res.data;
};

export const createSubscription = async (payload) => {
  const res = await axios.post("/api/v1/admin/subscriptions", payload);
  return res.data;
};

export const updateSubscription = async (id, data) => {
  const res = await axios.put(`/api/v1/admin/subscriptions/${id}`, data);
  return res.data;
};

export const deleteSubscription = async (id) => {
  const res = await axios.delete(`/api/v1/admin/subscriptions/${id}`);
  return res.data;
};
