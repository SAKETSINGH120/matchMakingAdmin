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
import { getAllAgents } from "../../Services/AgentApi";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import { Modal } from "antd";
import GenericTable from "../../compoents/Table";
import AgentToggle from "../../compoents/agentToggle"; // Import the toggle

export default function AgentListPage() {
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
  const [deleting, setDeleting] = useState(false);
  // Menu state for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllAgents({
        page,
        rowsPerPage,
        searchQuery,
      });
      let agents = [];
      let totalPage = 1;
      let totalResult = 0;
      if (Array.isArray(result?.data)) {
        agents = result.data;
        totalPage = result?.totalPage || 1;
        totalResult = result?.totalResult || 0;
      } else if (result?.data?.agents) {
        agents = result.data.agents;
        totalPage = result.data.totalPage || 1;
        totalResult = result.data.totalResult || 0;
      } else {
        console.warn("Unexpected API structure:", result);
        toast.error("Invalid data received from server");
      }
      setData(agents);
      setTotalPages(totalPage);
      setTotalRecord(totalResult);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error(error?.response?.data?.message || "Failed to load agents");
      setData([]);
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

  const handleOnSearch = () => {
    setSearchQuery(search.trim());
    setPage(1);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") handleOnSearch();
  };

  const exportFunc = () => {
    if (data.length === 0) return toast.error("No agents to export!");
    setIsExporting(true);
    const settings = {
      fileName: "Agents_List",
      writeMode: "writeFile",
    };
    const exportData = [
      {
        sheet: "Agents",
        columns: [
          { label: "S.No", value: (_, index) => index + 1 },
          { label: "Name", value: "name" },
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
          { label: "City", value: "cityId.name" },
          { label: "Wallet Balance", value: "walletBalance" },
          { label: "Verified", value: (row) => (row.isVerified ? "Yes" : "No") },
          { label: "Status", value: "status" },
          {
            label: "Created At",
            value: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""),
          },
        ],
        content: data,
      },
    ];
    try {
      xlsx(exportData, settings);
      toast.success("Exported successfully!");
    } catch (err) {
      toast.error("Export failed");
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const deleteHandler = (id, name) => {
    Modal.confirm({
      title: "Delete Agent",
      content: `Are you sure you want to delete "${name || "this agent"}"?`,
      okText: deleting ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: deleting },
      onOk: async () => {
        try {
          setDeleting(true);
          // await deleteAgent(id); ← Add your delete API call here
          toast.success("Agent deleted successfully!");
          fetchData();
        } catch (err) {
          toast.error("Failed to delete agent");
        } finally {
          setDeleting(false);
          handleMenuClose();
        }
      },
      onCancel: handleMenuClose,
    });
  };

  // ────────────────────────────────────────────────
  // NEW: Handler for Agent Commission List
  // ────────────────────────────────────────────────
  const handleCommissionList = (row) => {
    navigate(`commissions/${row._id}`, {
      state: { agentName: row.name || row.email || "Agent" }
    });
  };

  const columns = [
    {
      label: "City",
      key: "cityId",
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row?.cityId?.name || "N/A"}</span>
        </div>
      )
    },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    {
      label: "Wallet Balance",
      key: "walletBalance",
      render: (value) => `₹ ${value ?? 0}`,
    },
    {
      label: "Verified",
      key: "isVerified",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      label: "Is Verified",
      render: (value, row) => (
        <AgentToggle
          agentId={row._id}
          initialIsVerified={row.isVerified}
          onSuccess={fetchData} // Refetch to sync all rows
        />
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${value === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker title="Agent Management" />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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
          {hasPermission("agent", "exportExcel") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={exportFunc}
              disabled={isExporting}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-70"
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
        </div>
      </div>

      <GenericTable
        data={data}
        columns={columns}
        isLoading={loading}
        page={page}
        limit={rowsPerPage}
        hasAction={true}
        hasView={true}
        hasEdit={false}
        hasDelete={hasPermission("agent", "delete")}
        // ────────────────────────────────────────────────
        // NEW: Added commission list option
        // ────────────────────────────────────────────────
        hasCommissionList={true}
        onCommissionList={handleCommissionList}
        // ────────────────────────────────────────────────
        onView={(row) => navigate(`view/${row._id}`)}
        onEdit={(row) => navigate(`update/${row._id}`)}
        onDelete={(row) => deleteHandler(row._id, row.name)}
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