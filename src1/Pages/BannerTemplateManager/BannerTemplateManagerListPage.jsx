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
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import {
  deleteBannerTemplate,
  getAllBannerTemplates,
} from "../../Services/BannerApi";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../utils/tableStyleTemplates";
import PaginationManager from "../../compoents/PaginationManager";
import attachUrl from "../../utils/attachUrl";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import { ClearBtn } from "../../compoents/Button";

const BannerTemplateManagerListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });
  const { auth, hasPermission, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [search, setSearch] = useState(searchQueryFromUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();
  const [isFilterApply, setIsFilterApply] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
      } = getValFromSearchParams({ searchParams });
      const result = await getAllBannerTemplates({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Banners fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
        if (searchQuery.trim() && !isFilterApply) setIsFilterApply(true);
        else if (!searchQuery.trim() && isFilterApply) setIsFilterApply(false);
      } else {
        toast.error(result?.message || "Failed to fetch banners.");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Error fetching banners.");
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
      title: "Delete Banner",
      content:
        "Are you sure you want to delete this banner? This action cannot be undone.",
      okText: loading ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: loading },
      onOk: async () => {
        try {
          setLoading(true);
          const result = await deleteBannerTemplate(id);
          if (result?.status) {
            toast.success("Banner deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete banner.");
          }
        } catch (error) {
          console.error("Error deleting banner:", error);
          toast.error("Error deleting banner.");
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
      navigate("create");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = async (allLeadsData) => {
    if (allLeadsData.length < 1) {
      return toast.error("Banner list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "_Banners",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const data = [
      {
        sheet: "Banner List",
        columns: [
          { label: "ID", value: (row) => row?._id || "" },
          { label: "Title", value: (row) => row?.title || "" },
          { label: "Image Path", value: (row) => row?.image || "" },
          { label: "Priority", value: (row) => row?.priority ?? "" },
          { label: "Platform", value: (row) => row?.platform || "" },
          {
            label: "Status",
            value: (row) => (row?.status ? "Active" : "Inactive"),
          },
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

  useEffect(() => {
    const handler = setTimeout(() => {
      const sp = new URLSearchParams(searchParams);

      if (search) {
        sp.set("search", search);
      } else {
        sp.delete("search");
      }

      sp.set("page", "1");

      setSearchParams(sp, { replace: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, searchParams, setSearchParams]);

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      const sp = new URLSearchParams(searchParams);
      if (search) sp.set("search", search);
      else sp.delete("search");
      sp.set("page", "1");
      setSearchParams(sp, { replace: true });
    }
  };

  const handleClearFilter = () => {
    setSearch("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search banners by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
            aria-label="Search banners by title"
            onKeyDown={handleOnKeyDown}
          />
          {isFilterApply && <ClearBtn handleClear={handleClearFilter} />}
        </div>
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => exportFunc(data)}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition-colors"
            aria-label="Export banners to Excel"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <LoderBtn />
                Exporting...
              </span>
            ) : (
              "Export Excel"
            )}
          </motion.button>
          {hasPermission("Banner Templates", "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              data-aos="fade-left"
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
              aria-label="Add new banner"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn />
                  Add Banner
                </span>
              ) : (
                "Add Banner"
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
          <Table sx={{ minWidth: 700 }} aria-label="banner table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={6}
                    align="center"
                    className="py-8 text-gray-500 text-lg"
                  >
                    No banners found
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Array.isArray(row.image) ? (
                        row.image.length > 0 ? (
                          <img
                            className="h-12 w-16 rounded-md object-cover border-2 border-gray-200 shadow-sm"
                            src={attachUrl(row.image[0])}
                            alt={row.title || "Banner image"}
                          />
                        ) : (
                          <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                            N/A
                          </div>
                        )
                      ) : row.image ? (
                        <img
                          className="h-12 w-16 rounded-md object-cover border-2 border-gray-200 shadow-sm"
                          src={attachUrl(row.image)}
                          alt={row.title || "Banner image"}
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                          N/A
                        </div>
                      )}
                    </StyledTableCell>
                    <StyledTableCell className="text-gray-600">
                      {row.title || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>{row.type}</StyledTableCell>
                    <StyledTableCell align="center">
                      {(hasPermission("Banner Templates", "read") ||
                        hasPermission("Banner Templates", "update") ||
                        hasPermission("Banner Templates", "delete")) && (
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, row.id)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label={`Actions for banner ${
                            row.title || row.id
                          }`}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedRowId === row.id}
                        onClose={handleMenuClose}
                        PaperProps={{
                          className: "shadow-lg rounded-lg",
                        }}
                      >
                        {hasPermission("Banner Templates", "read") && (
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
                        )}
                        {hasPermission("Banner Templates", "update") && (
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
                        {hasPermission("Banner Templates", "delete") && (
                          <MenuItem
                            onClick={() => deleteHandler(row.id)}
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
        page={page}
        totalPages={totalPages}
        totalRecord={totalRecord}
        rowsPerPage={rowsPerPage}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default BannerTemplateManagerListPage;
