const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

export const getAllRouteMap = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/routeMaps?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const createRouteMap = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/routeMaps/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const updateRouteMap = async (id, data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/routeMaps/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export const getRouteMapById = async (id, location) => {
  const token = localStorage.getItem("token");
  let url = `${BASE_URL}/api/admin/routeMaps/${id}`;
  if (location) url += `?location=${location}`;
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

export const deleteRouteMap = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/routeMaps/delete/${id}`, {
      method: "DELETE",
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
    throw new Error(err.message || "Something went wrong!");
  }
};

export const getLocationByCity = async (cityId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/common/locations?cityId=${cityId}`, {
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
        throw new Error(err.message || "Something went wrong!");
    }
};