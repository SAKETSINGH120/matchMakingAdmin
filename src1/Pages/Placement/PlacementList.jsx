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
import { getAllPlacement, placementDelete } from "../../Services/PlacementApi";
import { Modal } from "antd";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import { useAuth } from "../../auth/AuthContext";
import PaginationManager from "../../compoents/PaginationManager";
import CollegeDropdown from "../EnteranceExam/components/CollegeDropdown";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import { ClearBtn } from "../../compoents/Button";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../utils/tableStyleTemplates";
import useSetCollege from "../../hooks/useSetCollege";

export default function PlacementList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQueryFromUrl, page, rowsPerPage, collegeId } =
    getValFromSearchParams({
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
  const [selectedCollege, setSelectedCollege] = useState(null);
  const isFilterApply = selectedCollege;
  useSetCollege(collegeId, (data) => setSelectedCollege(data));

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
        collegeId,
      } = getValFromSearchParams({ searchParams });
      const result = await getAllPlacement({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
        college: collegeId ?? "",
      });
      if (result?.status) {
        toast.success("Placements fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(result?.message || "Failed to fetch placements.");
      }
    } catch (error) {
      console.error("Error fetching placements:", error);
      toast.error("Error fetching placements.");
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
      title: "Delete Placement",
      content:
        "Are you sure you want to delete this placement record? This action cannot be undone.",
      okText: loading ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: loading },
      onOk: async () => {
        try {
          setLoading(true);
          const result = await placementDelete(id);
          if (result?.status) {
            toast.success("Placement deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete placement.");
          }
        } catch (error) {
          console.error("Error deleting placement:", error);
          toast.error("Error deleting placement.");
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
      navigate("createplacement"); // Adjusted route; change if needed
      setIsLoading(false);
    }, 300);
  };

  const getLatestStat = (statsArray, yearKey = "2024") => {
    if (!statsArray || statsArray.length === 0) return "N/A";
    const latest = statsArray.find((s) => s.year === yearKey);
    return latest?.statistics || "N/A";
  };

  const formatYearlyStats = (statsArray) => {
    if (!statsArray || statsArray.length === 0) return "N/A";
    return statsArray
      .map((s) => `${s.year}: ${s.statistics || "N/A"}`)
      .join(" | ");
  };

  const exportFunc = async (allLeadsData) => {
    if (allLeadsData.length < 1) {
      return toast.error("Placement list is empty!");
    }
    setIsExporting(true);

    const settings = {
      fileName: "_Placements",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };

    const data = [
      {
        sheet: "Placement List",
        columns: [
          { label: "ID", value: (row) => row?._id || "" },
          {
            label: "College Name",
            value: (row) => row?.college?.collegeName || "",
          },
          {
            label: "Offers Made (All Years)",
            value: (row) => formatYearlyStats(row?.offerMade),
          },
          {
            label: "Average Salary (All Years)",
            value: (row) => formatYearlyStats(row?.averageSalary),
          },
          {
            label: "Highest Salary (All Years)",
            value: (row) => formatYearlyStats(row?.highestSalary),
          },
          {
            label: "Students Placed (All Years)",
            value: (row) => formatYearlyStats(row?.studentPlaced),
          },
          {
            label: "Companies Visited (All Years)",
            value: (row) => formatYearlyStats(row?.companyVisited),
          },
          { label: "Description", value: (row) => row?.description || "" },
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

  const handleOnSelectCollege = (college) => {
    setSelectedCollege(college);
    const sp = new URLSearchParams(searchParams);
    sp.set("college", college?._id);
    sp.set("page", "1");
    setSearchParams(sp, { replace: true });
  };

  const handleClearFilters = () => {
    setSelectedCollege(null);
    const sp = new URLSearchParams(searchParams);
    sp.delete("college");
    sp.delete("page");
    setSearchParams(sp, { replace: true });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* <input
            type="text"
            placeholder="Search placements by College Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
            aria-label="Search placements by college name"
          />
          <button
            onClick={() => {
              setSearchQuery(search);
              setPage(1);
            }}
            className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2.5 rounded-lg font-medium"
          >
            Search
          </button> */}
          <CollegeDropdown
            onSelect={handleOnSelectCollege}
            selected={selectedCollege}
            className="min-w-60"
          />
          {isFilterApply && <ClearBtn handleClear={handleClearFilters} />}
        </div>
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => exportFunc(data)}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition-colors"
            aria-label="Export placements to Excel"
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
          {hasPermission("Placement", "create") && ( // Adjusted permission resource name; change if needed
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              data-aos="fade-left"
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
              aria-label="Add new placement"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoderBtn />
                  Add Placement
                </span>
              ) : (
                "Add Placement"
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
          <Table sx={{ minWidth: 700 }} aria-label="placement table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>College</StyledTableCell>
                <StyledTableCell>Highest Salary </StyledTableCell>
                <StyledTableCell>Avg Salary </StyledTableCell>
                <StyledTableCell>Offers Made </StyledTableCell>
                <StyledTableCell>Students Placed </StyledTableCell>
                <StyledTableCell>Companies Visited </StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={8}
                    align="center"
                    className="py-8 text-gray-500 text-lg"
                  >
                    No placements found
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell className="font-medium text-gray-800">
                      {row.college?.collegeName || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        {getLatestStat(row.highestSalary, "2024")}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {getLatestStat(row.averageSalary, "2024")}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell className="text-gray-600">
                      {getLatestStat(row.offerMade, "2024")}
                    </StyledTableCell>
                    <StyledTableCell className="text-gray-600">
                      {getLatestStat(row.studentPlaced, "2024")}
                    </StyledTableCell>
                    <StyledTableCell className="text-gray-600">
                      {getLatestStat(row.companyVisited, "2024")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, row.id)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={`Actions for ${row.college?.collegeName}`}
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
                        {hasPermission("Placement", "read") && (
                          <MenuItem
                            onClick={() => {
                              navigate(`placementView/${row.id}`); // Adjusted route; change if needed
                              handleMenuClose();
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                          >
                            <EyeIcon className="h-5 w-5 text-blue-600" />
                            View
                          </MenuItem>
                        )}
                        {hasPermission("Placement", "update") && (
                          <MenuItem
                            onClick={() => {
                              navigate(`updateplacement/${row.id}`); // Adjusted route; change if needed
                              handleMenuClose();
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="h-5 w-5 text-green-600" />
                            Edit
                          </MenuItem>
                        )}
                        {hasPermission("Placement", "delete") && (
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
        rowsPerPage={rowsPerPage}
        page={page}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        totalPages={totalPages}
        totalRecord={totalRecord}
      />
    </div>
  );
}
