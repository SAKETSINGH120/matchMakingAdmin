import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import { deleteMember, getAllMember } from "../../Services/MemberApi";
import { Button, Modal } from "antd";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import CommonTable from "../../compoents/CommonTable"; // Added import
import {
  StyledTableCell,
  StyledTableRow,
} from "../../utils/tableStyleTemplates";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MemberList() {
  const { auth, hasPermission, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllMember({ page, rowsPerPage, searchQuery });

      if (result?.status) {
        toast.success("Members fetched successfully!");
        const data = result.data;

        const transformedData = data.members.map((item) => ({
          ...item,
          id: item._id,
        }));

        setData(transformedData);
        setTotalPages(data.total || 0);
        setTotalRecord(data.total / data.limit || 0);
      } else {
        toast.error(result?.message || "Failed to fetch members.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading.profile && auth.user) {
      fetchData();
    }
  }, [page, rowsPerPage, searchQuery, authLoading.profile, auth.user]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
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

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete Member",
      content:
        "Are you sure you want to delete this member? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const result = await deleteMember(id);
          if (result?.status) {
            toast.success("Member deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete member.");
          }
        } catch (error) {
          console.error("Error deleting member:", error);
          toast.error("Error deleting member.");
        }
      },
    });
    handleMenuClose();
  };

  const handleAddClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("createmember");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = (allLeadsData) => {
    if (allLeadsData.length < 1) {
      return toast.error("Member list is empty!");
    }
    const settings = {
      fileName: "Member_List",
      extraLength: 3,
      writeMode: "writeFile",
    };
    const data = [
      {
        sheet: "Member List",
        columns: [
          { label: "User ID", value: (row) => row?._id || "N/A" },
          { label: "Email", value: (row) => row?.email || "N/A" },
          { label: "Role", value: (row) => row?.role?.name || "N/A" },
          { label: "City", value: (row) => row?.city?.name || "N/A" },
          {
            label: "Profile Image URL",
            value: (row) =>
              row?.profileImage
                ? `https://astrokashi.in/${row.profileImage}`
                : "N/A",
          },
          {
            label: "Created At",
            value: (row) =>
              row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A",
          },
        ],
        content: allLeadsData,
      },
    ];
    try {
      xlsx(data, settings);
      toast.success("Exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel.");
    }
  };

  if (authLoading.profile) return <Loader />;
  if (!auth.user) {
    navigate("/login");
    return null;
  }

  const handleOnSearch = () => {
    setSearchQuery(search);
    setPage(1);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") handleOnSearch();
  };

  if (loading) return <Loader />;

  // Columns for CommonTable - preserves exact original UI
  const columns = [
    {
      header: "S.No",
      render: (_, index, page, rowsPerPage) => (
        <span>{(page - 1) * rowsPerPage + index + 1}</span>
      ),
    },
    {
      header: "Role Name",
      render: (row) => <span>{row.name || "N/A"}</span>,
    },
    {
      header: "Email",
      render: (row) => <span>{row.email || "N/A"}</span>,
    },
    {
      header: "City",
      render: (row) => <span>{row.city?.name || "--"}</span>,
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center">
          <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRowId === row.id}
            onClose={handleMenuClose}
          >{hasPermission("member", "delete") && (
            <MenuItem
              onClick={() => {
                deleteHandler(row.id);
              }}
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-5 w-5 text-red-600" />
              Delete
            </MenuItem>)}

            <MenuItem
              onClick={() => {
               navigate(`update/${row.id}`);
              }}
              className="flex items-center gap-2"
            >
              <PencilIcon className="h-5 w-5 text-blue-600" />
              Edit
            </MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FB721D] text-gray-700 placeholder-gray-400"
            onKeyDown={handleOnKeyDown}
          />
          <button
            onClick={handleOnSearch}
            className="bg-[#FB721D] text-white px-5 py-2.5 rounded-lg font-medium cursor-pointer"
          >
            Search
          </button>
        </div>
        <div className="flex gap-4">
          {hasPermission("member", "exportExcel") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => exportFunc(data)}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg cursor-pointer"
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <LoderBtn />
                  Exporting...
                </span>
              ) : (
                "Export Excel"
              )}
            </motion.button>)}
          {hasPermission("member", "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              className="bg-[#FB721D] text-white px-5 py-2.5 cursor-pointer rounded-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn />
                  Add Member
                </span>
              ) : (
                "Add Member"
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Replaced manual table with CommonTable - UI unchanged */}
      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        emptyMessage="No members found"
      />

      {totalRecord > rowsPerPage && (
        <Stack spacing={2} alignItems="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </Stack>
      )}
    </div>
  );
}