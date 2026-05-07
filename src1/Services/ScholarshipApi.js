import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllScholarships = async ({
  page,
  rowsPerPage,
  searchQuery,
  sort,
}) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/scholarship?search=${searchQuery}&page=${page}&limit=${rowsPerPage}&sort=${sort}`,
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

export const deleteScholarship = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarship/${id}`, {
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

export const createScholarship = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarship`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const updateScholarship = async (id, data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarship/${id}`, {
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

export const getScholarship = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarship/${id}`, {
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

export const getAllScholarshipApplications = async ({
  page,
  rowsPerPage,
  applicationStatus,
  user,
  scholarship,
  sort,
}) => {
  const token = localStorage.getItem("token");
  try {
    let url = `${BASE_URL}/api/admin/scholarshipForm?page=${page}&limit=${rowsPerPage}&sort=${sort}`;
    if (applicationStatus) url += `&applicationStatus=${applicationStatus}`;
    if (user) url += `&user=${user}`;
    if (scholarship) url += `&scholarship=${scholarship}`;
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

export const deleteScholarshipApplication = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarshipForm/${id}`, {
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

export const getScholarshipApplicationDetails = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarshipForm/${id}`, {
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

export const updateScholarshipApplicationStatus = async (id, data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/scholarshipForm/${id}`, {
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
