import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllAdmission = async ({
  page,
  rowsPerPage,
  searchQuery,
  college,
}) => {
  const token = localStorage.getItem("token");
  try {
    let url = `${BASE_URL}/api/admin/admission?page=${page}&limit=${rowsPerPage}`;
    if (college) {
      url += `&college=${college}`;
    }
    const res = await fetch(url, {
      method: "GET", // Change method to POST
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

export const admissionDelete = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/admission/${id}`, {
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

export const createAdmissionApi = async (data) => {
  const token = localStorage.getItem("token");
  console.log(data, " data for send in the api");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/admission`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Required for JSON data
      },
      body: JSON.stringify(data), // Convert JS object to JSON string
    });

    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

// Or use a secure auth provider

export const updateAdmissionApi = async ({ id, data }) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/admission/${id}`, {
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

export const getAdmissionApi = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/admission/${id}`, {
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

export const uploadAdmissionCsv = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/college/admission-upload-csv`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
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
