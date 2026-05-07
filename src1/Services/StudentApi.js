import toast from "react-hot-toast";
import { convertUTCDateToYYYYMMDD } from "../utils/convertUTCtoLocalDate";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllStudents = async ({
  page,
  rowsPerPage,
  searchQuery,
  startDate,
  endDate,
  sort,
}) => {
  const token = localStorage.getItem("token");
  try {
    let query = `?page=${page}&limit=${rowsPerPage}&sort=${sort}`;
    if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
    if (startDate)
      query += `&startDate=${encodeURIComponent(
        convertUTCDateToYYYYMMDD(startDate)
      )}`;
    if (endDate)
      query += `&endDate=${encodeURIComponent(
        convertUTCDateToYYYYMMDD(endDate)
      )}`;

    const res = await fetch(`${BASE_URL}/api/admin/user${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `HTTP error: ${res.status}`);
    }
    if (!result.status) {
      throw new Error(result.message || "Failed to fetch students.");
    }
    return result;
  } catch (err) {
    console.error("Error in students:", err);
    throw err;
  }
};

export const deleteStudent = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/user/${id}`, {
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

export const createStudent = async (formData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const updateStudentDetails = async ({ id, data }) => {
  const token = localStorage.getItem("token");
  if (!id) throw new Error("Missing ID in updateStudent");

  const res = await fetch(`${BASE_URL}/api/admin/user/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return res.json();
};

export const getStudent = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { status: false, message: "Failed to fetch admin" };
  }
};

export const getAllStudentBookings = async ({
  page,
  rowsPerPage,
  searchQuery,
  startDate,
  endDate,
  counsellor,
  user,
  status,
  callStatus,
  sort,
}) => {
  const token = localStorage.getItem("token");
  try {
    let query = `?page=${page}&limit=${rowsPerPage}&sort=${sort}`;
    if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
    if (startDate)
      query += `&startDate=${encodeURIComponent(
        convertUTCDateToYYYYMMDD(startDate)
      )}`;
    if (endDate)
      query += `&endDate=${encodeURIComponent(
        convertUTCDateToYYYYMMDD(endDate)
      )}`;
    if (counsellor) query += `&counsellor=${encodeURIComponent(counsellor)}`;
    if (user) query += `&user=${encodeURIComponent(user)}`;
    if (status) query += `&status=${encodeURIComponent(status)}`;
    if (callStatus) query += `&callStatus=${encodeURIComponent(callStatus)}`;

    const res = await fetch(`${BASE_URL}/api/admin/userBookings${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `HTTP error: ${res.status}`);
    }
    if (!result.status) {
      throw new Error(result.message || "Failed to fetch students.");
    }
    return result;
  } catch (err) {
    console.error("Error in students:", err);
    throw err;
  }
};

export const getAllStudentsRatings = async ({
  page,
  rowsPerPage,
  user,
  college,
  isApproved,
}) => {
  const token = localStorage.getItem("token");
  try {
    let query = `?page=${page}&limit=${rowsPerPage}`;
    if (user) query += `&user=${encodeURIComponent(user)}`;
    if (college) query += `&college=${encodeURIComponent(college)}`;
    if (isApproved !== "")
      query += `&isApproved=${encodeURIComponent(isApproved)}`;

    const res = await fetch(`${BASE_URL}/api/admin/collegeRating${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `HTTP error: ${res.status}`);
    }
    if (!result.status) {
      throw new Error(result.message || "Failed to fetch students.");
    }
    return result;
  } catch (err) {
    console.error("Error in students:", err);
    throw err;
  }
};

export const createRating = async (bodyPayload) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/collegeRating`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const updateRating = async ({ id, bodyPayload }) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/collegeRating/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const getRatingById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/collegeRating/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { status: false, message: "Failed to fetch admin" };
  }
};

export const getAllStudentsSearchHistory = async ({
  page,
  rowsPerPage,
  userId,
}) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/searchHistory?page=${page}&limit=${rowsPerPage}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
        // body: JSON.stringify({ userId, page: page, limit: rowsPerPage }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `HTTP error: ${res.status}`);
    }
    if (!result.status) {
      throw new Error(result.message || "Failed to fetch search history.");
    }
    return result;
  } catch (err) {
    console.error("Error in search history:", err);
    throw err;
  }
};

export const deleteSearchHistory = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/searchHistory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
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

export const createSearchHistory = async (payload) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/searchHistory`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const getSearchHistory = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/searchHistory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { status: false, message: "Failed to fetch search history" };
  }
};
