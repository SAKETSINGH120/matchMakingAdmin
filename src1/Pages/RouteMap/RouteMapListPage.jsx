

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
//   deleteRouteMap,
//   getAllRouteMap,
// } from "../../Services/routeMapServices";

// import { useAuth } from "../../auth/AuthContext";

// const RouteMapListPage = () => {
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
//       const result = await getAllRouteMap({
//         page: currentPage,
//         rowsPerPage: limit,
//         searchQuery,
//       });
//       if (result?.status) {
//         toast.success("Route-Map fetched successfully!");
//         const resData = result.data;
//         const routeMaps = resData?.routeMaps ?? [];
//         const totalItems = resData.total ?? 0;           // fixed: use correct total
//         const perPage = Number(limit) || 10;             // ensure number

//         setData(routeMaps);
//         setTotalRecord(totalItems);                      // total documents
//         setTotalPages(Math.ceil(totalItems / perPage));  // correct number of pages
//       } else {
//         toast.error(result?.message || "Failed to fetch route-map");
//       }
//     } catch (error) {
//       console.error("Error fetching route-map", error);
//       toast.error("Error fetching route-map");
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

//   const excelFileColumns = React.useMemo(() => {
//     return [
//       { label: "ID", value: (row) => row?._id || "" },
//       { label: "Name", value: (row) => row?.name || "" },
//       {
//         label: "Created Date",
//         value: (row) =>
//           row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
//       },
//     ];
//   }, []);

//   const tableColumn = React.useMemo(() => {
//     return [
//       { label: "Name", key: "name" },
//       { label: "FullPrice", key: "fullPrice" },
//       { label: "TotalDistance", key: "totalDistance" },
//       { label: "ConvienienceFee", key: "convienienceFee" },
//       {
//         label: "Status",
//         key: "isActive",
//         render: (data) => {
//           return (
//             <span
//               className={`${
//                 data
//                   ? "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
//                   : "px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
//               }`}
//             >
//               {data ? "Active" : "Inactive"}
//             </span>
//           );
//         },
//       },
//     ];
//   }, []);

//   const handleAddClick = () => {
//     navigate("create");
//   };

//   const handleOnUpdate = (rowId) => {
//     navigate(`update/${rowId}`);
//   };

//   const handleOnView = (rowId) => {
//     navigate(`view/${rowId}`);
//   };

//   const deleteHandler = (id) => {
//     Modal.confirm({
//       title: "Delete Route-Map",
//       content:
//         "Are you sure you want to delete this route-Map? This action cannot be undone.",
//       okText: "Delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       onOk: async () => {
//         try {
//           setLoading(true);
//           const result = await deleteRouteMap(id);
//           if (result?.status) {
//             toast.success("Route-Map deleted successfully!");
//             fetchData();
//           } else {
//             toast.error(result?.message || "Failed to delete route-map");
//           }
//         } catch (error) {
//           console.error("Error deleting route-map", error);
//           toast.error("Error deleting route-map");
//         } finally {
//           setLoading(false);
//         }
//       },
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex gap-4">
//         {hasPermission("routeMap", "exportExcel") && (
//           <ExportButton
//             ariaLabel="Role Export Button"
//             dataToExport={data}
//             columns={excelFileColumns}
//           />
//         )}
//         {hasPermission("routeMap", "create") && (
//           <AddButton btnName="Add RouteMap" onClick={handleAddClick} />
//         )}
//         </div>
//       </div>

//       <GenericTable
//         data={data}
//         columns={tableColumn}
//         hasAction={true}
//         hasEdit={hasPermission("routeMap", "edit")}
//         hasDelete={true}
//         hasView={hasPermission("routeMap", "view")}
//         isLoading={loading}
//         ariaLabel="Roles table"
//         limit={rowsPerPage}
//         page={page}
//         onEdit={(row) => {
//           handleOnUpdate(row._id);
//         }}
//         onDelete={(row) => {
//           deleteHandler(row._id);
//         }}
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

// export default RouteMapListPage;

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
import xlsx from "json-as-xlsx";
import { Modal } from "antd";
import { motion } from "framer-motion";
import {
  deleteRouteMap,
  getAllRouteMap,
} from "../../Services/routeMapServices";

import { useAuth } from "../../auth/AuthContext";

const RouteMapListPage = () => {
  const { hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [search, setSearch] = useState(searchQueryFromUrl);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
      } = getValFromSearchParams({ searchParams });
      const result = await getAllRouteMap({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Route-Map fetched successfully!");
        const resData = result.data;
        const routeMaps = resData?.routeMaps ?? [];
        const totalItems = resData.total ?? 0;           // fixed: use correct total
        const perPage = Number(limit) || 10;             // ensure number

        setData(routeMaps);
        setTotalRecord(totalItems);                      // total documents
        setTotalPages(Math.ceil(totalItems / perPage));  // correct number of pages
      } else {
        toast.error(result?.message || "Failed to fetch route-map");
      }
    } catch (error) {
      console.error("Error fetching route-map", error);
      toast.error("Error fetching route-map");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // const excelFileColumns = React.useMemo(() => {
  //   return [
  //     { label: "ID", value: (row) => row?._id || "" },
  //     { label: "Name", value: (row) => row?.name || "" },
  //     {
  //       label: "Created Date",
  //       value: (row) =>
  //         row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
  //     },
  //   ];
  // }, []);

  const exportToExcel = () => {
  if (!data || data.length === 0) {
    toast.error("No route maps to export!");
    return;
  }

  setIsExporting(true);

  const settings = {
    fileName: "RouteMaps_List",
    writeMode: "writeFile", // or "download" in some versions — test which works
  };

  const exportData = [
    {
      sheet: "Route Maps",
      columns: excelFileColumns,          
      content: data,
    },
  ];

  try {
    xlsx(exportData, settings);
    toast.success("Route maps exported successfully!");
  } catch (err) {
    console.error("Export failed:", err);
    toast.error("Failed to export route maps.");
  } finally {
    setIsExporting(false);
  }
};

  const excelFileColumns = React.useMemo(() => {
  return [
    { label: "ID", value: (row) => row?._id || "" },
    { label: "Name", value: (row) => row?.name || "" },
    {
      label: "City",
      value: (row) => row?.cityId?.name || "—",           
    },
    {
      label: "Full Price",
      value: (row) => row?.fullPrice ?? "",               
    },
    {
      label: "Total Distance",
      value: (row) => row?.totalDistance ?? "",           
    },
    {
      label: "Convenience Fee",
      value: (row) => row?.convienienceFee ?? "",         
    },
    {
      label: "Status",
      value: (row) => (row?.isActive ? "Active" : "Inactive"),
    },
    // {
    //   label: "Created Date",
    //   value: (row) =>
    //     row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
    // },
  ];
}, []);
  const tableColumn = React.useMemo(() => {
    return [
      { label: "Name", key: "name" },
      { label: "FullPrice", key: "fullPrice" },
      {
        label: "City",
        render: (_, row) => row?.cityId?.name || "—",   
      },
      { label: "TotalDistance", key: "totalDistance" },
      { label: "ConvienienceFee", key: "convienienceFee" },
      {
        label: "Status",
        key: "isActive",
        render: (data) => {
          return (
            <span
              className={`${
                data
                  ? "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  : "px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              }`}
            >
              {data ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ];
  }, []);

  const handleAddClick = () => {
    navigate("create");
  };

  const handleOnUpdate = (rowId) => {
    navigate(`update/${rowId}`);
  };

  const handleOnView = (rowId) => {
    navigate(`view/${rowId}`);
  };

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete Route-Map",
      content:
        "Are you sure you want to delete this route-Map? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const result = await deleteRouteMap(id);
          if (result?.status) {
            toast.success("Route-Map deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete route-map");
          }
        } catch (error) {
          console.error("Error deleting route-map", error);
          toast.error("Error deleting route-map");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
        {hasPermission("routeMap", "exportExcel") && (
         <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={exportToExcel}
        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <LoderBtn />
            Exporting...
          </>
        ) : (
          "Export Excel"
        )}
      </motion.button>
        )}
        {hasPermission("routeMap", "create") && (
          <AddButton btnName="Add RouteMap" onClick={handleAddClick} />
        )}
        </div>
      </div>

      <GenericTable
        data={data}
        columns={tableColumn}
        hasAction={true}
        hasEdit={hasPermission("routeMap", "edit")}
        hasDelete={true}
        hasView={hasPermission("routeMap", "view")}
        isLoading={loading}
        ariaLabel="Roles table"
        limit={rowsPerPage}
        page={page}
        onEdit={(row) => {
          handleOnUpdate(row._id);
        }}
        onDelete={(row) => {
          deleteHandler(row._id);
        }}
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

export default RouteMapListPage;