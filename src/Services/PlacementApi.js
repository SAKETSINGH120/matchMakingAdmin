import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllPlacement = async ({
  page,
  rowsPerPage,
  searchQuery,
  college,
}) => {
  const token = localStorage.getItem("token");
  try {
    let url = `${BASE_URL}/api/admin/placement?page=${page}&limit=${rowsPerPage}`;
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }
    if (college) {
      url += `&college=${college}`;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const placementDelete = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/placement/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message || "Something went wrong!");
  }
};

export const createPlacementApi = async (payload) => {
  const token = localStorage.getItem("token");
  console.log(payload, " payload for send in the api");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/placement`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Required for JSON payload
      },
      body: JSON.stringify(payload), // Convert JS object to JSON string
    });

    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

// Or use a secure auth provider

export const updatePlacementApi = async ({ id, data }) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/placement/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // token must be defined
      },
      body: JSON.stringify(data),
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

export const getPlacementApi = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/placement/${id}`, {
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

export const uploadPlacementCsv = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/college/placement-upload-csv`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const result = await res.json();
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};
