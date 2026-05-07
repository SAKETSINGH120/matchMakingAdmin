const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

// Create a new package
export const createPackage = async (formData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Authentication token missing!");
    throw new Error("No auth token");
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/package/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      body: formData, // Send FormData directly
    });

    const result = await res.json();

    if (!res.ok) {
      // Backend validation errors usually come here
      const errorMessage = result.message || "Failed to create package";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success("Package created successfully!");
    return result;
  } catch (err) {
    console.error("Create package error:", err);
    const errorMessage = err.message || "Something went wrong!";
    toast.error(errorMessage);
    throw err;
  }
};

// Get all packages (with pagination and search)
export const getAllPackages = async ({ page, rowsPerPage, searchQuery = "" }) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/package/list?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch packages");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

// Get package by ID
export const getPackageById = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/package/detail/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch package");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

// Update package
export const updatePackage = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/admin/package/update/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type when using FormData → browser sets it automatically
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Update failed");
  }
  return result;
};

// Delete package
export const deletePackage = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/package/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete package");
    }

    toast.success("Package deleted successfully!");
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message || "Something went wrong!");
  }
};