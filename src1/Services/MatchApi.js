const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

export const getAllMatches = async ({
  page,
  rowsPerPage,
  searchQuery = "",
}) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/admin/matches?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
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
      throw new Error(result.message || "Failed to fetch matches");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

export const getMatchById = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/matches/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch match details");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// export const updateMatchStatus = async (matchId, action) => {
//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch(`${BASE_URL}/api/v1/admin/matches/${matchId}/updateStatus`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         action: action, // approve OR reject
//       }),
//     });

//     return await res.json();
//   } catch (error) {
//     console.error(error);
//     return { success: false, message: "Something went wrong" };
//   }
// };

export const updateMatchStatus = async (matchId, action, adminNote) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/admin/matches/${matchId}/updateStatus`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action,
          adminNote: adminNote,
        }),
      },
    );

    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const getChatHistory = async (matchId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/chat/${matchId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch chat history");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

export const updateMatchDetail = async (matchId, status) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/admin/meetings/${matchId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      },
    );

    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};
