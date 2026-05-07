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
import { PencilIcon } from "@heroicons/react/24/outline";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import { getAllHerosections } from "../../Services/HeroSectionApi";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../utils/tableStyleTemplates";
import attachUrl from "../../utils/attachUrl";
import PaginationManager from "../../compoents/PaginationManager";
import getValFromSearchParams from "../../utils/getValFromSearchParams";

export default function HeroSectionList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });
  const { auth, hasPermission, loading: authLoading } = useAuth(); // Access auth context
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { page: currentPage, rowsPerPage: limit } = getValFromSearchParams({
        searchParams,
      });
      const result = await getAllHerosections({
        page: currentPage,
        rowsPerPage: limit,
      });

      if (result?.status) {
        toast.success("Hero sections fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(result?.message || "Failed to fetch hero sections.");
      }
    } catch (error) {
      console.error("Error fetching hero sections:", error);
      toast.error("Error fetching hero sections.");
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

  const handleAddClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("create");
      setIsLoading(false);
    }, 300);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const exportFunc = async (allRows) => {
    if (allRows.length < 1) {
      return toast.error("Hero section list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "_HeroSections",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const excelData = [
      {
        sheet: "Hero Section List",
        columns: [
          { label: "ID", value: (row) => row?._id || "" },
          { label: "Type", value: (row) => row?.type || "" },
          { label: "Image Path", value: (row) => row?.image || "" },
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
        content: allRows,
      },
    ];
    try {
      xlsx(excelData, settings);
      toast.success("Exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>

      {/* Header: Search + Export */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4"></div>

        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => exportFunc(data)}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition-colors"
            aria-label="Export hero sections to Excel"
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
          {hasPermission("HeroSection", "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              data-aos="fade-left"
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
              aria-label="Add new HeroSection"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn />
                  Add HeroSection
                </span>
              ) : (
                "Add HeroSection"
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <TableContainer
          component={Paper}
          className="rounded-xl shadow-lg overflow-hidden"
        >
          <Table sx={{ minWidth: 700 }} aria-label="hero section table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={5}
                    align="center"
                    className="py-8 text-gray-500 text-lg"
                  >
                    No hero sections found
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </StyledTableCell>

                    {/* Image */}
                    <StyledTableCell>
                      {row.image ? (
                        <img
                          className="h-12 w-16 rounded-md object-cover border-2 border-gray-200 shadow-sm"
                          src={attachUrl(row.image)}
                          alt={row.type || "Hero section image"}
                          onError={(e) =>
                            (e.target.src = "/assets/placeholder.png")
                          }
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                          N/A
                        </div>
                      )}
                    </StyledTableCell>

                    {/* Type */}
                    <StyledTableCell className="text-gray-600">
                      {row.type || "N/A"}
                    </StyledTableCell>

                    {/* Status */}
                    <StyledTableCell>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          row.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.status ? "Active" : "Inactive"}
                      </span>
                    </StyledTableCell>

                    {/* Actions – only UPDATE */}
                    <StyledTableCell align="center">
                      {hasPermission("HeroSection", "update") && (
                        <>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, row.id)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label={`Actions for hero section ${
                              row.type || row.id
                            }`}
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
                            <MenuItem
                              onClick={() => {
                                // route adjust karo as per your routes
                                navigate(`update/${row.id}`);
                                handleMenuClose();
                              }}
                              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                            >
                              <PencilIcon className="h-5 w-5 text-green-600" />
                              Edit
                            </MenuItem>
                          </Menu>
                        </>
                      )}
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
        totalPages={totalPages}
        totalRecord={totalRecord}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}
