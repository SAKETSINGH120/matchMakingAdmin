import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllDriverCashCollection = async () => {
  const token = localStorage.getItem("token");
  try {
    let url = `${BASE_URL}/api/admin/driver/commissions`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};


export const updateDriverCashCollectionStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}/api/admin/driver/commissions/${id}/status`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update status");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Failed to update cash collection status");
    throw err;
  }
};