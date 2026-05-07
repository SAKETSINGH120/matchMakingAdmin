import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");
  try {
    let url = `${BASE_URL}/api/v1/admin/dashboard`;
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
