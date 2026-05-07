// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import toast from "react-hot-toast";
// import ExportButton from "../../compoents/ExportButton";
// import getValFromSearchParams from "../../utils/getValFromSearchParams";
// import AddButton from "../../compoents/AddButton";
// import PaginationManager from "../../compoents/PaginationManager";
// import GenericTable from "../../compoents/Table";
// import { Modal } from "antd";
// import {
//   deletePackage,
//   getAllPackages,
// } from "../../Services/PackageApi"; // Adjust path as needed
// import "/src/index.css"
// import { useAuth } from "../../auth/AuthContext";

// const PackageListPage = () => {
//   const { hasPermission } = useAuth();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
//     searchParams,
//   });
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [search, setSearch] = useState(searchQueryFromUrl);
//   const navigate = useNavigate();

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const {
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQueryFromUrl: searchQuery,
//       } = getValFromSearchParams({ searchParams });

//       const result = await getAllPackages({
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQuery,
//       });

//       if (result?.status) {
//         toast.success("Packages fetched successfully!");
//         const resData = result.data;
//         setData(resData?.packages ?? []);
//         setTotalPages(resData.totalPages || Math.ceil(resData.total / limit) || 0);
//         setTotalRecord(resData.total || 0);
//       } else {
//         toast.error(result?.message || "Failed to fetch packages");
//       }
//     } catch (error) {
//       console.error("Error fetching packages", error);
//       toast.error("Error fetching packages");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   // Columns for Excel export
//   const excelFileColumns = React.useMemo(() => {
//     return [
//       { label: "ID", value: (row) => row?._id || "" },
//       { label: "Name", value: (row) => row?.name || "" },
//       { label: "Total Distance (km)", value: (row) => row?.totalDistance || "" },
//       { label: "Convenience Fee", value: (row) => row?.convienienceFee || "" },

//       { label: "Status", value: (row) => (row?.status === "active" ? "Active" : "Inactive") },
//       {
//         label: "Created Date",
//         value: (row) =>
//           row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
//       },
//     ];
//   }, []);

//   // Table columns to display
//   const tableColumn = React.useMemo(() => {
//     return [
//       { label: "Name", key: "name" },
//       {
//         label: "City",
//         render: (_, row) => row?.cityId?.name || "—",   
//       },
//       { label: "Total Distance (km)", key: "totalDistance" },

//       { label: "Max Members", key: "maxMember" },
//       {
//         label: "Status",
//         key: "status",
//         render: (status) => (
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${status === "active"
//               ? "bg-green-100 text-green-800"
//               : "bg-gray-100 text-gray-800"
//               }`}
//           >
//             {status === "active" ? "Active" : "Inactive"}
//           </span>
//         ),
//       },
//     ];
//   }, []);

//   const handleAddClick = () => {
//     navigate("createpackage");
//   };

//   const handleOnUpdate = (rowId) => {
//     navigate(`update/${rowId}`);
//   };

//   const handleOnView = (rowId) => {
//     navigate(`view/${rowId}`);
//   };

//   const deleteHandler = (id) => {
//     Modal.confirm({
//       title: "Delete Package",
//       content:
//         "Are you sure you want to delete this package? This action cannot be undone.",
//       okText: "Delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       onOk: async () => {
//         try {
//           setLoading(true);
//           const result = await deletePackage(id);
//           if (result?.status) {
//             toast.success("Package deleted successfully!");
//             fetchData();
//           } else {
//             toast.error(result?.message || "Failed to delete package");
//           }
//         } catch (error) {
//           console.error("Error deleting package", error);
//           toast.error("Error deleting package");
//         } finally {
//           setLoading(false);
//         }
//       },
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen scroll-y-always">
//       <div className="mb-6">
//         <Breaker />
//       </div>

//       <div className="flex justify-between items-center mb-8">
//         <div className="flex gap-4">
//         {hasPermission("package", "exportExcel") && (
//           <ExportButton
//             ariaLabel="Package Export Button"
//             dataToExport={data}
//             className="cursor-pointer"
//             columns={excelFileColumns}
//           />
//         )}

//           {hasPermission("package", "create") && (
//           <AddButton btnName="Add Package" className="cursor-pointer" onClick={handleAddClick} />
//           )}
//         </div>
//       </div>

//       <GenericTable
//         data={data}
//         columns={tableColumn}
//         hasAction={true}
//         hasEdit={hasPermission("package", "edit")}
//         hasDelete={hasPermission("package", "delete")}
//         hasView={hasPermission("package", "view")}
//         isLoading={loading}
//         ariaLabel="Packages table"
//         limit={rowsPerPage}
//         page={page}
//         onEdit={(row) => handleOnUpdate(row._id)}
//         onDelete={(row) => deleteHandler(row._id)}
//         onView={(row) => handleOnView(row._id)}
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
// };

// export default PackageListPage;

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import ExportButton from "../../compoents/ExportButton";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import AddButton from "../../compoents/AddButton";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import { Modal } from "antd";
import {
  deletePackage,
  getAllPackages,
} from "../../Services/PackageApi";
import "/src/index.css";
import { useAuth } from "../../auth/AuthContext";

const PackageListPage = () => {
  const { hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  // ─── Search states (added from AgentListPage style) ───────────────────────
  const [search, setSearch] = useState(searchQueryFromUrl || "");
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl || "");

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllPackages({
        page,
        rowsPerPage,
        searchQuery,          
      });

      if (result?.status) {
      
        const resData = result.data;
        setData(resData?.packages ?? []);
        setTotalPages(resData.totalPages || Math.ceil(resData.total / rowsPerPage) || 0);
        setTotalRecord(resData.total || 0);
      } else {
        toast.error(result?.message || "Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages", error);
      toast.error("Error fetching packages");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);   

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

 
  const handleOnSearch = () => {
    setSearchQuery(search.trim());
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (search.trim()) {
        newParams.set("search", search.trim());
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOnSearch();
    }
  };

  // Columns for Excel export (unchanged)
  const excelFileColumns = React.useMemo(() => {
    return [
      { label: "ID", value: (row) => row?._id || "" },
      { label: "Name", value: (row) => row?.name || "" },
      { label: "Total Distance (km)", value: (row) => row?.totalDistance || "" },
      { label: "Convenience Fee", value: (row) => row?.convienienceFee || "" },
      { label: "Status", value: (row) => (row?.status === "active" ? "Active" : "Inactive") },
      {
        label: "Created Date",
        value: (row) =>
          row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
      },
    ];
  }, []);

  // Table columns (unchanged)
  const tableColumn = React.useMemo(() => {
    return [
      { label: "Name", key: "name" },
      {
        label: "City",
        render: (_, row) => row?.cityId?.name || "—",
      },
      { label: "Total Distance (km)", key: "totalDistance" },
      { label: "Max Members", key: "maxMember" },
      {
        label: "Status",
        key: "status",
        render: (status) => (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status === "active" ? "Active" : "Inactive"}
          </span>
        ),
      },
    ];
  }, []);

  const handleAddClick = () => {
    navigate("createpackage");
  };

  const handleOnUpdate = (rowId) => {
    navigate(`update/${rowId}`);
  };

  const handleOnView = (rowId) => {
    navigate(`view/${rowId}`);
  };

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete Package",
      content:
        "Are you sure you want to delete this package? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const result = await deletePackage(id);
          if (result?.status) {
            toast.success("Package deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete package");
          }
        } catch (error) {
          console.error("Error deleting package", error);
          toast.error("Error deleting package");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen scroll-y-always">
      <div className="mb-6">
        <Breaker />
      </div>

     
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleOnKeyDown}
            className="w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleOnSearch}
            className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>

        <div className="flex gap-4">
          {hasPermission("package", "exportExcel") && (
            <ExportButton
              ariaLabel="Package Export Button"
              dataToExport={data}
              className="cursor-pointer"
              columns={excelFileColumns}
            />
          )}

          {hasPermission("package", "create") && (
            <AddButton
              btnName="Add Package"
              className="cursor-pointer"
              onClick={handleAddClick}
            />
          )}
        </div>
      </div>

      <GenericTable
        data={data}
        columns={tableColumn}
        hasAction={true}
        hasEdit={hasPermission("package", "edit")}
        hasDelete={hasPermission("package", "delete")}
        hasView={hasPermission("package", "view")}
        isLoading={loading}
        ariaLabel="Packages table"
        limit={rowsPerPage}
        page={page}
        onEdit={(row) => handleOnUpdate(row._id)}
        onDelete={(row) => deleteHandler(row._id)}
        onView={(row) => handleOnView(row._id)}
      />

      <PaginationManager
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        page={page}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default PackageListPage;