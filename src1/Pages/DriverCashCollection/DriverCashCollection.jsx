
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import { Modal } from "antd";
import GenericTable from "../../compoents/Table";

import {
  getAllDriverCashCollection,
  updateDriverCashCollectionStatus,
} from "../../Services/DriverCashCollectionApi";

export default function DriverCashCollection() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  // Menu state - store full row object
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleApprove = async () => {
    if (!selectedRow) return;

    try {
      await updateDriverCashCollectionStatus(selectedRow._id || selectedRow.id, "paid");

      toast.success("Cash collection approved");
      fetchData();
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error("Failed to approve cash collection");
    } finally {
      handleMenuClose();
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllDriverCashCollection();

      let items = [];
      let totalPage = 1;
      let totalResult = 0;

      if (Array.isArray(result?.data)) {
        items = result.data;
        totalPage = result?.totalPage || Math.ceil(items.length / rowsPerPage) || 1;
        totalResult = result?.totalResult || items.length;
      } else if (result?.data?.requests) {
        items = result.data.requests;
        totalPage = result.data.totalPage || Math.ceil(result.data.totalResult / rowsPerPage) || 1;
        totalResult = result.data.totalResult || items.length;
      } else if (result?.data) {
        items = result.data;
        totalPage = result.totalPages || Math.ceil(items.length / rowsPerPage) || 1;
        totalResult = result.total || items.length;
      } else {
        console.warn("Unexpected API structure:", result);
        toast.error("Invalid data received from servers");
      }

      setData(items);
      setTotalPages(totalPage);
      setTotalRecord(totalResult);
    } catch (error) {
      console.error("Error fetching driver cash collection:", error);
      toast.error(error?.message || "Failed to load driver cash collection");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleOnSearch = () => {
    setSearchQuery(search.trim());
    setPage(1);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") handleOnSearch();
  };

  const columns = [
    {
      label: "City",
      key: "city",
      render: (_, row) => row?.cityId?.name || "N/A",
    },
    {
      label: "Driver Name",
      key: "driver.name",
      render: (_, row) => row?.driver?.name || "-",
    },
    {
      label: "Booking ID",
      key: "bookingId.bookingId",
      render: (_, row) => row?.bookingId?.bookingId || "-",
    },
    {
      label: "Total Amount",
      key: "totalAmount",
      render: (_, row) => `₹ ${row?.bookingId?.totalAmount ?? 0}`,
    },
    {
      label: "Commission",
      key: "comission",
      render: (_, row) => `₹ ${row?.comission ?? 0}`,
    },
    {
      label: "Transaction Type",
      key: "transactionType",
      render: (_, row) => (
        <span className="capitalize">{row?.transactionType || "-"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            value === "paid"
              ? "bg-blue-100 text-blue-800"
              : value === "approved"
              ? "bg-green-100 text-green-800"
              : value === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value || "Pending"}
        </span>
      ),
    },
    {
      label: "Action",
      key: "action",
      align: "center",
      render: (_, row) => (
        <div className="flex justify-center">
          <IconButton onClick={(e) => handleMenuOpen(e, row)} size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow?._id === row._id}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                mt: 1.5,
                "& .MuiMenuItem-root": {
                  px: 2.5,
                  py: 1,
                },
              },
            }}
          >
            <MenuItem
              onClick={handleApprove}
              disabled={row.status === "paid"}
              sx={{
                color: "#008000 !important",
                "&.Mui-disabled": {
                  color: "#008000 !important",
                  opacity: 0.75,
                },
                fontWeight: row.status === "paid" ? 500 : 600,
                "&:hover": {
                  backgroundColor: "rgba(27, 94, 32, 0.08)",
                },
                py: 1.2,
                px: 2.5,
              }}
            >
              {row.status === "paid" ? "Accepted" : "Accept"}
            </MenuItem>

            {/* Uncomment when you implement reject functionality */}
            {/* 
            <MenuItem
              onClick={handleReject}
              disabled={row.status === "rejected" || row.status === "approved" || row.status === "paid"}
              sx={{
                color: row.status === "rejected" || row.status === "approved" || row.status === "paid"
                  ? "grey.500"
                  : "#c62828",
                fontWeight: row.status === "rejected" || row.status === "approved" || row.status === "paid" ? 400 : 500,
                "&:hover": {
                  backgroundColor: "rgba(198, 40, 40, 0.08)",
                },
                py: 1.2,
                px: 2.5,
              }}
            >
              Reject
            </MenuItem> 
            */}
          </Menu>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker title="Driver Cash Collection" />
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by driver name or booking ID"
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
      </div>

      <GenericTable
        data={data}
        columns={columns}
        isLoading={loading}
        page={page}
        limit={rowsPerPage}
        hasAction={false}
        hasView={false}
        hasEdit={false}
        hasDelete={false}
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