import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import { Modal } from "antd";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAuth } from "../../auth/AuthContext";
import { motion } from "framer-motion";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../utils/tableStyleTemplates";
import { deleteRanking } from "../../Services/Ranking";
import PaginationManager from "../../compoents/PaginationManager";
import StudentDropdown from "../Students/components/StudentDropdown";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import { FaSearch } from "react-icons/fa";
import useSetStudent from "../../hooks/useSetStudent";
import {
  deleteNotification,
  getAllNotifications,
} from "../../Services/NotificationApi";

const NotificationsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage, studentId } = getValFromSearchParams({
    searchParams,
  });
  const { auth, hasPermission, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    user: null,
  });
  useSetStudent(studentId, (data) =>
    setFilters((pre) => ({ ...pre, user: data }))
  );

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        page: currentPage,
        rowsPerPage: limit,
        studentId,
      } = getValFromSearchParams({ searchParams });
      const result = await getAllNotifications({
        page: currentPage,
        rowsPerPage: limit,
        user: studentId,
      });
      if (result?.status) {
        toast.success("Notifications fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(result?.message || "Failed to fetch Notifications.");
      }
    } catch (error) {
      console.error("Error fetching Notifications:", error);
      toast.error("Error fetching Notifications.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading.profile && auth.user) {
      fetchData();
    }
  }, [fetchData, authLoading.profile, auth.user]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

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
      title: "Delete Notification",
      content:
        "Are you sure you want to delete this notification? This action cannot be undone.",
      okText: loading ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: loading },
      onOk: async () => {
        try {
          setLoading(true);
          const result = await deleteNotification(id);
          if (result?.status) {
            toast.success("Notification deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete Notification.");
          }
        } catch (error) {
          console.error("Error deleting Notification:", error);
          toast.error("Error deleting Notification.");
        } finally {
          setLoading(false);
        }
      },
    });
    handleMenuClose();
  };

  const handleAddClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("Send_Notification");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = async (allLeadsData) => {
    if (allLeadsData.length < 1) {
      return toast.error("Notifications list is empty!");
    }
    setIsExporting(true);

    const settings = {
      fileName: "Notifications",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };

    const data = [
      {
        sheet: "Notifications List",
        columns: [
          { label: "ID", value: (row) => row?._id || "" },
          {
            label: "Title",
            value: (row) => row?.title || "",
          },
          {
            label: "Message",
            value: (row) => row?.message ?? "",
          },
          {
            label: "type",
            value: (row) => row?.type ?? "",
          },
          {
            label: "notificationType",
            value: (row) => row?.notificationType ?? "",
          },
          { label: "isRead", value: (row) => row?.isRead || "" },
          { label: "user", value: (row) => row?.user?.name || "" },
          { label: "user mobile", value: (row) => row?.user?.mobile || "" },
          { label: "user id", value: (row) => row?.user?._id || "" },
          {
            label: "Created Date",
            value: (row) =>
              row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      user: null,
    });
    const sp = new URLSearchParams(searchParams);
    sp.delete("student");
    sp.set("page", "1");
    setSearchParams(sp, { replace: true });
  };

  const handleOnSearch = () => {
    const sp = new URLSearchParams(searchParams);
    if (typeof filters.user === "object" && filters.user)
      sp.set("student", filters.user?._id);
    sp.set("page", "1");
    setSearchParams(sp, { replace: true });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8 gap-2 gap-y-4 flex-wrap">
        <div className="flex flex-wrap gap-4 items-end">
          {/* User Filter via StudentDropdown */}
          <div className="flex flex-col min-w-[220px]">
            <label className="mb-1 text-sm font-medium text-gray-600">
              Student
            </label>
            <StudentDropdown
              selected={filters.user}
              onSelect={(student) => handleFilterChange("user", student)}
            />
          </div>

          <button
            onClick={handleOnSearch}
            className={`text-white cursor-pointer px-5 py-2.5 rounded-lg font-medium bg-[#181e2a]`}
          >
            <FaSearch size={18} />
          </button>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Clear Filters
          </button>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => exportFunc(data)}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition-colors"
            aria-label="Export colleges to Excel"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <LoderBtn />
                Export Excel
              </span>
            ) : (
              "Export Excel"
            )}
          </motion.button>
          {hasPermission("Notifications", "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              data-aos="fade-left"
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
              aria-label="Add new Rating"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn />
                  Add Notification
                </span>
              ) : (
                "Add Notification"
              )}
            </motion.button>
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <TableContainer
          component={Paper}
          className="rounded-xl shadow-lg overflow-hidden"
        >
          <Table sx={{ minWidth: 700 }} aria-label="college table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>User</StyledTableCell>
                <StyledTableCell>Message</StyledTableCell>
                <StyledTableCell>Notification_Type </StyledTableCell>
                <StyledTableCell>Read</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={7}
                    align="center"
                    className="py-8 text-gray-500 text-lg"
                  >
                    No Notification found
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{row.title ?? "N/A"}</StyledTableCell>
                    <StyledTableCell>
                      {typeof row.user === "object" && row.user ? (
                        <div className="flex flex-col gap-y-1">
                          <span>{row.user?.name || row.user?._id}</span>
                          <span>{row.user?.email}</span>
                        </div>
                      ) : (
                        row.user || "N/A"
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.message?.length > 30
                        ? row.message.slice(0, 30)
                        : row.message || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell className="font-medium text-gray-800">
                      {row.notificationType || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.isRead ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, row.id)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={`Actions for ${row._id}`}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedRowId === row.id}
                        onClose={handleMenuClose}
                        PaperProps={{
                          className: "shadow-lg rounded-lg",
                        }}
                      >
                        {/* {hasPermission("Notifications", "read") && (
                          <MenuItem
                            onClick={() => {
                              navigate(`view/${row.id}`);
                              handleMenuClose();
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                          >
                            <EyeIcon className="h-5 w-5 text-blue-600" />
                            View
                          </MenuItem>
                        )} */}
                        {hasPermission("Notifications", "update") && (
                          <MenuItem
                            onClick={() => {
                              navigate(`update/${row.id}`);
                              handleMenuClose();
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="h-5 w-5 text-green-600" />
                            Edit
                          </MenuItem>
                        )}
                        {hasPermission("Notifications", "delete") && (
                          <MenuItem
                            onClick={() => {
                              deleteHandler(row.id);
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                          >
                            <TrashIcon className="h-5 w-5 text-red-600" />
                            Delete
                          </MenuItem>
                        )}
                      </Menu>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <PaginationManager
        rowsPerPage={rowsPerPage}
        page={page}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        totalPages={totalPages}
        totalRecord={totalRecord}
      />
    </div>
  );
};

export default NotificationsListPage;
