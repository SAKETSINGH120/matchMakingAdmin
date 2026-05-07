const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

export const updateSettings = async (id, data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/setting/update/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Update failed");
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    console.error(err.message || "Something went wrong!");
    throw err;
  }
};

export const getSettings = async () => {
  const token = localStorage.getItem("token");
  const url = `${BASE_URL}/api/admin/setting`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};
