// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { getMeetingDetail } from "../../Services/MeetingApi";
// import toast from "react-hot-toast";
// import getValFromSearchParams from "../../utils/getValFromSearchParams";
// import PaginationManager from "../../compoents/PaginationManager";
// import GenericTable from "../../compoents/Table";
// import { Tag, Avatar, Tooltip } from "antd";
// import {
//   UserOutlined,
//   CalendarOutlined,
//   EnvironmentOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";

// export default function MeetingList() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
//     searchParams,
//   });

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [searchInput, setSearchInput] = useState(searchParams.get("searchQuery") || "");

//   const navigate = useNavigate();

//   const capitalizeWords = (text) => {
//     if (!text) return "—";
//     return text
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   const getStatusColor = (status) => {
//     const lower = (status || "pending").toLowerCase();
//     if (lower.includes("approved") || lower === "confirmed") return "green";
//     if (lower.includes("rejected") || lower === "cancelled") return "red";
//     if (lower.includes("pending") || lower === "requested") return "orange";
//     if (lower.includes("completed") || lower === "done") return "blue";
//     return "default";
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const { page: currentPage, rowsPerPage: limit, searchQueryFromUrl: searchQuery } =
//         getValFromSearchParams({ searchParams });

//       const result = await getMeetingDetail({
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQuery,
//       });

//       if (result?.success) {
//         const transformed = (result.data || []).map((item, index) => {
//           const user1 = item.users?.[0] || {};
//           const user2 = item.users?.[1] || {};
//           const meeting = item.meeting || {};
//           const proposedBy = meeting.proposedBy || {};
//           const location = meeting.location || {};

//           return {
//             _id: item._id,
//             serialNo: index + 1 + (currentPage - 1) * limit,

//             user1_name: capitalizeWords(user1.name),
//             user1_number: user1.number || "—",
//             user1_gender: user1.gender || "—",

//             user2_name: capitalizeWords(user2.name),
//             user2_number: user2.number || "—",
//             user2_gender: user2.gender || "—",

//             proposedBy_name: capitalizeWords(proposedBy.name),
//             proposedBy_image: proposedBy.primaryImage || null,

//             meeting_location: location.address || "—",
//             meeting_dateTime: meeting.dateTime
//               ? new Date(meeting.dateTime).toLocaleString("en-IN", {
//                 dateStyle: "medium",
//                 timeStyle: "short",
//               })
//               : "—",
//             meeting_status: meeting.status || "Pending",
//           };
//         });

//         setData(transformed);
//         setTotalPages(result.meta?.totalPages || 0);
//         setTotalRecord(result.meta?.total || 0);
//       } else {
//         toast.error(result?.message || "Failed to load meetings.");
//       }
//     } catch (error) {
//       toast.error("Error fetching meetings.");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

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

//   useEffect(() => {
//     AOS.init({ duration: 800, once: true });
//   }, []);

//   const tableColumn = useMemo(
//     () => [
//       {
//         label: "User 1",
//         key: "user1",
//         render: (_, row) => (
//           <div className="flex items-center gap-3 py-1">
//             <Avatar
//               src={row.user1_photo}
//               icon={<UserOutlined />}
//               size={44}
//               className="border border-gray-200 shadow-sm"
//             />
//             <div className="flex flex-col">
//               <span className="font-medium text-gray-900">{row.user1_name}</span>
//               <span className="text-xs text-gray-500">{row.user1_number}</span>
//               <span className="text-xs text-gray-600 capitalize">{row.user1_gender}</span>
//             </div>
//           </div>
//         ),
//       },
//       {
//         label: "User 2",
//         key: "user2",
//         render: (_, row) => (
//           <div className="flex items-center gap-3 py-1">
//             <Avatar
//               src={row.user2_photo}
//               icon={<UserOutlined />}
//               size={44}
//               className="border border-gray-200 shadow-sm"
//             />
//             <div className="flex flex-col">
//               <span className="font-medium text-gray-900">{row.user2_name}</span>
//               <span className="text-xs text-gray-500">{row.user2_number}</span>
//               <span className="text-xs text-gray-600 capitalize">{row.user2_gender}</span>
//             </div>
//           </div>
//         ),
//       },
//       {
//         label: "Requested By",
//         key: "proposedBy_name",
//         render: (_, row) => (
//           <Tooltip title={row.proposedBy_name}>
//             <div className="flex items-center gap-2.5">
//               <Avatar
//                 src={row.proposedBy_image}
//                 icon={<UserOutlined />}
//                 size={36}
//                 className="border border-gray-200"
//               />
//               <span className="font-medium text-gray-800 truncate max-w-[140px]">
//                 {row.proposedBy_name}
//               </span>
//             </div>
//           </Tooltip>
//         ),
//       },
//       {
//         label: "Location",
//         key: "meeting_location",
//         render: (value) => (
//           <div className="flex items-center gap-2 text-gray-700">
//             <EnvironmentOutlined className="text-gray-500" />
//             <span className="truncate max-w-[220px]">{value || "—"}</span>
//           </div>
//         ),
//       },
//       {
//         label: "Date & Time",
//         key: "meeting_dateTime",
//         render: (value) => (
//           <div className="flex items-center gap-2 text-gray-700">
//             <CalendarOutlined className="text-gray-500" />
//             <span>{value || "—"}</span>
//           </div>
//         ),
//       },
//       {
//         label: "Status",
//         key: "meeting_status",
//         render: (status) => (
//           <Tag
//             color={getStatusColor(status)}
//             className="px-3 py-1 text-sm font-medium rounded-full capitalize"
//           >
//             {status}
//           </Tag>
//         ),
//       },
//     ],
//     []
//   );

//   const handleViewMeeting = (id) => {
//     navigate(`view/${id}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meeting Requests</h1>
//             <p className="text-gray-600 mt-1">Manage all scheduled and pending meetings</p>
//           </div>

//           <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
//             <div className="text-center">
//               <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
//               <p className="text-xl font-bold text-indigo-600">{totalRecord}</p>
//             </div>
//           </div>
//         </div>

//         {/* Search Filter */}
//         <div className="mb-6 flex items-center gap-4">
//           <label htmlFor="search-meeting" className="font-medium text-gray-700">
//             Search Meetings:
//           </label>
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
//               id="search-meeting"
//               placeholder="Search by name, location..."
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

//         <Breaker />

//         {/* Main Table Card */}
//         <div
//           className="bg-white rounded-2xl shadow border border-gray-100/80 overflow-hidden mt-8"
//           data-aos="fade-up"
//           data-aos-delay="100"
//         >
//           <GenericTable
//             data={data}
//             columns={tableColumn}
//             hasAction={true}
//             hasEdit={false}
//             hasDelete={false}
//             hasView={true}
//             isLoading={loading}
//             ariaLabel="Meeting requests table"
//             limit={rowsPerPage}
//             page={page}
//             onView={(row) => handleViewMeeting(row._id)}
//           />
//         </div>

//         {/* Pagination */}
//         <div className="mt-8 flex justify-center">
//           <PaginationManager
//             rowsPerPage={rowsPerPage}
//             totalPages={totalPages}
//             totalRecord={totalRecord}
//             page={page}
//             setSearchParams={setSearchParams}
//             searchParams={searchParams}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { getMeetingDetail } from "../../Services/MeetingApi";
import toast from "react-hot-toast";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import { Tag, Avatar, Tooltip } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export default function MeetingList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });

  const statusFilter = searchParams.get("status") || "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("searchQuery") || ""
  );

  const navigate = useNavigate();

  const capitalizeWords = (text) => {
    if (!text) return "—";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "approved") return "green";
    if (lower === "rejected") return "red";
    return "default";
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
      } = getValFromSearchParams({ searchParams });

      const result = await getMeetingDetail({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
      });

      if (result?.success) {
        let transformed = (result.data || []).map((item, index) => {
          const user1 = item.users?.[0] || {};
          const user2 = item.users?.[1] || {};
          const meeting = item.meeting || {};
          const proposedBy = meeting.proposedBy || {};
          const location = meeting.location || {};

          return {
            _id: item._id,
            serialNo: index + 1 + (currentPage - 1) * limit,

            user1_name: capitalizeWords(user1.name),
            user1_number: user1.number || "—",
            user1_gender: user1.gender || "—",

            user2_name: capitalizeWords(user2.name),
            user2_number: user2.number || "—",
            user2_gender: user2.gender || "—",

            proposedBy_name: capitalizeWords(proposedBy.name),
            proposedBy_image: proposedBy.primaryImage || null,

            meeting_location: location.address || "—",

            meeting_dateTime: meeting.dateTime
              ? new Date(meeting.dateTime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
              : "—",

            meeting_status: meeting.status || "Pending",
          };
        });

        // FRONTEND STATUS FILTER FIX
        if (statusFilter) {
          transformed = transformed.filter(
            (item) =>
              item.meeting_status?.toLowerCase() ===
              statusFilter.toLowerCase()
          );
        }

        setData(transformed);
        setTotalPages(result.meta?.totalPages || 0);
        setTotalRecord(result.meta?.total || 0);
      } else {
        toast.error(result?.message || "Failed to load meetings.");
      }
    } catch (error) {
      toast.error("Error fetching meetings.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // SEARCH FILTER
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (searchInput.trim()) {
          next.set("searchQuery", searchInput.trim());
        } else {
          next.delete("searchQuery");
        }

        next.set("page", "1");

        return next;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const tableColumn = useMemo(
    () => [
      {
        label: "USER 1",
        key: "user1",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Avatar icon={<UserOutlined />} size={40} />
            <div>
              <p className="font-medium">{row.user1_name}</p>
              <p className="text-xs text-gray-500">{row.user1_number}</p>
              <p className="text-xs text-gray-500">{row.user1_gender}</p>
            </div>
          </div>
        ),
      },
      {
        label: "USER 2",
        key: "user2",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Avatar icon={<UserOutlined />} size={40} />
            <div>
              <p className="font-medium">{row.user2_name}</p>
              <p className="text-xs text-gray-500">{row.user2_number}</p>
              <p className="text-xs text-gray-500">{row.user2_gender}</p>
            </div>
          </div>
        ),
      },
      {
        label: "REQUESTED BY",
        key: "proposedBy_name",
        render: (_, row) => (
          <Tooltip title={row.proposedBy_name}>
            <div className="flex items-center gap-2">
              <Avatar src={row.proposedBy_image} size={36} />
              <span>{row.proposedBy_name}</span>
            </div>
          </Tooltip>
        ),
      },
      {
        label: "LOCATION",
        key: "meeting_location",
        render: (value) => (
          <div className="flex items-center gap-2">
            <EnvironmentOutlined />
            {value}
          </div>
        ),
      },
      {
        label: "DATE & TIME",
        key: "meeting_dateTime",
        render: (value) => (
          <div className="flex items-center gap-2">
            <CalendarOutlined />
            {value}
          </div>
        ),
      },
      {
        label: "STATUS",
        key: "meeting_status",
        render: (status) => (
          <Tag color={getStatusColor(status)} className="capitalize">
            {status}
          </Tag>
        ),
      },
    ],
    []
  );

  const handleViewMeeting = (id) => {
    navigate(`view/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      <div className="max-w-8xl mx-auto px-6 pt-8">
        <Breaker />
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meeting Requests</h1>

          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <span className="text-gray-500 text-sm">Total</span>
            <p className="font-bold text-indigo-600">{totalRecord}</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="shadow-sm border border-gray-200 rounded-lg bg-white flex items-center gap-2 px-3 py-2"
          />

          {/* <select
            value={statusFilter}
            onChange={(e) => {
              const value = e.target.value;

              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                if (value) next.set("status", value);
                else next.delete("status");

                next.set("page", "1");

                return next;
              });
            }}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select> */}
          <div className="flex items-center gap-2">

            {["", "approved", "rejected"].map((status) => {

              const label =
                status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1);

              const isActive = statusFilter === status;

              return (
                <button
                  key={status || "all"}
                  onClick={() => {

                    setSearchParams((prev) => {

                      const next = new URLSearchParams(prev);

                      if (status) next.set("status", status);
                      else next.delete("status");

                      next.set("page", "1");

                      return next;

                    });

                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition
          ${isActive
                    ? "bg-[#3f4f3c]  text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {label}
                </button>
              );

            })}

          </div>

          {(searchInput || statusFilter) && (
            <button
              onClick={() => {
                setSearchInput("");

                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("searchQuery");
                  next.delete("status");
                  next.set("page", "1");
                  return next;
                });
              }}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Clear Filters
            </button>
          )}
        </div>

     

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow  mt-6">
          <GenericTable
            data={data}
            columns={tableColumn}
            hasAction
            hasView
            hasEdit={false}
            hasDelete={false}
            isLoading={loading}
            onView={(row) => handleViewMeeting(row._id)}
          />
        </div>

        {/* PAGINATION */}
        <div className="mt-6 flex justify-center">
          <PaginationManager
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            totalRecord={totalRecord}
            page={page}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}