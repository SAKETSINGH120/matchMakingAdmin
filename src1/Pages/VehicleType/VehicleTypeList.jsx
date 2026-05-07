import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import {
  getAllVehicleTypes,
  deleteVehicleType,
} from "../../Services/VehicleTypeApi"; // Update path if needed
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import { Modal } from "antd";
import CommonTable from "../../compoents/CommonTable";

export default function VehicleTypeList() {
  const { hasPermission } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllVehicleTypes({ page, rowsPerPage, searchQuery });

      const vehicleTypes = result?.data || [];
      const transformedData = vehicleTypes.map((item) => ({
        ...item,
        id: item._id,
      }));

      setData(transformedData);
      setTotalPages(result?.totalPage || 1);
      setTotalRecord(result?.totalResult || 0);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      toast.error(error.message || "Failed to fetch vehicle types.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const deleteHandler = (id, vehicleTypeName) => {
    Modal.confirm({
      title: "Delete Vehicle Type",
      content: (
        <span>
          Are you sure you want to delete <strong>"{vehicleTypeName}"</strong>? This action cannot be undone.
        </span>
      ),
      okText: deleting ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: deleting },
      onOk: async () => {
        try {
          setDeleting(true);
          await deleteVehicleType(id);
          toast.success("Vehicle type deleted successfully!");
          fetchData();
          handleMenuClose();
        } catch (error) {
          toast.error(error.message || "Failed to delete vehicle type.");
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
      navigate("createVehicleType");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = () => {
    if (data.length === 0) {
      return toast.error("No vehicle types to export!");
    }
    setIsExporting(true);

    const settings = {
      fileName: "VehicleTypes_List",
      writeMode: "writeFile",
    };

    const exportData = [
      {
        sheet: "Vehicle Types",
        columns: [
          { label: "S.No", value: (_, index) => index + 1 },
          { label: "City", value: (row) => row.cityId?.name || "N/A" },
          { label: "Vehicle Type Name", value: (row) => row.name || "" },
          { label: "Seating Capacity", value: (row) => row.seatingCapacity || "" },
          { label: "Created At", value: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "") },
        ],
        content: data,
      },
    ];

    try {
      xlsx(exportData, settings);
      toast.success("Vehicle types exported successfully!");
    } catch (error) {
      toast.error("Failed to export vehicle types.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOnSearch = () => {
    setSearchQuery(search.trim());
    setPage(1);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") handleOnSearch();
  };

  // ===== Columns definition for CommonTable =====
  const columns = [
    {
      header: "S.No",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      header: "City",
      render: (row) => <span className="font-medium text-gray-600">{row.cityId?.name || "N/A"}</span>,
    },
    {
      header: "Vehicle Type Name",
      render: (row) => <span className="font-medium">{row.name || "Unnamed Type"}</span>,
    },
    {
      header: "Seating Capacity",
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {row.seatingCapacity || "-"} Seats
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <>
          <IconButton
            onClick={(e) => handleMenuOpen(e, row.id)}
            aria-label="Vehicle type actions"
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRowId === row.id}
            onClose={handleMenuClose}
            PaperProps={{ className: "shadow-lg rounded-lg" }}
          >
            {/* {hasPermission("VehicleType", "view") && (
              <MenuItem
                onClick={() => {
                  navigate(`viewVehicleType/${row.id}`);
                  handleMenuClose();
                }}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
              >
                <EyeIcon className="h-5 w-5 text-blue-600" />
                View
              </MenuItem>
            )} */}

            {hasPermission("vehicleType", "edit") && (
              <MenuItem
                onClick={() => {
                  navigate(`updateVehicleType/${row.id}`);
                  handleMenuClose();
                }}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
              >
                <PencilIcon className="h-5 w-5 text-green-600" />
                Edit
              </MenuItem>
            )}

            {hasPermission("vehicleType", "delete") && (
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
            placeholder="Search vehicle types by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleOnKeyDown}
            className="w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <button
            onClick={handleOnSearch}
            className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer"
          >
            Search
          </button>
        </div>

        <div className="flex gap-4">
          {hasPermission("vehicleType", "exportExcel") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={exportFunc}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition cursor-pointer"
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

          {hasPermission("vehicleType", "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn /> Adding...
                </span>
              ) : (
                "Add Vehicle Type"
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* CommonTable for Vehicle Types */}
      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        emptyMessage="No vehicle types found"
      />

      {totalRecord > rowsPerPage && (
        <Stack spacing={2} alignItems="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      )}
    </div>
  );
}