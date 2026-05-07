import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const getAllNotifications = async ({
//   page,
//   rowsPerPage,
//   searchQuery,
//   user,
// }) => {
//   const token = localStorage.getItem("token");
//   try {
//     let url = `${BASE_URL}/api/admin/notification?page=${page}&limit=${rowsPerPage}`;
//     if (searchQuery) {
//       url += `&search=${searchQuery}`;
//     }
//     if (user) {
//       url += `&userId=${user}`;
//     }
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     const result = await res.json();
//     if (!res.status) throw new Error(result.message);
//     return result;
//   } catch (err) {
//     toast.error(err.message || "Something went wrong!");
//     throw new Error(err.message);
//   }
// };

// export const createNotification = async (dataToSend) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${BASE_URL}/api/admin/notification`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // "Content-Type": "application/json",
//       },
//       body: dataToSend,
//     });
//     const result = await res.json();
//     return result;
//   } catch (err) {
//     toast.error(err.message || "Something went wrong!");
//     throw new Error(err.message);
//   }
// };

// export const updateNotification = async ({ id, data }) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${BASE_URL}/api/admin/notification/${id}`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await res.json();
//     return result;
//   } catch (err) {
//     toast.error(err.message || "Something went wrong!");
//     throw new Error(err.message);
//   }
// };

// export const getNotification = async (id) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${BASE_URL}/api/admin/notification/${id}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     const result = await res.json();
//     return result;
//   } catch (err) {
//     toast.error(err.message || "Something went wrong!");
//     throw new Error(err.message);
//   }
// };

// export const deleteNotification = async (id) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${BASE_URL}/api/admin/notification/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     const result = await res.json();
//     if (!res.status) throw new Error(result.message);
//     return result;
//   } catch (err) {
//     toast.error(err.message || "Something went wrong!");
//     throw new Error(err.message || "Something went wrong!");
//   }
// };

// export const sendNotification = async (id) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(
//       `${BASE_URL}/api/admin/bookingNotificationMail/${id}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const result = await res.json();
//     return result;
//   } catch (err) {
//     toast.error(err.message || "Something went wrong!");
//     throw new Error(err.message);
//   }
// };



export const markNotificationRead = async (id) => {
  try {
    const res = await axiosInstance.patch(
      `/api/v1/admin/notifications/${id}/read`,
    );

    return res.data;
  } catch (error) {
    console.error("Notification read error:", error);
  }
};