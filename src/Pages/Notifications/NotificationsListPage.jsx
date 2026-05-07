
import React, { useEffect, useState } from "react";
import { FaBell, FaCheckDouble, FaInbox, FaCheck } from "react-icons/fa";

// const BASE_URL = "";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [filter, setFilter] = useState("unread"); // "all" | "unread" | "read"

  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ─── Fetch ALL notifications (read + unread) ──────────────────────────────
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/notifications`, {
        method: "GET",
        headers: authHeaders,
      });
      const data = await res.json();
      setNotifications(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ─── Mark single as read ──────────────────────────────────────────────────
  const markAsRead = async (id) => {
    setMarkingId(id);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/notifications/${id}/read`, {
        method: "PATCH",
        headers: authHeaders,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Mark read failed:", err?.message);
        return;
      }

      // ✅ Update isRead in local state (don't remove, just mark)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setMarkingId(null);
    }
  };

  // ─── Mark ALL unread as read ───────────────────────────────────────────────
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    try {
      await Promise.all(
        unread.map((n) =>
          fetch(`${BASE_URL}/api/v1/admin/notifications/${n._id}/read`, {
            method: "PATCH",
            headers: authHeaders,
          })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const timeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const intervals = [
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 },
    ];
    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count > 0) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  return (
    <div className="theme-page p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBell className="text-2xl text-theme-light-heading dark:text-theme-dark-textPrimary" />
          <h2 className="text-2xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
          >
            <FaCheckDouble />
            Mark all as read
          </button>
        )} */}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5">
        {["all", "unread", "read"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${filter === tab
                ? "bg-theme-light-primaryButton text-white dark:bg-theme-dark-primaryButton"
                : "border border-theme-light-border bg-theme-light-surface text-theme-light-textSecondary hover:border-theme-light-primaryButton dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary dark:hover:border-theme-dark-primaryButton"
              }`}
          >
            {tab === "all"
              ? `All (${notifications.length})`
              : tab === "unread"
                ? `Unread (${unreadCount})`
                : `Read (${notifications.length - unreadCount})`}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="theme-panel animate-pulse rounded-xl p-4">
              <div className="mb-2 h-4 w-1/3 rounded bg-theme-light-border dark:bg-theme-dark-border" />
              <div className="h-3 w-2/3 rounded bg-theme-light-bg dark:bg-theme-dark-bg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          <FaInbox className="text-5xl text-theme-light-textDisabled dark:text-theme-dark-textDisabled" />
          <p className="text-lg font-medium">No notifications here</p>
        </div>
      )}

      {/* Notification List */}
      {!loading && (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className={`theme-panel flex items-start justify-between gap-4 rounded-xl border-l-4 p-4 transition-shadow duration-200 hover:shadow-md ${item.isRead ? "border-green-400" : "border-red-400"
                }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-semibold leading-snug text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                    {item.title || "Notification"}
                  </h3>
                  {/* ✅ Read = green tick | Unread = red dot */}
                  {item.isRead ? (
                    <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                      <FaCheck className="text-green-500" /> Read
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                      <span className="w-2 h-2 bg-red-500 rounded-full inline-block" /> Unread
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-theme-light-textSecondary dark:text-theme-dark-textSecondary">{item.message}</p>
                <p className="mt-2 text-xs text-theme-light-textDisabled dark:text-theme-dark-textDisabled">{timeAgo(item.createdAt)}</p>
              </div>

              {/* Show button only if unread */}
              {!item.isRead && (
                <button
                  onClick={() => markAsRead(item._id)}
                  disabled={markingId === item._id}
                  className="theme-btn-primary shrink-0 px-3 py-1.5 text-sm"
                >
                  {markingId === item._id ? "..." : "Mark Read"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { FaBell, FaCheckDouble, FaInbox } from "react-icons/fa";

// const BASE_URL = "http://192.168.1.17:3000";

// export default function AdminNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [markingId, setMarkingId] = useState(null);

//   const token = localStorage.getItem("token");

//   const authHeaders = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   // ─── Fetch unread notifications ───────────────────────────────────────────
//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/v1/admin/notifications?isRead=false`, {
//         method: "GET",
//         headers: authHeaders,
//       });
//       const data = await res.json();
//       setNotifications(data?.data || []);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   // ─── Mark single notification as read ────────────────────────────────────
//   // PATCH /api/v1/admin/notifications/:id/read
//   const markAsRead = async (id) => {
//     setMarkingId(id);
//     try {
//       const res = await fetch(`${BASE_URL}/api/v1/admin/notifications/${id}/read`, {
//         method: "PATCH",
//         headers: authHeaders,
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         console.error("Mark read failed:", err?.message);
//         return;
//       }

//       // ✅ Remove from list after successful API call
//       setNotifications((prev) => prev.filter((n) => n._id !== id));
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//     } finally {
//       setMarkingId(null);
//     }
//   };

//   // ─── Mark ALL as read ─────────────────────────────────────────────────────
//   const markAllAsRead = async () => {
//     try {
//       await Promise.all(
//         notifications.map((n) =>
//           fetch(`${BASE_URL}/api/v1/admin/notifications/${n._id}/read`, {
//             method: "PATCH",
//             headers: authHeaders,
//           })
//         )
//       );
//       setNotifications([]);
//     } catch (error) {
//       console.error("Failed to mark all as read:", error);
//     }
//   };

//   // ─── Time helper ──────────────────────────────────────────────────────────
//   const timeAgo = (date) => {
//     if (!date) return "Just now";
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return "Just now";
//     const intervals = [
//       { label: "hour", seconds: 3600 },
//       { label: "min", seconds: 60 },
//     ];
//     for (let i of intervals) {
//       const count = Math.floor(seconds / i.seconds);
//       if (count > 0) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <FaBell className="text-2xl text-purple-600" />
//           <h2 className="text-2xl font-bold text-gray-800">Unread Notifications</h2>
//           {notifications.length > 0 && (
//             <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full font-medium">
//               {notifications.length}
//             </span>
//           )}
//         </div>

//         {notifications.length > 0 && (
//           <button
//             onClick={markAllAsRead}
//             className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
//           >
//             <FaCheckDouble />
//             Mark all as read
//           </button>
//         )}
//       </div>

//       {/* Loading Skeleton */}
//       {loading && (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
//               <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
//               <div className="h-3 bg-gray-100 rounded w-2/3" />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && notifications.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
//           <FaInbox className="text-5xl text-gray-300" />
//           <p className="text-lg font-medium">You're all caught up!</p>
//           <p className="text-sm">No unread notifications</p>
//         </div>
//       )}

//       {/* Notification List */}
//       {!loading && (
//         <div className="space-y-3">
//           {notifications.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-4 flex justify-between items-start border-l-4 border-purple-500 gap-4"
//             >
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-800 text-base leading-snug">
//                   {item.title || "Notification"}
//                 </h3>
//                 <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.message}</p>
//                 <p className="text-xs text-gray-400 mt-2">{timeAgo(item.createdAt)}</p>
//               </div>

//               <button
//                 onClick={() => markAsRead(item._id)}
//                 disabled={markingId === item._id}
//                 className="shrink-0 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 {markingId === item._id ? "..." : "Mark Read"}
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//     </div>
//   );
// }
































// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Loader from "../../compoents/Loader";
// import LoderBtn from "../../compoents/LoderBtn";
// import { Modal } from "antd";
// import toast from "react-hot-toast";
// import xlsx from "json-as-xlsx";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { useAuth } from "../../auth/AuthContext";
// import { motion } from "framer-motion";
// import {
//   StyledTableCell,
//   StyledTableRow,
// } from "../../utils/tableStyleTemplates";
// import { deleteRanking } from "../../Services/Ranking";
// import PaginationManager from "../../compoents/PaginationManager";
// import StudentDropdown from "../Students/components/StudentDropdown";
// import getValFromSearchParams from "../../utils/getValFromSearchParams";
// import { FaSearch } from "react-icons/fa";
// import useSetStudent from "../../hooks/useSetStudent";
// import {
//   deleteNotification,
//   getAllNotifications,
// } from "../../Services/NotificationApi";

// const NotificationsListPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { page, rowsPerPage, studentId } = getValFromSearchParams({
//     searchParams,
//   });
//   const { auth, hasPermission, loading: authLoading } = useAuth();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({
//     user: null,
//   });
//   useSetStudent(studentId, (data) =>
//     setFilters((pre) => ({ ...pre, user: data }))
//   );

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const {
//         page: currentPage,
//         rowsPerPage: limit,
//         studentId,
//       } = getValFromSearchParams({ searchParams });
//       const result = await getAllNotifications({
//         page: currentPage,
//         rowsPerPage: limit,
//         user: studentId,
//       });
//       if (result?.status) {
//         toast.success("Notifications fetched successfully!");
//         const transformedData = (result.data || []).map((item) => ({
//           ...item,
//           id: item._id,
//         }));
//         setData(transformedData);
//         setTotalPages(result.totalPage || 0);
//         setTotalRecord(result.totalResult || 0);
//       } else {
//         toast.error(result?.message || "Failed to fetch Notifications.");
//       }
//     } catch (error) {
//       console.error("Error fetching Notifications:", error);
//       toast.error("Error fetching Notifications.");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (!authLoading.profile && auth.user) {
//       fetchData();
//     }
//   }, [fetchData, authLoading.profile, auth.user]);

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   const handleMenuOpen = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   const deleteHandler = (id) => {
//     Modal.confirm({
//       title: "Delete Notification",
//       content:
//         "Are you sure you want to delete this notification? This action cannot be undone.",
//       okText: loading ? "Deleting..." : "Delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       okButtonProps: { disabled: loading },
//       onOk: async () => {
//         try {
//           setLoading(true);
//           const result = await deleteNotification(id);
//           if (result?.status) {
//             toast.success("Notification deleted successfully!");
//             fetchData();
//           } else {
//             toast.error(result?.message || "Failed to delete Notification.");
//           }
//         } catch (error) {
//           console.error("Error deleting Notification:", error);
//           toast.error("Error deleting Notification.");
//         } finally {
//           setLoading(false);
//         }
//       },
//     });
//     handleMenuClose();
//   };

//   const handleAddClick = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       navigate("Send_Notification");
//       setIsLoading(false);
//     }, 300);
//   };

//   const exportFunc = async (allLeadsData) => {
//     if (allLeadsData.length < 1) {
//       return toast.error("Notifications list is empty!");
//     }
//     setIsExporting(true);

//     const settings = {
//       fileName: "Notifications",
//       extraLength: 3,
//       writeMode: "writeFile",
//       writeOptions: {},
//       RTL: false,
//     };

//     const data = [
//       {
//         sheet: "Notifications List",
//         columns: [
//           { label: "ID", value: (row) => row?._id || "" },
//           {
//             label: "Title",
//             value: (row) => row?.title || "",
//           },
//           {
//             label: "Message",
//             value: (row) => row?.message ?? "",
//           },
//           {
//             label: "type",
//             value: (row) => row?.type ?? "",
//           },
//           {
//             label: "notificationType",
//             value: (row) => row?.notificationType ?? "",
//           },
//           { label: "isRead", value: (row) => row?.isRead || "" },
//           { label: "user", value: (row) => row?.user?.name || "" },
//           { label: "user mobile", value: (row) => row?.user?.mobile || "" },
//           { label: "user id", value: (row) => row?.user?._id || "" },
//           {
//             label: "Created Date",
//             value: (row) =>
//               row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
//           },
//         ],
//         content: allLeadsData,
//       },
//     ];

//     try {
//       xlsx(data, settings);
//       toast.success("Exported to Excel successfully!");
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       toast.error("Failed to export to Excel.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       user: null,
//     });
//     const sp = new URLSearchParams(searchParams);
//     sp.delete("student");
//     sp.set("page", "1");
//     setSearchParams(sp, { replace: true });
//   };

//   const handleOnSearch = () => {
//     const sp = new URLSearchParams(searchParams);
//     if (typeof filters.user === "object" && filters.user)
//       sp.set("student", filters.user?._id);
//     sp.set("page", "1");
//     setSearchParams(sp, { replace: true });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>
//       <div className="flex justify-between items-center mb-8 gap-2 gap-y-4 flex-wrap">
//         <div className="flex flex-wrap gap-4 items-end">
//           {/* User Filter via StudentDropdown */}
//           <div className="flex flex-col min-w-[220px]">
//             <label className="mb-1 text-sm font-medium text-gray-600">
//               Student
//             </label>
//             <StudentDropdown
//               selected={filters.user}
//               onSelect={(student) => handleFilterChange("user", student)}
//             />
//           </div>

//           <button
//             onClick={handleOnSearch}
//             className={`text-white cursor-pointer px-5 py-2.5 rounded-lg font-medium bg-[#181e2a]`}
//           >
//             <FaSearch size={18} />
//           </button>

//           {/* Clear Filters */}
//           <button
//             onClick={handleClearFilters}
//             className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
//           >
//             Clear Filters
//           </button>
//         </div>
//         <div className="flex gap-4">
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => exportFunc(data)}
//             className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition-colors"
//             aria-label="Export colleges to Excel"
//           >
//             {isExporting ? (
//               <span className="flex items-center gap-2">
//                 <LoderBtn />
//                 Export Excel
//               </span>
//             ) : (
//               "Export Excel"
//             )}
//           </motion.button>
//           {hasPermission("Notifications", "create") && (
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={handleAddClick}
//               data-aos="fade-left"
//               className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
//               aria-label="Add new Rating"
//             >
//               {isLoading ? (
//                 <span className="flex items-center gap-2">
//                   <LoderBtn />
//                   Add Notification
//                 </span>
//               ) : (
//                 "Add Notification"
//               )}
//             </motion.button>
//           )}
//         </div>
//       </div>

//       {loading ? (
//         <Loader />
//       ) : (
//         <TableContainer
//           component={Paper}
//           className="rounded-xl shadow-lg overflow-hidden"
//         >
//           <Table sx={{ minWidth: 700 }} aria-label="college table">
//             <TableHead>
//               <TableRow>
//                 <StyledTableCell>S.No</StyledTableCell>
//                 <StyledTableCell>Title</StyledTableCell>
//                 <StyledTableCell>User</StyledTableCell>
//                 <StyledTableCell>Message</StyledTableCell>
//                 <StyledTableCell>Notification_Type </StyledTableCell>
//                 <StyledTableCell>Read</StyledTableCell>
//                 <StyledTableCell align="center">Actions</StyledTableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.length === 0 ? (
//                 <StyledTableRow>
//                   <StyledTableCell
//                     colSpan={7}
//                     align="center"
//                     className="py-8 text-gray-500 text-lg"
//                   >
//                     No Notification found
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ) : (
//                 data.map((row, index) => (
//                   <StyledTableRow key={row.id}>
//                     <StyledTableCell>
//                       {(page - 1) * rowsPerPage + index + 1}
//                     </StyledTableCell>
//                     <StyledTableCell>{row.title ?? "N/A"}</StyledTableCell>
//                     <StyledTableCell>
//                       {typeof row.user === "object" && row.user ? (
//                         <div className="flex flex-col gap-y-1">
//                           <span>{row.user?.name || row.user?._id}</span>
//                           <span>{row.user?.email}</span>
//                         </div>
//                       ) : (
//                         row.user || "N/A"
//                       )}
//                     </StyledTableCell>
//                     <StyledTableCell>
//                       {row.message?.length > 30
//                         ? row.message.slice(0, 30)
//                         : row.message || "N/A"}
//                     </StyledTableCell>
//                     <StyledTableCell className="font-medium text-gray-800">
//                       {row.notificationType || "N/A"}
//                     </StyledTableCell>
//                     <StyledTableCell>
//                       {row.isRead ? "Yes" : "No"}
//                     </StyledTableCell>
//                     <StyledTableCell align="center">
//                       <IconButton
//                         onClick={(e) => handleMenuOpen(e, row.id)}
//                         className="text-gray-500 hover:text-gray-700"
//                         aria-label={`Actions for ${row._id}`}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl) && selectedRowId === row.id}
//                         onClose={handleMenuClose}
//                         PaperProps={{
//                           className: "shadow-lg rounded-lg",
//                         }}
//                       >
//                         {/* {hasPermission("Notifications", "read") && (
//                           <MenuItem
//                             onClick={() => {
//                               navigate(`view/${row.id}`);
//                               handleMenuClose();
//                             }}
//                             className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                           >
//                             <EyeIcon className="h-5 w-5 text-blue-600" />
//                             View
//                           </MenuItem>
//                         )} */}
//                         {hasPermission("Notifications", "update") && (
//                           <MenuItem
//                             onClick={() => {
//                               navigate(`update/${row.id}`);
//                               handleMenuClose();
//                             }}
//                             className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                           >
//                             <PencilIcon className="h-5 w-5 text-green-600" />
//                             Edit
//                           </MenuItem>
//                         )}
//                         {hasPermission("Notifications", "delete") && (
//                           <MenuItem
//                             onClick={() => {
//                               deleteHandler(row.id);
//                             }}
//                             className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                           >
//                             <TrashIcon className="h-5 w-5 text-red-600" />
//                             Delete
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       <PaginationManager
//         rowsPerPage={rowsPerPage}
//         page={page}
//         searchParams={searchParams}
//         setSearchParams={setSearchParams}
//         totalPages={totalPages}
//         totalRecord={totalRecord}
//       />
//     </div>
//   );
// };

// export default NotificationsListPage;

