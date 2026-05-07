const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

// export const getAllUsers = async ({
//   page,
//   rowsPerPage,
//   searchQuery,
//   startDate,
//   endDate,
//   sort,
// }) => {
//   const token = localStorage.getItem("token");
//   try {
//     let query = `?page=${page}&limit=${rowsPerPage}&sort=${sort}`;
//     if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
//     if (startDate)
//       query += `&startDate=${encodeURIComponent(
//         convertUTCDateToYYYYMMDD(startDate)
//       )}`;
//     if (endDate)
//       query += `&endDate=${encodeURIComponent(
//         convertUTCDateToYYYYMMDD(endDate)
//       )}`;

//     const res = await fetch(`${BASE_URL}/api/admin/user${query}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || `HTTP error: ${res.status}`);
//     }
//     if (!result.status) {
//       throw new Error(result.message || "Failed to fetch students.");
//     }
//     return result;
//   } catch (err) {
//     console.error("Error in students:", err);
//     throw err;
//   }
// };

// export const getAllUsers = async ({
//   page,
//   rowsPerPage = 10,
//   searchQuery = "",

// }) => {
//   const token = localStorage.getItem("token");

//   try {

//     const res = await fetch(
//       `${BASE_URL}/api/v1/admin/users?searchQuery=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || "Failed to fetch users");
//     }

//     if (!result.status || !result.data) {
//       throw new Error(result.message || "Invalid response from server");
//     }

//     return result;
//   } catch (err) {

//     console.error("getAllUsers error:", err);
//     throw new Error(err.message || "Failed to load users");
//   }
// };

// Corrected getAllUsers Service
export const getAllUsers = async ({
  page,
  rowsPerPage = 10,
  searchQuery = "",
  status,
}) => {
  const token = localStorage.getItem("token");
  console.log(status);
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/admin/users?searchQuery=${searchQuery}&page=${page}&limit=${rowsPerPage}&status=${status}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch users");
    }

    // FIXED: Check 'success' instead of 'status' to match API response
    if (!result.success || !result.data) {
      throw new Error(result.message || "Invalid response from server");
    }
    return result;
  } catch (err) {
    console.error("getAllUsers error:", err);
    throw new Error(err.message || "Failed to load users");
  }
};

// export const updateUserStatus = async (Id, action) => {
//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch(`${BASE_URL}/admin/users/${Id}/status`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(action),
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || "Failed to update status");
//     }

//     return result;
//   } catch (err) {
//     toast.error(err.message || "Failed to update status!");
//     throw err;
//   }
// };

export const getUserById = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch ");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const updateUserStatus = async (Id, action) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/users/${Id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update status");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Failed to update status!");
    throw err;
  }
};

export const getAvailableProfiles = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/admin/user/${userId}/available-profiles`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch available profiles");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Failed to fetch profiles!");
    throw err;
  }
};

export const assignProfilesToUser = async (userId, profileIds) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/user/profile-assign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, profileIds }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to assign profiles");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Failed to assign profiles!");
    throw err;
  }
};

export const removeAssignedProfileFromUser = async (userId, targetProfileId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/user/profile-remove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, targetProfileId }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to remove assigned profile");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Failed to remove assigned profile!");
    throw err;
  }
};
