// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { getAllUsers, updateUserStatus } from "../../Services/userServices";
// import toast from "react-hot-toast";
// import ExportButton from "../../compoents/ExportButton";
// import getValFromSearchParams from "../../utils/getValFromSearchParams";
// import AddButton from "../../compoents/AddButton";
// import PaginationManager from "../../compoents/PaginationManager";
// import GenericTable from "../../compoents/Table";

// export default function UserList() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const { page, rowsPerPage } = getValFromSearchParams({ searchParams });

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);

//   const navigate = useNavigate();

//   const statusFilter = searchParams.get("status") || "active";

//   const capitalizeWords = (text) => {
//   if (!text) return "—";
//   return text
//     .toLowerCase()
//     .split(" ")
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

//   useEffect(() => {
//     const currentPage = searchParams.get("page");
//     const currentLimit = searchParams.get("rowsPerPage");

//     if (!currentPage || !currentLimit) {
//       const newParams = new URLSearchParams(searchParams);

//       if (!currentPage) newParams.set("page", "1");
//       if (!currentLimit) newParams.set("rowsPerPage", "10");

//       setSearchParams(newParams);
//     }
//   }, []);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const {
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQueryFromUrl: searchQuery,
//       } = getValFromSearchParams({ searchParams });

//       const result = await getAllUsers({
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQuery,
//         status: statusFilter || undefined,
//       });

//       if (result?.success) {
//         const transformedData = (result.data || []).map((item, index) => ({
//           id: item._id,
//           name: capitalizeWords(item.name),
//           number: item.number || "—",
//           gender: item.gender || "—",
//           isPremium: item.isPremium ? "Yes" : "No",
//           isVerified: item.isVerified ? "Yes" : "No",
//           activityScore: item.activityScore ?? 0,
//           status: item.status,
//           serialNo: index + 1 + (currentPage - 1) * limit,
//         }));

//         setData(transformedData);
//         setTotalPages(result.meta?.totalPages || 1);
//         setTotalRecord(result.meta?.total || result.data?.length || 0);
//       } else {
//         toast.error(result?.message || "Failed to fetch users.");
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Error fetching users.");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchParams, statusFilter]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   const excelFileColumns = React.useMemo(() => {
//     return [
//       { label: "S.No", value: (row) => row?.serialNo || "" },
//       { label: "Name", value: (row) => row?.name || "" },
//       { label: "Number", value: (row) => row?.number || "" },
//       { label: "Gender", value: (row) => row?.gender || "" },
//       { label: "Premium", value: (row) => row?.isPremium || "" },
//       { label: "Verified", value: (row) => row?.isVerified || "" },
//       { label: "Activity Score", value: (row) => row?.activityScore || "" },
//       { label: "Status", value: (row) => row?.status || "" },
//     ];
//   }, []);

//   // const tableColumns = React.useMemo(() => {
//   //   return [
//   //     { label: "Name", key: "name" },
//   //     { label: "Number", key: "number" },
//   //     { label: "Gender", key: "gender" },
//   //     { label: "Premium", key: "isPremium" },
//   //     { label: "Verified", key: "isVerified" },
//   //     { label: "Activity Score", key: "activityScore" },
//   //     { label: "Status", key: "status" },
//   //   ];
//   // }, []);

//   const handleStatusUpdate = async (row) => {
//     try {
//       const action = row.status === "active" ? "block" : "unblock";

//       const result = await updateUserStatus(row.id, action);

//       if (result?.success) {
//         toast.success("Status updated successfully");

//         // setData((prevData) =>
//         //   prevData.map((item) =>
//         //     item.id === row.id
//         //       ? {
//         //           ...item,
//         //           status: row.status === "active" ? "blocked" : "active",
//         //         }
//         //       : item
//         //   )
//         // );

//         //
//         fetchData();

//       } else {
//         toast.error(result?.message || "Failed to update");
//       }
//     } catch (error) {
//       toast.error("Error updating status");
//     }
//   };

//   const tableColumns = React.useMemo(() => {
//     return [
//       { label: "Name", key: "name" },
//       { label: "Number", key: "number" },
//       { label: "Gender", key: "gender" },
//       { label: "Premium", key: "isPremium" },
//       { label: "Verified", key: "isVerified" },
//       { label: "Activity Score", key: "activityScore" },

//       {
//         label: "Status",
//         key: "status",
//         render: (value, row) => (
//           <div className="flex items-center gap-3">

//             {/* Status Text */}
//             <span
//               className={`font-medium ${value === "active"
//                   ? "text-green-600"
//                   : "text-red-600"
//                 }`}
//             >
//               {value}
//             </span>

//             {/* Action Button */}
//             <button
//               onClick={() => handleStatusUpdate(row)}
//               className={`px-3 py-1 w-45px rounded text-white text-sm ${value === "active"
//                   ? "bg-red-500 hover:bg-red-600"
//                   : "bg-green-500 hover:bg-green-600"
//                 }`}
//             >
//               {value === "active" ? "Block" : "Unblock"}
//             </button>
//           </div>
//         ),
//       },
//     ];
//   }, [handleStatusUpdate]);

//   const handleAddClick = () => {
//     navigate("/users/create");
//   };

//   const handleView = (rowId) => {
//     console.log(rowId);
//     navigate(`view/${rowId}`);
//   };

//   const handleStatusChange = (e) => {
//     const newStatus = e.target.value;

//     setSearchParams((prev) => {
//       const next = new URLSearchParams(prev);
//       if (newStatus) {
//         next.set("status", newStatus);
//       } else {
//         next.delete("status");
//       }
//       next.set("page", "1");
//       return next;
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>

//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Users List</h1>

//         {/* <div className="flex gap-4">
//           <ExportButton
//             ariaLabel="Export Users"
//             dataToExport={data}
//             columns={excelFileColumns}
//             filename="users_list"
//           />

//           <AddButton btnName="Add User" onClick={handleAddClick} />
//         </div> */}
//       </div>

//       <div className="mb-6 flex items-center gap-4">
//         <label htmlFor="status-filter" className="font-medium text-gray-700">
//           Filter by Status:
//         </label>
//         <select
//           id="status-filter"
//           value={statusFilter}
//           onChange={handleStatusChange}
//           className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="active">Active</option>
//           <option value="blocked">Blocked</option>
//         </select>
//       </div>

//       <GenericTable
//         data={data}
//         columns={tableColumns}
//         hasAction={true}
//         hasEdit={false}
//         hasDelete={false}
//         hasView={true}
//         isLoading={loading}
//         ariaLabel="Users table"
//         limit={rowsPerPage}
//         page={page}
//         onView={(row) => handleView(row.id)}
//       />

//       <PaginationManager
//         rowsPerPage={rowsPerPage}
//         totalPages={totalPages}
//         totalRecord={totalRecord}
//         page={page}
//         setSearchParams={setSearchParams}
//         searchParams={searchParams}
//       />
//     </div>
//   );
// }

// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { getAllUsers, updateUserStatus } from "../../Services/userServices";
// import toast from "react-hot-toast";
// import ExportButton from "../../compoents/ExportButton";
// import getValFromSearchParams from "../../utils/getValFromSearchParams";
// import AddButton from "../../compoents/AddButton";
// import PaginationManager from "../../compoents/PaginationManager";
// import GenericTable from "../../compoents/Table";

// export default function UserList() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const { page, rowsPerPage } = getValFromSearchParams({ searchParams });

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [searchInput, setSearchInput] = useState(
//     searchParams.get("searchQuery") || ""
//   );

//   const navigate = useNavigate();

//   const statusFilter = searchParams.get("status") || "active";

//   const capitalizeWords = (text) => {
//     if (!text) return "—";
//     return text
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     const currentPage = searchParams.get("page");
//     const currentLimit = searchParams.get("rowsPerPage");

//     if (!currentPage || !currentLimit) {
//       const newParams = new URLSearchParams(searchParams);

//       if (!currentPage) newParams.set("page", "1");
//       if (!currentLimit) newParams.set("rowsPerPage", "10");

//       setSearchParams(newParams);
//     }
//   }, []);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const {
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQueryFromUrl: searchQuery,
//       } = getValFromSearchParams({ searchParams });

//       // If searchQuery is present, ignore status filter
//       const searchAll = !!searchQuery;
//       const result = await getAllUsers({
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQuery,
//         status: searchAll ? undefined : statusFilter || undefined,
//       });

//       if (result?.success) {
//         const transformedData = (result.data || []).map((item, index) => ({
//           id: item._id,
//           name: capitalizeWords(item.name),
//           number: item.number || "—",
//           gender: item.gender || "—",
//           isPremium: item.isPremium ? "Yes" : "No",
//           isVerified: item.isVerified ? "Yes" : "No",
//           activityScore: item.activityScore ?? 0,
//           status: item.status,
//           serialNo: index + 1 + (currentPage - 1) * limit,
//         }));

//         setData(transformedData);
//         setTotalPages(result.meta?.totalPages || 1);
//         setTotalRecord(result.meta?.total || result.data?.length || 0);
//       } else {
//         toast.error(result?.message || "Failed to fetch users.");
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Error fetching users.");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchParams, statusFilter]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   const excelFileColumns = React.useMemo(() => {
//     return [
//       { label: "S.No", value: (row) => row?.serialNo || "" },
//       { label: "Name", value: (row) => row?.name || "" },
//       { label: "Number", value: (row) => row?.number || "" },
//       { label: "Gender", value: (row) => row?.gender || "" },
//       { label: "Premium", value: (row) => row?.isPremium || "" },
//       { label: "Verified", value: (row) => row?.isVerified || "" },
//       { label: "Activity Score", value: (row) => row?.activityScore || "" },
//       { label: "Status", value: (row) => row?.status || "" },
//     ];
//   }, []);

//   const handleStatusUpdate = async (row) => {
//     try {
//       const action = row.status === "active" ? "block" : "unblock";

//       const result = await updateUserStatus(row.id, action);

//       if (result?.success) {
//         toast.success("Status updated successfully");
//         fetchData();
//       } else {
//         toast.error(result?.message || "Failed to update");
//       }
//     } catch (error) {
//       toast.error("Error updating status");
//     }
//   };

//   const tableColumns = React.useMemo(() => {
//     return [
//       { label: "Name", key: "name" },
//       { label: "Number", key: "number" },
//       { label: "Gender", key: "gender" },
//       { label: "Premium", key: "isPremium" },
//       { label: "Verified", key: "isVerified" },
//       { label: "Activity Score", key: "activityScore" },
//       {
//         label: "Status",
//         key: "status",
//         render: (value, row) => (
//           <div className="flex items-center gap-3">
//             <span
//               className={`font-medium ${value === "active" ? "text-green-600" : "text-red-600"
//                 }`}
//             >
//               {value}
//             </span>
//             <button
//               onClick={() => handleStatusUpdate(row)}
//               className={`px-3 py-1 w-45px rounded text-white text-sm ${value === "active"
//                 ? "bg-red-500 hover:bg-red-600"
//                 : "bg-green-500 hover:bg-green-600"
//                 }`}
//             >
//               {value === "active" ? "Block" : "Unblock"}
//             </button>
//           </div>
//         ),
//       },
//     ];
//   }, [handleStatusUpdate]);

//   const handleAddClick = () => {
//     navigate("/users/create");
//   };

//   const handleView = (rowId) => {
//     navigate(`view/${rowId}`);
//   };

//   const handleStatusChange = (e) => {
//     const newStatus = e.target.value;
//     setSearchParams((prev) => {
//       const next = new URLSearchParams(prev);
//       if (newStatus) {
//         next.set("status", newStatus);
//       } else {
//         next.delete("status");
//       }
//       next.set("page", "1");
//       return next;
//     });
//   };

//   // Debounced search handler
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchParams((prev) => {
//         const next = new URLSearchParams(prev);
//         if (searchInput.trim()) {
//           next.set("searchQuery", searchInput.trim());
//         } else {
//           next.delete("searchQuery");
//         }
//         next.set("page", "1");
//         return next;
//       });
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchParams((prev) => {
//       const next = new URLSearchParams(prev);
//       next.delete("searchQuery");
//       next.set("page", "1");
//       return next;
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>

//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
//       </div>

//       <div className="mb-6 flex flex-wrap items-center gap-4">
//         {/* Status Filter */}
//         <label htmlFor="status-filter" className="font-medium text-gray-700">
//           Filter by Status:
//         </label>
//         <select
//           id="status-filter"
//           value={statusFilter}
//           onChange={handleStatusChange}
//           className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="active">Active</option>
//           <option value="blocked">Blocked</option>
//         </select>

//         {/* Search by Name */}
//         <div className="flex items-center gap-2 ml-auto">
//           <div className="relative">
//             <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
//                 />
//               </svg>
//             </span>
//             <input
//               type="text"
//               id="search-name"
//               placeholder="Search by name..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//             />
//           </div>
//           {searchInput && (
//             <button
//               onClick={handleClearSearch}
//               className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition-colors"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {!loading && data.length === 0 && searchParams.get("searchQuery") ? (
//         <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-16 w-16 text-gray-300 mb-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.5}
//               d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
//             />
//           </svg>
//           <h3 className="text-lg font-semibold text-gray-700 mb-1">
//             User does not exist
//           </h3>
//           <p className="text-gray-400 text-sm">
//             No user with the name{" "}
//             <span className="font-medium text-gray-600">
//               "{searchParams.get("searchQuery")}"
//             </span>{" "}
//             exists in the system.
//           </p>
//           <button
//             onClick={handleClearSearch}
//             className="mt-5 px-4 py-2 bg-[#5F6F5C]hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
//           >
//             Clear Search
//           </button>
//         </div>
//       ) : (
//         <GenericTable
//           data={data}
//           columns={tableColumns}
//           hasAction={true}
//           hasEdit={false}
//           hasDelete={false}
//           hasView={true}
//           isLoading={loading}
//           ariaLabel="Users table"
//           limit={rowsPerPage}
//           page={page}
//           onView={(row) => handleView(row.id)}
//         />
//       )}

//       <PaginationManager
//         rowsPerPage={rowsPerPage}
//         totalPages={totalPages}
//         totalRecord={totalRecord}
//         page={page}
//         setSearchParams={setSearchParams}
//         searchParams={searchParams}
//       />
//     </div>
//   );
// }
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  getAllUsers,
  updateUserStatus,
  assignProfilesToUser,
  sendCredentialsMail,
  createUser,
} from "../../Services/userServices";
import toast from "react-hot-toast";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import ProfileAssignmentModal from "../../compoents/ProfileAssignmentModal";
import attachUrl from "../../utils/attachUrl";

export default function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, rowsPerPage, searchQueryFromUrl } = getValFromSearchParams({
    searchParams,
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("searchQuery") || "",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [sendingFor, setSendingFor] = useState(null);
  const [bulkSending, setBulkSending] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [createFormErrors, setCreateFormErrors] = useState({});
  const [statusReasonModal, setStatusReasonModal] = useState({
    open: false,
    userId: null,
    action: null,
    reason: "",
    loading: false,
  });

  const navigate = useNavigate();

  const statusFilter = searchParams.get("status") || "active";

  const statusTabs = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "blocked", label: "Blocked" },
  ];

  const capitalizeWords = (text) => {
    if (!text) return "—";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllUsers({
        page,
        rowsPerPage,
        searchQuery: searchQueryFromUrl,
        status: statusFilter,
      });

      if (result?.success) {
        const transformedData = (result.data || []).map((item, index) => ({
          id: item._id,
          name: capitalizeWords(item.name),
          primaryImage: item.primaryImage || "",
          number: item.number || "—",
          gender: item.gender || "—",
          isPremium: item.isPremium ? "Yes" : "No",
          isVerified: item.isVerified ? "Yes" : "No",
          activityScore: item.activityScore ?? 0,
          status: item.status,
          serialNo: index + 1 + (page - 1) * rowsPerPage,
        }));

        setData(transformedData);
        setSelectedUserIds((prev) =>
          prev.filter((id) => transformedData.some((row) => row.id === id)),
        );
        setTotalPages(result.meta?.totalPages || 1);
        setTotalRecord(result.meta?.total || result.data?.length || 0);
      } else {
        toast.error(result?.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQueryFromUrl, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleStatusUpdate = useCallback(
    async (row, action) => {
      try {
        // Determine the action if not provided
        const statusAction =
          action || (row.status === "active" ? "block" : "unblock");

        // For block and deactivate actions, require a reason
        if (
          statusAction === "block" ||
          statusAction === "deactivate" ||
          statusAction === "inactivate"
        ) {
          setStatusReasonModal({
            open: true,
            userId: row.id,
            action: statusAction,
            reason: "",
            loading: false,
          });
        } else {
          // For unblock, don't require a reason
          const result = await updateUserStatus(row.id, statusAction);
          if (result?.success) {
            toast.success("Status updated successfully");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to update");
          }
        }
      } catch (err) {
        console.error("Error updating status:", err);
        toast.error("Error updating status");
      }
    },
    [fetchData],
  );

  const handleConfirmStatusUpdate = useCallback(async () => {
    const { userId, action, reason } = statusReasonModal;

    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      setStatusReasonModal((prev) => ({ ...prev, loading: true }));
      const result = await updateUserStatus(userId, action, reason.trim());

      if (result?.success) {
        toast.success("Status updated successfully");
        fetchData();
        setStatusReasonModal({
          open: false,
          userId: null,
          action: null,
          reason: "",
          loading: false,
        });
      } else {
        toast.error(result?.message || "Failed to update");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error updating status");
    } finally {
      setStatusReasonModal((prev) => ({ ...prev, loading: false }));
    }
  }, [statusReasonModal, fetchData]);

  const handleCloseStatusReasonModal = () => {
    setStatusReasonModal({
      open: false,
      userId: null,
      action: null,
      reason: "",
      loading: false,
    });
  };

  const handleOpenProfileModal = useCallback((userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  }, []);

  const handleAssignProfiles = async (profileIds) => {
    try {
      setAssigning(true);
      const result = await assignProfilesToUser(selectedUserId, profileIds);
      if (result?.success) {
        toast.success("Profiles assigned successfully");
        setModalOpen(false);
        fetchData();
      } else {
        toast.error(result?.message || "Failed to assign profiles");
      }
    } catch (err) {
      console.error("Error assigning profiles:", err);
      toast.error("Error assigning profiles");
    } finally {
      setAssigning(false);
    }
  };

  const handleToggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = data.map((row) => row.id);

    setSelectedUserIds((prev) => {
      const allSelected =
        currentPageIds.length > 0 &&
        currentPageIds.every((id) => prev.includes(id));

      if (allSelected) {
        return prev.filter((id) => !currentPageIds.includes(id));
      }

      const merged = new Set([...prev, ...currentPageIds]);
      return Array.from(merged);
    });
  };

  const handleSendCredentials = useCallback(
    async ({ userId, userIds = [] }) => {
      const hasBulk = Array.isArray(userIds) && userIds.length > 0;

      try {
        if (hasBulk) {
          setBulkSending(true);
        } else {
          setSendingFor(userId);
        }

        const result = await sendCredentialsMail({ userId, userIds });

        if (result?.success) {
          toast.success(
            result?.message || "User credentials email sent successfully",
          );
          if (hasBulk) {
            setSelectedUserIds([]);
          }
        } else {
          toast.error(
            result?.message || "Failed to send user credentials email",
          );
        }
      } catch (err) {
        console.error("Error sending credentials:", err);
        toast.error(err.message || "Failed to send user credentials email");
      } finally {
        if (hasBulk) {
          setBulkSending(false);
        } else {
          setSendingFor(null);
        }
      }
    },
    [],
  );

  const handleCreateInputChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    setCreateFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetCreateForm = () => {
    setCreateForm({ name: "", email: "", number: "" });
    setCreateFormErrors({});
    setShowCreateForm(false);
  };

  const validateCreateForm = (payload) => {
    const errors = {};

    if (!payload.name) {
      errors.name = "Name is required";
    } else if (payload.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!payload.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(payload.email)) {
      errors.email = "Enter a valid email address";
    }

    const numberRegex = /^\d{10,15}$/;
    if (!payload.number) {
      errors.number = "Number is required";
    } else if (!numberRegex.test(payload.number)) {
      errors.number = "Number must be 10-15 digits";
    }

    return errors;
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    const payload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      number: createForm.number.trim(),
    };

    const errors = validateCreateForm(payload);
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      toast.error("Please fix form errors");
      return;
    }

    try {
      setCreatingUser(true);
      const result = await createUser(payload);
      toast.success(result?.message || "User created successfully");
      resetCreateForm();
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const tableColumns = React.useMemo(() => {
    return [
      {
        label: "Select",
        key: "select",
        render: (value, row) => (
          <input
            type="checkbox"
            checked={selectedUserIds.includes(row.id)}
            onChange={() => handleToggleUserSelection(row.id)}
            className="theme-checkbox"
          />
        ),
      },
      {
        label: "Profile",
        key: "primaryImage",
        render: (value, row) => (
          <img
            src={
              value && value.trim()
                ? attachUrl(value)
                : "/images/userDefaultLogo.jpg"
            }
            alt={row.name || "User"}
            className="h-10 w-10 rounded-full border border-theme-light-border object-cover dark:border-theme-dark-border"
          />
        ),
      },
      { label: "Name", key: "name" },
      { label: "Number", key: "number" },
      { label: "Gender", key: "gender" },
      { label: "Premium", key: "isPremium" },
      { label: "Verified", key: "isVerified" },
      { label: "Activity Score", key: "activityScore" },
      {
        label: "Status",
        key: "status",
        render: (value, row) => (
          <div className="flex flex-col gap-2">
            <span
              className={`font-medium ${
                value === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {value}
            </span>
            <div className="flex items-center gap-2">
              {value === "active" ? (
                <>
                  <button
                    onClick={() => handleStatusUpdate(row, "block")}
                    className="px-3 py-1 rounded text-white text-sm bg-theme-light-danger hover:brightness-95 dark:bg-theme-dark-danger"
                    title="Block this user"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(row, "deactivate")}
                    className="px-3 py-1 rounded text-white text-sm bg-orange-600 hover:bg-orange-700"
                    title="Deactivate this user"
                  >
                    Deactivate
                  </button>
                </>
              ) : value === "inactive" ? (
                <button
                  onClick={() => handleStatusUpdate(row, "activate")}
                  className="px-3 py-1 rounded text-white text-sm bg-green-500 hover:bg-green-600"
                  title="Activate this user"
                >
                  Activate
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate(row, "unblock")}
                  className="px-3 py-1 rounded text-white text-sm bg-theme-light-primaryButton hover:bg-theme-light-primaryHover dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryHover"
                  title="Unblock this user"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        ),
      },
      {
        label: "Actions",
        key: "actions",
        render: (value, row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleSendCredentials({ userId: row.id, userIds: [] })
              }
              disabled={sendingFor === row.id}
              title="Send user credentials email"
              className="theme-btn-warning px-3 py-1 text-xs"
            >
              {sendingFor === row.id ? "Sending..." : "Send Credentials"}
            </button>
            <button
              onClick={() => handleOpenProfileModal(row.id)}
              title="Assign profiles to this user"
              className="theme-btn-primary px-3 py-1 text-xs"
            >
              Assign Profiles
            </button>
          </div>
        ),
      },
    ];
  }, [
    handleStatusUpdate,
    selectedUserIds,
    sendingFor,
    handleSendCredentials,
    handleOpenProfileModal,
  ]);

  const handleStatusChange = (status) => {
    setSearchParams((prev) => {
      const currentStatus = prev.get("status") || "active";

      // Only reset to page 1 if status is actually changing
      if (currentStatus === status) {
        return prev; // No change needed
      }

      const next = new URLSearchParams(prev);
      next.set("status", status);
      next.set("page", "1"); // Reset to page 1 only when status changes
      return next;
    });
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const normalizedSearch = searchInput.trim();
        const prevSearch = prev.get("searchQuery") || "";

        // Only update if search query actually changed
        if (prevSearch === normalizedSearch) {
          return prev; // No change needed
        }

        const next = new URLSearchParams(prev);
        if (normalizedSearch) {
          next.set("searchQuery", normalizedSearch);
          next.set("page", "1"); // Reset to page 1 only when search query changes
        } else {
          next.delete("searchQuery");
          // Don't reset page when clearing search - preserve current page
        }
        return next;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("searchQuery");
      next.set("page", "1");
      return next;
    });
  };

  const handleView = (rowId) => {
    navigate(`view/${rowId}`);
  };

  return (
    <div className="theme-page p-6">
      <div className="mb-6">
        <Breaker />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
          Users List
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Status Tab Buttons */}
        <div className="theme-panel flex items-center gap-2 p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusChange(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === tab.key
                  ? "bg-theme-light-primaryButton text-white shadow-sm dark:bg-theme-dark-primaryButton"
                  : "text-theme-light-textSecondary hover:bg-theme-light-surfaceAlt dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-inputBg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search by Name */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="theme-btn-primary rounded-md px-3 py-2"
          >
            {showCreateForm ? "Close Form" : "Create New User"}
          </button>
          <button
            onClick={handleToggleSelectAll}
            className="theme-btn-secondary rounded-md px-3 py-2"
          >
            {data.length > 0 &&
            data.every((row) => selectedUserIds.includes(row.id))
              ? "Unselect Page"
              : "Select Page"}
          </button>
          <button
            onClick={() =>
              handleSendCredentials({ userId: null, userIds: selectedUserIds })
            }
            disabled={selectedUserIds.length === 0 || bulkSending}
            className="theme-btn-warning rounded-md px-3 py-2"
          >
            {bulkSending
              ? "Sending..."
              : `Send Credentials Selected (${selectedUserIds.length})`}
          </button>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-theme-light-textDisabled dark:text-theme-dark-textDisabled">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              id="search-name"
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="theme-input w-64 rounded-md pl-9 pr-4"
            />
          </div>
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="theme-btn-secondary rounded-md px-3 py-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={resetCreateForm}
          />

          <form
            onSubmit={handleCreateUser}
            className="theme-panel relative z-[111] w-full max-w-xl rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
                Create New User
              </h2>
              <button
                type="button"
                onClick={resetCreateForm}
                className="theme-btn-secondary rounded-md px-3 py-1"
              >
                X
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={createForm.name}
                  onChange={handleCreateInputChange}
                  className="theme-input"
                />
                {createFormErrors.name && (
                  <p className="mt-1 text-xs text-theme-light-danger dark:text-theme-dark-danger">
                    {createFormErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={createForm.email}
                  onChange={handleCreateInputChange}
                  className="theme-input"
                />
                {createFormErrors.email && (
                  <p className="mt-1 text-xs text-theme-light-danger dark:text-theme-dark-danger">
                    {createFormErrors.email}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="number"
                  placeholder="Number"
                  value={createForm.number}
                  onChange={handleCreateInputChange}
                  className="theme-input"
                />
                {createFormErrors.number && (
                  <p className="mt-1 text-xs text-theme-light-danger dark:text-theme-dark-danger">
                    {createFormErrors.number}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetCreateForm}
                className="theme-btn-secondary rounded-md px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingUser}
                className="theme-btn-primary rounded-md px-4 py-2"
              >
                {creatingUser ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && data.length === 0 && searchParams.get("searchQuery") ? (
        <div className="theme-panel flex flex-col items-center justify-center py-20 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4 h-16 w-16 text-theme-light-textDisabled dark:text-theme-dark-textDisabled"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <h3 className="mb-1 text-lg font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
            User does not exist
          </h3>
          <p className="text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            No user with the name{" "}
            <span className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
              "{searchParams.get("searchQuery")}"
            </span>{" "}
            exists in the system.
          </p>
          <button
            onClick={handleClearSearch}
            className="theme-btn-primary mt-5 rounded-md px-4 py-2 text-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <GenericTable
          data={data}
          columns={tableColumns}
          hasAction={true}
          hasEdit={false}
          hasDelete={false}
          hasView={true}
          isLoading={loading}
          ariaLabel="Users table"
          limit={rowsPerPage}
          page={page}
          onView={(row) => handleView(row.id)}
        />
      )}

      <PaginationManager
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        page={page}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />

      <ProfileAssignmentModal
        open={modalOpen}
        userId={selectedUserId}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAssignProfiles}
        loading={assigning}
      />

      {/* Status Reason Modal */}
      {statusReasonModal.open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={handleCloseStatusReasonModal}
          />

          <div className="theme-panel relative z-[111] w-full max-w-md rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
                {statusReasonModal.action === "deactivate"
                  ? "Deactivate User"
                  : "Block User"}
              </h2>
              <button
                onClick={handleCloseStatusReasonModal}
                className="theme-btn-secondary rounded-md px-3 py-1"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              Please provide a reason for{" "}
              {statusReasonModal.action === "deactivate"
                ? "deactivating"
                : "blocking"}{" "}
              this user:
            </p>

            <textarea
              value={statusReasonModal.reason}
              onChange={(e) =>
                setStatusReasonModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              placeholder="Enter reason..."
              className="theme-input mb-4 min-h-24 w-full"
              disabled={statusReasonModal.loading}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCloseStatusReasonModal}
                disabled={statusReasonModal.loading}
                className="theme-btn-secondary rounded-md px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                disabled={
                  statusReasonModal.loading || !statusReasonModal.reason.trim()
                }
                className="theme-btn-primary rounded-md px-4 py-2"
              >
                {statusReasonModal.loading
                  ? "Processing..."
                  : statusReasonModal.action === "deactivate"
                    ? "Deactivate"
                    : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
