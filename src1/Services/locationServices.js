import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllLocations = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/location/list?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    console.log(result);
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};
