import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import GenericTable from "../../compoents/Table";

// ↓ Replace with your actual API service
import { getAllMatches } from "../../Services/MatchApi";   // ← adjust path & name

export default function MatchList() {
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllMatches({
        page,
        limit: rowsPerPage,
        search: searchQuery,
      });

      let matches = [];
      let totalPage = 1;
      let totalResult = 0;

      // Flexible response handling (different API structures)
      if (result?.success && Array.isArray(result?.data)) {
        matches = result.data;
        totalResult = result.meta?.total || matches.length;
        totalPage = result.meta?.totalPages || Math.ceil(totalResult / rowsPerPage) || 1;
      } else if (result?.data?.matches) {
        matches = result.data.matches;
        totalPage = result.data.totalPages || 1;
        totalResult = result.data.total || matches.length;
      } else {
        console.warn("Unexpected API structure:", result);
        toast.error("Invalid data received from server");
      }

      setData(matches);
      setTotalPages(totalPage);
      setTotalRecord(totalResult);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error(error?.message || "Failed to load matches");
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

  // ────────────────────────────────────────────────
  //           TABLE COLUMNS
  // ────────────────────────────────────────────────
  const columns = [
    {
      label: "S.No",
      key: "sno",
      align: "center",
      render: (_, __, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      label: "Name",
      key: "name",
      render: (_, row) => row?.name || "—",
    },
    {
      label: "Number",
      key: "number",
      render: (_, row) => row?.number || "—",
    },
    {
      label: "Gender",
      key: "gender",
      align: "center",
      render: (value) => (
        <span className="capitalize">{value || "—"}</span>
      ),
    },
    {
      label: "Premium",
      key: "isPremium",
      align: "center",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker title="Match List" />
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or number..."
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

        {/* You can add Export button later like in RedeemAgentList */}
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