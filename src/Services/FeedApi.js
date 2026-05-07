const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

/**
 * Clear feed for a user
 * @param {String} userId - User ID to clear feed for
 */
export const clearFeed = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/feed/clear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to clear feed");
    }

    return result;
  } catch (err) {
    console.error("Error clearing feed::", err);
    toast.error(err.message || "Error clearing feed");
    throw err;
  }
};
