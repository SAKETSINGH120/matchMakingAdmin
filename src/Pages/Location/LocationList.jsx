// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { motion } from "framer-motion";
// import Loader from "../../compoents/Loader";
// import LoderBtn from "../../compoents/LoderBtn";
// import { getAllLocation, deleteLocation } from "../../Services/LocationApi";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import toast from "react-hot-toast";
// import xlsx from "json-as-xlsx";
// import { useAuth } from "../../auth/AuthContext";
// import { Modal } from "antd";
// import CommonTable from "../../compoents/CommonTable"; // <-- Import the common table

// export default function LocationList() {
//   const { hasPermission } = useAuth();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const navigate = useNavigate();

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const result = await getAllLocation({ page, rowsPerPage, searchQuery });

//       const locations = result?.data || [];
//       const transformedData = locations.map((item) => ({
//         ...item,
//         id: item._id,
//       }));

//       setData(transformedData);
//       setTotalPages(result?.totalPage || 1);
//       setTotalRecord(result?.totalResult || 0);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//       toast.error(error.message || "Failed to fetch locations.");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, searchQuery]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleMenuOpen = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   const deleteHandler = (id, locationName) => {
//     Modal.confirm({
//       title: "Delete Location",
//       content: (
//         <span>
//           Are you sure you want to delete <strong>"{locationName}"</strong>? This action cannot be undone.
//         </span>
//       ),
//       okText: deleting ? "Deleting..." : "Delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       okButtonProps: { disabled: deleting },
//       onOk: async () => {
//         try {
//           setDeleting(true);
//           await deleteLocation(id);
//           toast.success("Location deleted successfully!");
//           fetchData();
//           handleMenuClose();
//         } catch (error) {
//           toast.error(error.message || "Failed to delete location.");
//         } finally {
//           setDeleting(false);
//         }
//       },
//       onCancel: () => {
//         handleMenuClose();
//       },
//     });
//   };

//   const handleAddClick = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       navigate("createLocation");
//       setIsLoading(false);
//     }, 300);
//   };

//   const exportFunc = () => {
//     if (data.length === 0) {
//       return toast.error("No locations to export!");
//     }
//     setIsExporting(true);

//     const settings = {
//       fileName: "Locations_List",
//       writeMode: "writeFile",
//     };

//     const exportData = [
//       {
//         sheet: "Locations",
//         columns: [
//           { label: "S.No", value: (_, index) => index + 1 },
//           { label: "Location Name", value: (row) => row.name || "" },
//           { label: "Created At", value: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "") },
//         ],
//         content: data,
//       },
//     ];

//     try {
//       xlsx(exportData, settings);
//       toast.success("Locations exported successfully!");
//     } catch (error) {
//       toast.error("Failed to export locations.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const handleOnSearch = () => {
//     setSearchQuery(search.trim());
//     setPage(1);
//   };

//   const handleOnKeyDown = (e) => {
//     if (e.key === "Enter") handleOnSearch();
//   };

//   // ===== Columns definition for CommonTable =====
//   const columns = [
//     {
//       header: "S.No",
//       render: (_, index) => (page - 1) * rowsPerPage + index + 1,
//     },
//     {
//       header: "Location Name",
//       render: (row) => <span className="font-medium">{row.name || "Unnamed Location"}</span>,
//     },
//     {
//       header: "Actions",
//       render: (row) => (
//         <>
//           <IconButton
//             onClick={(e) => handleMenuOpen(e, row.id)}
//             aria-label="Location actions"
//           >
//             <MoreVertIcon />
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl) && selectedRowId === row.id}
//             onClose={handleMenuClose}
//             PaperProps={{ className: "shadow-lg rounded-lg" }}
//           >
//             {hasPermission("location", "edit") && (
//               <MenuItem
//                 onClick={() => {
//                   navigate(`updateLocation/${row.id}`);
//                   handleMenuClose();
//                 }}
//                 className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//               >
//                 <PencilIcon className="h-5 w-5 text-green-600" />
//                 Edit
//               </MenuItem>
//             )}

//             {hasPermission("location", "delete") && (
//               <MenuItem
//                 onClick={() => {
//                   deleteHandler(row.id, row.name);
//                   handleMenuClose();
//                 }}
//                 className="flex items-center gap-2 text-red-700 hover:bg-red-50"
//               >
//                 <TrashIcon className="h-5 w-5 text-red-600" />
//                 Delete
//               </MenuItem>
//             )}
//           </Menu>
//         </>
//       ),
//     },
//   ];

//   if (loading) return <Loader />;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>

//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-4">
//           <input
//             type="text"
//             placeholder="Search locations by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={handleOnKeyDown}
//             className="w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleOnSearch}
//             className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium"
//           >
//             Search
//           </button>
//         </div>

//         <div className="flex gap-4">
//         {hasPermission("location", "exportExcel") && (
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={exportFunc}
//             className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
//           >
//             {isExporting ? (
//               <span className="flex items-center gap-2">
//                 <LoderBtn /> Exporting...
//               </span>
//             ) : (
//               "Export Excel"
//             )}
//           </motion.button>
//         )}
//           {hasPermission("location", "create") && (
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={handleAddClick}
//               className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium"
//             >
//               {isLoading ? (
//                 <span className="flex items-center gap-2">
//                   <LoderBtn /> Adding...
//                 </span>
//               ) : (
//                 "Add Location"
//               )}
//             </motion.button>
//           )}
//         </div>
//       </div>

//       {/* Replaced the old Table with CommonTable */}
//       <CommonTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         emptyMessage="No locations found"
//       />

//       {totalRecord > rowsPerPage && (
//         <Stack spacing={2} alignItems="center" mt={6}>
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={handlePageChange}
//             color="primary"
//             variant="outlined"
//             siblingCount={1}
//             boundaryCount={1}
//           />
//         </Stack>
//       )}
//     </div>
//   );
// }


// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { motion } from "framer-motion";
// import Loader from "../../compoents/Loader";
// import LoderBtn from "../../compoents/LoderBtn";
// import { getAllLocation, deleteLocation } from "../../Services/LocationApi";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import toast from "react-hot-toast";
// import xlsx from "json-as-xlsx";
// import { useAuth } from "../../auth/AuthContext";
// import { Modal } from "antd";
// import CommonTable from "../../compoents/CommonTable"; // <-- Import the common table

// export default function LocationList() {
//   const { hasPermission } = useAuth();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const navigate = useNavigate();

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const result = await getAllLocation({
//         page,
//         limit: rowsPerPage,          
//         searchQuery,
//       });

//       const locations = result?.data?.data || []; 
//       const transformedData = locations.map((item) => ({
//         ...item,
//         id: item._id,
//         // We keep city name accessible in two ways for flexibility
//         cityName: item.cityId?.name || "—",
//       }));

//       setData(transformedData);
//       setTotalPages(result?.data?.totalPage || result?.data?.totalPages || Math.ceil(result?.data?.total / rowsPerPage) || 1);
//       setTotalRecord(result?.data?.total || result?.totalResult || 0);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//       toast.error(error.message || "Failed to fetch locations.");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, searchQuery]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleMenuOpen = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   const deleteHandler = (id, locationName) => {
//     Modal.confirm({
//       title: "Delete Location",
//       content: (
//         <span>
//           Are you sure you want to delete <strong>"{locationName}"</strong>? This action cannot be undone.
//         </span>
//       ),
//       okText: deleting ? "Deleting..." : "Delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       okButtonProps: { disabled: deleting },
//       onOk: async () => {
//         try {
//           setDeleting(true);
//           await deleteLocation(id);
//           toast.success("Location deleted successfully!");
//           fetchData();
//           handleMenuClose();
//         } catch (error) {
//           toast.error(error.message || "Failed to delete location.");
//         } finally {
//           setDeleting(false);
//         }
//       },
//       onCancel: () => {
//         handleMenuClose();
//       },
//     });
//   };

//   const handleAddClick = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       navigate("createLocation");
//       setIsLoading(false);
//     }, 300);
//   };

//   const exportFunc = () => {
//     if (data.length === 0) {
//       return toast.error("No locations to export!");
//     }
//     setIsExporting(true);

//     const settings = {
//       fileName: "Locations_List",
//       writeMode: "writeFile",
//     };

//     const exportData = [
//       {
//         sheet: "Locations",
//         columns: [
//           { label: "S.No", value: (_, index) => index + 1 },
//           { label: "Location Name", value: (row) => row.name || "" },
//           { label: "City", value: (row) => row.cityName || "" },
//           { label: "Created At", value: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "") },
//         ],
//         content: data,
//       },
//     ];

//     try {
//       xlsx(exportData, settings);
//       toast.success("Locations exported successfully!");
//     } catch (error) {
//       toast.error("Failed to export locations.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const handleOnSearch = () => {
//     setSearchQuery(search.trim());
//     setPage(1);
//   };

//   const handleOnKeyDown = (e) => {
//     if (e.key === "Enter") handleOnSearch();
//   };

 
//   const columns = [
//     {
//       header: "S.No",
//       render: (_, index) => (page - 1) * rowsPerPage + index + 1,
//     },
//     {
//       header: "Location Name",
//       render: (row) => <span className="font-medium">{row.name || "Unnamed Location"}</span>,
//     },
//     {
//       header: "City",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.cityName || row.cityId?.name || "—"}
//         </span>
//       ),
//     },
//     {
//       header: "Actions",
//       render: (row) => (
//         <>
//           <IconButton
//             onClick={(e) => handleMenuOpen(e, row.id)}
//             aria-label="Location actions"
//           >
//             <MoreVertIcon />
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl) && selectedRowId === row.id}
//             onClose={handleMenuClose}
//             PaperProps={{ className: "shadow-lg rounded-lg" }}
//           >
//             {hasPermission("location", "edit") && (
//               <MenuItem
//                 onClick={() => {
//                   navigate(`updateLocation/${row.id}`);
//                   handleMenuClose();
//                 }}
//                 className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//               >
//                 <PencilIcon className="h-5 w-5 text-green-600" />
//                 Edit
//               </MenuItem>
//             )}

//             {hasPermission("location", "delete") && (
//               <MenuItem
//                 onClick={() => {
//                   deleteHandler(row.id, row.name);
//                   handleMenuClose();
//                 }}
//                 className="flex items-center gap-2 text-red-700 hover:bg-red-50"
//               >
//                 <TrashIcon className="h-5 w-5 text-red-600" />
//                 Delete
//               </MenuItem>
//             )}
//           </Menu>
//         </>
//       ),
//     },
//   ];

//   if (loading) return <Loader />;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>

//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-4">
//           <input
//             type="text"
//             placeholder="Search locations by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={handleOnKeyDown}
//             className="w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleOnSearch}
//             className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium"
//           >
//             Search
//           </button>
//         </div>

//         <div className="flex gap-4">
//           {hasPermission("location", "exportExcel") && (
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={exportFunc}
//               className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
//             >
//               {isExporting ? (
//                 <span className="flex items-center gap-2">
//                   <LoderBtn /> Exporting....
//                 </span>
//               ) : (
//                 "Export Excel"
//               )}
//             </motion.button>
//           )}
//           {hasPermission("location", "create") && (
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={handleAddClick}
//               className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium"
//             >
//               {isLoading ? (
//                 <span className="flex items-center gap-2">
//                   <LoderBtn /> Adding...
//                 </span>
//               ) : (
//                 "Add Location"
//               )}
//             </motion.button>
//           )}
//         </div>
//       </div>

//       {/* Replaced the old Table with CommonTable */}
//       <CommonTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         emptyMessage="No locations found"
//       />

//       {totalRecord > rowsPerPage && (
//         <Stack spacing={2} alignItems="center" mt={6}>
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={handlePageChange}
//             color="primary"
//             variant="outlined"
//             siblingCount={1}
//             boundaryCount={1}
//           />
//         </Stack>
//       )}
//     </div>
//   );
// }

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import { getAllLocation, deleteLocation } from "../../Services/LocationApi";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import { Modal } from "antd";
import CommonTable from "../../compoents/CommonTable";
import PaginationManager from "../../compoents/PaginationManager"; // ← added
import getValFromSearchParams from "../../utils/getValFromSearchParams"; // ← added (same as City)

export default function LocationList() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { page: pageStr, rowsPerPage: rowsPerPageStr, searchQueryFromUrl } =
    getValFromSearchParams({ searchParams });

  const page = Number(pageStr) || 1;
  const rowsPerPage = Number(rowsPerPageStr) || 10;

  const [search, setSearch] = useState(searchQueryFromUrl || "");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllLocation({
        page,
        limit: rowsPerPage,
        searchQuery: searchQueryFromUrl || "",
      });

      const locations = result?.data?.data || [];
      const transformedData = locations.map((item) => ({
        ...item,
        id: item._id,
        cityName: item.cityId?.name || "—",
      }));

      setData(transformedData);
      setTotalPages(
        result?.data?.totalPage ||
          result?.data?.totalPages ||
          Math.ceil(result?.data?.total / rowsPerPage) ||
          1
      );
      setTotalRecord(result?.data?.total || result?.totalResult || 0);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error(error.message || "Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQueryFromUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Debounced search → update URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== (searchQueryFromUrl || "")) {
        const sp = new URLSearchParams(searchParams);

        if (search.trim()) {
          sp.set("search", search.trim());
        } else {
          sp.delete("search");
        }

        sp.set("page", "1");
        setSearchParams(sp, { replace: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, searchParams, searchQueryFromUrl, setSearchParams]);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const deleteHandler = (id, locationName) => {
    Modal.confirm({
      title: "Delete Location",
      content: (
        <span>
          Are you sure you want to delete <strong>"{locationName}"</strong>? This action cannot be undone.
        </span>
      ),
      okText: deleting ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: deleting },
      onOk: async () => {
        try {
          setDeleting(true);
          await deleteLocation(id);
          toast.success("Location deleted successfully!");
          fetchData();
          handleMenuClose();
        } catch (error) {
          toast.error(error.message || "Failed to delete location.");
        } finally {
          setDeleting(false);
        }
      },
      onCancel: () => {
        handleMenuClose();
      },
    });
  };

  const handleAddClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("createLocation");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = () => {
    if (data.length === 0) {
      return toast.error("No locations to export!");
    }
    setIsExporting(true);

    const settings = {
      fileName: "Locations_List",
      writeMode: "writeFile",
    };

    const exportData = [
      {
        sheet: "Locations",
        columns: [
          { label: "S.No", value: (_, index) => index + 1 },
          { label: "Location Name", value: (row) => row.name || "" },
          { label: "City", value: (row) => row.cityName || "" },
          { label: "Created At", value: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "") },
        ],
        content: data,
      },
    ];

    try {
      xlsx(exportData, settings);
      toast.success("Locations exported successfully!");
    } catch (error) {
      toast.error("Failed to export locations.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      // Optional: force immediate search on Enter
      const sp = new URLSearchParams(searchParams);
      if (search.trim()) sp.set("search", search.trim());
      else sp.delete("search");
      sp.set("page", "1");
      setSearchParams(sp, { replace: true });
    }
  };

  const columns = [
    {
      header: "S.No",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      header: "Location Name",
      render: (row) => <span className="font-medium">{row.name || "Unnamed Location"}</span>,
    },
    {
      header: "City",
      render: (row) => (
        <span className="text-gray-700">
          {row.cityName || row.cityId?.name || "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <>
          <IconButton
            onClick={(e) => handleMenuOpen(e, row.id)}
            aria-label="Location actions"
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRowId === row.id}
            onClose={handleMenuClose}
            PaperProps={{ className: "shadow-lg rounded-lg" }}
          >
            {hasPermission("location", "edit") && (
              <MenuItem
                onClick={() => {
                  navigate(`updateLocation/${row.id}`);
                  handleMenuClose();
                }}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
              >
                <PencilIcon className="h-5 w-5 text-green-600" />
                Edit
              </MenuItem>
            )}

            {hasPermission("location", "delete") && (
              <MenuItem
                onClick={() => {
                  deleteHandler(row.id, row.name);
                  handleMenuClose();
                }}
                className="flex items-center gap-2 text-red-700 hover:bg-red-50"
              >
                <TrashIcon className="h-5 w-5 text-red-600" />
                Delete
              </MenuItem>
            )}
          </Menu>
        </>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search locations by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleOnKeyDown}
            className="w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* You can keep the button if you prefer instant search */}
          {/* <button onClick={handleOnSearch} ... >Search</button> */}
        </div>

        <div className="flex gap-4">
          {hasPermission("location", "exportExcel") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={exportFunc}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <LoderBtn /> Exporting...
                </span>
              ) : (
                "Export Excel"
              )}
            </motion.button>
          )}
          {hasPermission("location", "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn /> Adding...
                </span>
              ) : (
                "Add Location"
              )}
            </motion.button>
          )}
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        emptyMessage="No locations found"
      />

      <PaginationManager
        page={page}
        totalPages={totalPages}
        totalRecord={totalRecord}
        rowsPerPage={rowsPerPage}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
}